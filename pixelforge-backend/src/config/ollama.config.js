import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import 'dotenv/config';

export const llm = new ChatOllama({
    model: process.env.OLLAMA_LLM,
    temperature: 0.2,
    think: false,     // skip qwen3's hidden reasoning step (much faster)
    keepAlive: '30m'  // keep the model loaded between questions
});

export const embeddingModel = new OllamaEmbeddings({
    model: process.env.OLLAMA_EMBEDDING_MODEL,
    baseUrl: "http://localhost:11434",
});