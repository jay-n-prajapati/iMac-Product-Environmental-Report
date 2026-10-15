export const DOCUMENT_NAME = "iMac Product Environmental Report";
export const PDF_PATH = "data/iMac_PER_Oct2024.pdf";

export const CHUNK_SIZE = 900;
export const CHUNK_OVERLAP = 135; // ~15%

export const EMBEDDING_MODEL = "gemini-embedding-001";
export const CHAT_MODEL = "gemini-3.8-flash";
export const EMBED_BATCH_SIZE = 20;

export const TOP_K = 5;

// Label for the ingestion pipeline; bump the versions when extraction or chunking changes so ingest re-embeds.
export const PIPELINE = "plain-text-v1";
export const CLEAN_VERSION = "plain-text-v1";
export const CHUNK_VERSION = "plain-text-v1";
