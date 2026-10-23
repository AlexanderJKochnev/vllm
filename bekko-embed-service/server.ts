import { pipeline, env } from "@huggingface/transformers";

// ============================================================
// 1. Офлайн-режим: никогда не обращаться к huggingface.co
// ============================================================
env.allowRemoteModels = false;
env.localModelPath = "/app/models/";
env.useFSCache = false;

const PORT = 8200;
const DEFAULT_MODEL = "hotchpotch/bekko-embedding-v1-a8m";

// ============================================================
// 2. Управление текущей моделью (переключение на лету)
// ============================================================
let currentModelId: string | null = null;
let currentExtractor: any = null;

async function getExtractor(modelId: string): Promise<any> {
  // Если запрашивается та же модель — возвращаем напрямую
  if (currentModelId === modelId && currentExtractor) {
    return currentExtractor;
  }

  // Переключение: сначала освобождаем старую модель
  if (currentExtractor) {
    console.log(`[bekko] Disposing model ${currentModelId}...`);
    try {
      await currentExtractor.dispose();
    } catch (e) {
      console.warn(`[bekko] dispose failed:`, e);
    }
    currentExtractor = null;
    currentModelId = null;
  }

  console.log(`[bekko] Loading model ${modelId}...`);
  const t0 = Date.now();
  currentExtractor = await pipeline("feature-extraction", modelId, {
    dtype: "fp32",
    device: "cpu",
  });
  currentModelId = modelId;
  console.log(`[bekko] Model ${modelId} loaded in ${Date.now() - t0} ms`);
  return currentExtractor;
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
// 4. HTTP-сервер
// ============================================================
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // --- health ---
    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        current_model: currentModelId,
        model_loaded: currentExtractor !== null,
      });
    }

    // --- embed ---
    if (url.pathname === "/embed" && req.method === "POST") {
      try {
        const body = await req.json();

        const modelId: string = body.model || DEFAULT_MODEL;

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

        const extractor = await getExtractor(modelId);

        const t0 = Date.now();
        const output = await extractor(texts, {
          pooling: "mean",
          normalize: true,
        });
        const inferMs = Date.now() - t0;

        // output — Tensor [batch, hidden]
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
            model: modelId,
            inference_ms: inferMs,
            source_embedding: vectors[0],
            translation_embedding: vectors[1],
            cosine_similarity: cosine(vectors[0], vectors[1]),
          });
        }

        return Response.json({
          model: modelId,
          inference_ms: inferMs,
          embeddings: vectors,
        });
      } catch (e: any) {
        console.error("[bekko] embed error:", e);
        return Response.json(
          { error: e.message ?? String(e) },
          { status: 500 }
        );
      }
    }

    return Response.json({ error: "not found" }, { status: 404 });
  },
});

console.log(`[bekko] listening on ${PORT}`);