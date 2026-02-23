import { api } from "./api";
import type {
  Word,
  WordDto,
  WordsResponse,
  WordsResponseDto,
  FetchWordsParams,
  Category,
  CreateWordPayload,
  UpdateWordPayload,
  Statistics,
} from "../types/words";

const sanitizeWordText = (value: string): string => value.trim();

const sanitizeWordPayload = <T extends { en: string; ua: string }>(
  payload: T
): T => ({
  ...payload,
  en: sanitizeWordText(payload.en),
  ua: sanitizeWordText(payload.ua),
});

const normalizeProgress = (value: unknown): number => {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if ("progress" in record) {
      return normalizeProgress(record.progress);
    }

    if ("percentage" in record) {
      return normalizeProgress(record.percentage);
    }

    if ("value" in record) {
      return normalizeProgress(record.value);
    }

    const done = Number(record.done);
    const total = Number(record.total);
    if (Number.isFinite(done) && Number.isFinite(total) && total > 0) {
      return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
    }
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    if (trimmed.endsWith("%")) {
      const percent = Number(trimmed.slice(0, -1));
      return Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
    }
    const parsedString = Number(trimmed);
    if (!Number.isFinite(parsedString)) return 0;
    if (parsedString > 0 && parsedString <= 1) {
      return Math.round(parsedString * 100);
    }
    return Math.min(100, Math.max(0, parsedString));
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  if (parsed > 0 && parsed <= 1) {
    return Math.round(parsed * 100);
  }
  return Math.min(100, Math.max(0, parsed));
};

export async function fetchOwnWords(
  params: FetchWordsParams
): Promise<WordsResponse> {
  const res = await api.get<WordsResponseDto>("/words/own", { params });

  if (import.meta.env.DEV) {
    console.log("fetchOwnWords raw", {
      params,
      total: res.data.results.length,
      sample: res.data.results.slice(0, 10).map((w) => ({
        id: w._id,
        en: w.en,
        ua: w.ua,
        progressRaw: w.progress,
        progressType: typeof w.progress,
        progressRawJson:
          w.progress && typeof w.progress === "object"
            ? JSON.stringify(w.progress)
            : String(w.progress),
      })),
    });
  }

  const items = res.data.results.map(
    (w: WordDto): Word => ({
      id: w._id,
      en: w.en,
      ua: w.ua,
      category: w.category,
      progress: normalizeProgress(w.progress),
      isIrregular: w.isIrregular,
    })
  );

  if (import.meta.env.DEV) {
    console.log("fetchOwnWords mapped", {
      total: items.length,
      sample: items.slice(0, 10).map((w) => ({
        id: w.id,
        en: w.en,
        ua: w.ua,
        progressMapped: w.progress,
      })),
    });

    console.log(
      "fetchOwnWords progress raw->mapped",
      res.data.results.slice(0, 10).map((w, idx) => ({
        id: w._id,
        raw: w.progress,
        mapped: items[idx]?.progress ?? 0,
      }))
    );
  }

  return {
    items,
    totalPages: Number(res.data.totalPages) || 0,
    perPage: Number(res.data.perPage) || 0,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get("/words/categories");
  return res.data;
}

export async function addWord(payload: CreateWordPayload): Promise<Word> {
  const res = await api.post("/words/create", sanitizeWordPayload(payload));

  return {
    id: res.data._id,
    en: res.data.en,
    ua: res.data.ua,
    category: res.data.category,
    progress: normalizeProgress(res.data.progress),
    isIrregular: res.data.isIrregular,
  };
}

export async function updateWord(
  id: string,
  payload: UpdateWordPayload
): Promise<Word> {
  const res = await api.patch(
    `/words/edit/${id}`,
    sanitizeWordPayload(payload)
  );

  return {
    id: res.data._id,
    en: res.data.en,
    ua: res.data.ua,
    category: res.data.category,
    progress: normalizeProgress(res.data.progress),
    isIrregular: res.data.isIrregular,
  };
}

export async function deleteWord(id: string): Promise<void> {
  await api.delete(`/words/delete/${id}`);
}

export async function fetchStatistics(): Promise<Statistics> {
  const res = await api.get("/words/statistics");
  return res.data;
}

export async function fetchAllWords(
  params: FetchWordsParams
): Promise<WordsResponse> {
  const res = await api.get<WordsResponseDto>("/words/all", { params });

  return {
    items: res.data.results.map(
      (w: WordDto): Word => ({
        id: w._id,
        en: w.en,
        ua: w.ua,
        category: w.category,
        progress: normalizeProgress(w.progress),
        isIrregular: w.isIrregular,
      })
    ),
    totalPages: Number(res.data.totalPages) || 0,
    perPage: Number(res.data.perPage) || 0,
  };
}

export async function addForeignWord(id: string): Promise<Word> {
  const res = await api.post(`/words/add/${id}`);

  return {
    id: res.data._id,
    en: res.data.en,
    ua: res.data.ua,
    category: res.data.category,
    progress: normalizeProgress(res.data.progress),
    isIrregular: res.data.isIrregular,
  };
}
