import { cosineDistance, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { chunks } from "../db/schema";
import { CHAT_MODEL, TOP_K } from "./config";
import { ai, embedTexts, withRetry, type RetryOptions } from "./embed";

export type Hit = { id: number; page: number; kind: string; content: string; score: number };
export type Answer = { answer: string; hits: Hit[] };

export const REFUSAL = "Not in the document.";

const SYSTEM_PROMPT = `You answer questions about one document using ONLY the excerpts provided.
- Use no outside knowledge and add nothing that is not in the excerpts.
- Cite the PDF page number(s) you used, like (page 12).
- If the excerpts do not contain the answer, reply exactly: ${REFUSAL}`;

export async function retrieve(question: string, topK = TOP_K, retry?: RetryOptions): Promise<Hit[]> {
  const [queryVector] = await embedTexts([question], "RETRIEVAL_QUERY", retry);
  const similarity = sql<number>`1 - (${cosineDistance(chunks.embedding, queryVector)})`;
  return db
    .select({ id: chunks.id, page: chunks.page, kind: chunks.kind, content: chunks.content, score: similarity })
    .from(chunks)
    .orderBy(desc(similarity))
    .limit(topK);
}

export async function generateAnswer(question: string, hits: Hit[]): Promise<string> {
  const excerpts = hits.map((h) => `[page ${h.page}]\n${h.content}`).join("\n\n");
  const res = await withRetry(() =>
    ai.models.generateContent({
      model: CHAT_MODEL,
      contents: `Excerpts:\n${excerpts}\n\nQuestion: ${question}`,
      config: { systemInstruction: SYSTEM_PROMPT, temperature: 0 },
    }),
  );
  return (res.text ?? "").trim();
}

export async function answerQuestion(question: string): Promise<Answer> {
  const hits = await retrieve(question);
  return { answer: await generateAnswer(question, hits), hits };
}
