# PixelForge – AI-chatbot

En AI-chatbot för webbshoppen PixelForge. Den svarar på frågor om leverans, retur och reklamation med **RAG** (supportdokument i Supabase) och på produktfrågor (pris, kategori, lagerstatus) med **tools** som anropar produkt-API:et. Konversationshistorik skickas med varje fråga så att följdfrågor fungerar.

## Teknik
React, Vite, Node.js/Express, LangChain.js, Ollama, Supabase (pgvector)

## Krav
- Node.js och npm
- Ollama installerat och igång
- Ett Supabase-projekt

## 1. Ollama-modeller
```bash
ollama pull qwen3:4b
ollama pull nomic-embed-text
```

## 2. Supabase
Kör följande i Supabase SQL Editor. Den skapar tabellen `documents` (vector 768 för `nomic-embed-text`) och sökfunktionen `match_documents`:

```sql
create extension if not exists vector;

create table if not exists documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(768)
);

create or replace function match_documents (
  query_embedding vector(768),
  match_count int default null,
  filter jsonb default '{}'
) returns table (id bigint, content text, metadata jsonb, similarity float)
language plpgsql as $$
#variable_conflict use_column
begin
  return query
  select id, content, metadata,
         1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

grant select, insert, update, delete on table public.documents to service_role;
grant usage, select on all sequences in schema public to service_role;
grant execute on function match_documents to service_role;
```

## 3. Backend
```bash
cd pixelforge-backend
npm install
```
Skapa `.env` i `pixelforge-backend/`:
```
SUPABASE_URL=https://ditt-projekt.supabase.co
SUPABASE_KEY=din-service-role-nyckel
OLLAMA_LLM=qwen3:4b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
PORT=8080
```
Ladda upp supportdokumenten och starta servern:
```bash
npm run seed
npm run dev
```

## 4. Frontend
```bash
cd pixelforge-frontend
npm install
npm run dev
```
Öppna http://localhost:5173 och klicka på chattikonen nere till höger.

## Arkitektur
**Backend (`src/ai/`)**
- `chains.ai.js` – router-chain (väljer `rag` eller `tools`) och RAG-chain (standalone-fråga → hämta dokument → svar)
- `retriever.ai.js` – vektorsökning i Supabase via `match_documents`
- `tools.ai.js` – `search_products` och `list_categories`
- `assistant.ai.js` – kör verktygsanrop i en loop tills modellen har ett svar
- `prompts.ai.js` / `schemas.ai.js` – prompts och Zod-schema för routing
- `routes/chat.route.js` – `POST /api/chat`, tar emot `{ question, history }` och svarar `{ answer }`

**Frontend**
- `packages/shared/chatbot/` – chattpanel, meddelanden och `useChat`-hook (historik sparas i localStorage)
- `packages/core/api/` – `askChatbot()` anropar backend
- Chatbotten monteras i `Layout` och syns på alla sidor

