import { Embedder } from "hf-embedder";

const PORT = 8200;

// Ленивая загрузка: модель инициализируется при первом запросе
let embedderPromise: Promise<Embedder> | null = null;

async function getEmbedder(): Promise<Embedder> {
  if (!embedderPromise) {
    console.log("[bekko] Loading model on first request...");
    embedderPromise = Embedder.create({
      model: "hotchpotch/bekko-embedding-v1-a8m",
      dtype: "q8",          // int8 для эмбеддинг-таблицы, как в официальном ONNX
      device: "cpu",
      normalize: true,       // L2-нормализация для косинусного сходства
      cacheSize: 500,        // in-memory кеш результатов
      model_kwargs: {
        file_name: "onnx/model.onnx",   // ← ключевое изменение
        },
    });
  }
  return embedderPromise;
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok", model_loaded: embedderPromise !== null });
    }

    if (url.pathname === "/embed" && req.method === "POST") {
      try {
        const body = await req.json();
        // Ожидаем: { "texts": ["...", "..."] } или { "source": "...", "translation": "..." }
        let texts: string[];
        if (body.source && body.translation) {
          texts = [body.source, body.translation];
        } else if (Array.isArray(body.texts)) {
          texts = body.texts;
        } else {
          return Response.json({ error: "provide 'texts' or 'source'+'translation'" }, { status: 400 });
        }

        const embedder = await getEmbedder();
        const vectors = await embedder.embed(texts);

        // Если передана пара source+translation — сразу считаем cosine
        if (body.source && body.translation) {
          const a = vectors[0];
          const b = vectors[1];
          let dot = 0;
          for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
          return Response.json({
            source_embedding: Array.from(a),
            translation_embedding: Array.from(b),
            cosine_similarity: dot,
          });
        }

        return Response.json({ embeddings: vectors.map(v => Array.from(v)) });
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 500 });
      }
    }

    return Response.json({ error: "not found" }, { status: 404 });
  },
});

console.log(`[bekko] listening on ${PORT}`);