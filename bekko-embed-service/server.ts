import { pipeline, env } from "@huggingface/transformers";

// ============================================================
// 1. Офлайн-режим: никогда не обращаться к huggingface.co
// ============================================================
env.allowRemoteModels = false;          // запрет скачивания с HF
env.localModelPath = "/app/models/";    // корень локальных моделей
env.useFSCache = false;                 // не искать в старом кеше

const PORT = 8200;
const MODEL_ID = "hotchpotch/bekko-embedding-v1-a8m";

// ============================================================
// 2. Ленивая загрузка: pipeline создаётся при первом запросе
// ============================================================
let extractorPromise: Promise<any> | null = null;

async function getExtractor(): Promise<any> {
  if (!extractorPromise) {
    console.log("[bekko] Loading local model on first request...");
    extractorPromise = pipeline(
      "feature-extraction",
      MODEL_ID,
      {
        dtype: "fp32",      // соответствует onnx/model.onnx (int8-эмбеддинги внутри файла)
        device: "cpu",
      }
    );
  }
  return extractorPromise;
}

// ============================================================
// 3. Косинусное сходство двух векторов
// ============================================================
function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ============================================================
// 4. Извлечение одного вектора из выхода pipeline
//    feature-extraction возвращает Tensor [batch, seq, hidden].
//    Для эмбеддинга берём mean pooling по токенам.
// ============================================================
function meanPool(output: any): number[] {
  // output — Tensor; получаем размерности
  const dims: number[] = output.dims; // [batch, seq, hidden]
  const data: Float32Array = output.data;
  const [batch, seq, hidden] = dims;

  const result: number[] = new Array(hidden).fill(0);
  for (let s = 0; s < seq; s++) {
    for (let h = 0; h < hidden; h++) {
      result[h] += data[s * hidden + h];
    }
  }
  for (let h = 0; h < hidden; h++) result[h] /= seq;
  return result;
}

// ============================================================
// 5. HTTP-сервер
// ============================================================
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // --- health ---
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        model_loaded: extractorPromise !== null,
      });
    }

    // --- embed ---
    if (url.pathname === "/embed" && req.method === "POST") {
      try {
        const body = await req.json();

        let texts: string[];
        let isPair = false;

        if (body.source && body.translation) {
          texts = [body.source, body.translation];
          isPair = true;
        } else if (Array.isArray(body.texts)) {
          texts = body.texts;
        } else {
          return Response.json(
            { error: "provide 'texts' or 'source'+'translation'" },
            { status: 400 }
          );
        }

        const extractor = await getExtractor();

        // Батч: pipeline принимает массив строк
        const output = await extractor(texts, {
          pooling: "mean",
          normalize: true,
        });

        // output — Tensor [batch, hidden] после pooling+normalize
        const dims: number[] = output.dims;
        const data: Float32Array = output.data;
        const batch = dims[0];
        const hidden = dims[1];

        const vectors: number[][] = [];
        for (let b = 0; b < batch; b++) {
          vectors.push(Array.from(data.slice(b * hidden, (b + 1) * hidden)));
        }

        if (isPair) {
          return Response.json({
            source_embedding: vectors[0],
            translation_embedding: vectors[1],
            cosine_similarity: cosine(vectors[0], vectors[1]),
          });
        }

        return Response.json({ embeddings: vectors });
      } catch (e: any) {
        console.error("[bekko] embed error:", e);
        return Response.json({ error: e.message ?? String(e) }, { status: 500 });
      }
    }

    return Response.json({ error: "not found" }, { status: 404 });
  },
});

console.log(`[bekko] listening on ${PORT}`);