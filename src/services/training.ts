// src/services/training.ts
import { api, ApiError } from "./api";
import type { TrainingTask, TrainingSubmitItem } from "../types/training";

export async function fetchTrainingTasks(): Promise<TrainingTask[]> {
  try {
    const isCyrillic = (value: string) => /[\u0400-\u04FF]/.test(value);

    const res = await api.get<unknown>("/words/tasks");
    const raw = res.data as
      | TrainingTask[]
      | { tasks?: TrainingTask[]; results?: TrainingTask[]; words?: unknown[] };
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.tasks)
      ? raw.tasks
      : Array.isArray(raw.results)
      ? raw.results
      : Array.isArray(raw.words)
      ? raw.words
      : [];

    const byId = new Map<
      string,
      { en?: string; ua?: string; task?: "en" | "ua"; fallback?: string }
    >();

    list.forEach((item) => {
      const record = item as Record<string, unknown>;
      const id =
        (record.id as string | undefined) ??
        (record._id as string | undefined) ??
        "";
      if (!id) return;
      const entry = byId.get(id) ?? {};
      const en = (record.en as string | undefined) ?? "";
      const ua = (record.ua as string | undefined) ?? "";
      const taskValue = (record.task as string | undefined) ?? "";
      const fallback =
        (record.question as string | undefined) ??
        (record.word as string | undefined) ??
        "";
      // normalize stored values by trimming
      if (en) entry.en = (en as string).trim();
      if (ua) entry.ua = (ua as string).trim();
      if (taskValue === "en" || taskValue === "ua") {
        entry.task = taskValue;
      }
      if (fallback && !entry.fallback) {
        entry.fallback = fallback.trim();
      }
      byId.set(id, entry);
    });

    const mapped = Array.from(byId.entries())
      .map(([id, pair]) => {
        const task = pair.task ?? "en";
        const fallback = pair.fallback ?? "";
        const fallbackIsCyrillic = isCyrillic(fallback);

        const finalEn =
          pair.en ||
          (!fallbackIsCyrillic ? fallback : "") ||
          (task === "ua" ? fallback : "");
        const finalUa =
          pair.ua ||
          (fallbackIsCyrillic ? fallback : "") ||
          (task === "en" ? fallback : "");
        const question = task === "en" ? finalUa || "" : finalEn || "";

        return question
          ? ({
              id,
              question,
              task,
              en: finalEn,
              ua: finalUa,
            } satisfies TrainingTask)
          : null;
      })
      .filter((item): item is TrainingTask => item !== null);

    if (import.meta.env.DEV && mapped.length === 0) {
      console.log("fetchTrainingTasks empty", res.data);
    }

    return mapped;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to fetch training tasks", 500);
  }
}

export async function submitTraining(payload: TrainingSubmitItem[]) {
  try {
    console.log("submitTraining payload (raw)", payload);

    const toSend = payload.map((p) => ({
      _id: p._id,
      en: p.en,
      ua: p.ua,
      task: p.task,
    }));
    console.log("submitTraining payload (sanitized)", toSend);
    console.log("api baseURL", api.defaults.baseURL);
    console.log("posting to", `${api.defaults.baseURL ?? ""}/words/answers`);
    const res = await api.post<unknown>("/words/answers", toSend);
    const data = res.data;
    if (Array.isArray(data)) {
      console.log(
        "submitTraining response details",
        data.map((item) => {
          const record = item as Record<string, unknown>;
          return {
            id:
              (record._id as string | undefined) ??
              (record.id as string | undefined),
            en: record.en,
            ua: record.ua,
            progress: record.progress,
          };
        })
      );
      console.log("submitTraining response", data);
      return { score: data.length };
    }

    console.log("submitTraining response", data);
    return data as { score: number };
  } catch (err) {
    console.error("submitTraining error", err);
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to submit training", 500);
  }
}
