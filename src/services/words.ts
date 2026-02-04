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

export async function fetchOwnWords(
  params: FetchWordsParams
): Promise<WordsResponse> {
  const res = await api.get<WordsResponseDto>("/words/own", { params });

  return {
    items: res.data.results.map(
      (w: WordDto): Word => ({
        id: w._id,
        en: w.en,
        ua: w.ua,
        category: w.category,
        progress: w.progress,
        isIrregular: w.isIrregular,
      })
    ),
    total: res.data.totalPages * res.data.perPage,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get("/words/categories");
  return res.data;
}

export async function addWord(payload: CreateWordPayload): Promise<Word> {
  const res = await api.post("/words/create", payload);

  return {
    id: res.data._id,
    en: res.data.en,
    ua: res.data.ua,
    category: res.data.category,
    progress: res.data.progress,
    isIrregular: res.data.isIrregular,
  };
}

export async function updateWord(
  id: string,
  payload: UpdateWordPayload
): Promise<Word> {
  const res = await api.patch(`/words/edit/${id}`, payload);

  return {
    id: res.data._id,
    en: res.data.en,
    ua: res.data.ua,
    category: res.data.category,
    progress: res.data.progress,
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
        progress: w.progress,
        isIrregular: w.isIrregular,
      })
    ),
    total: res.data.totalPages * res.data.perPage,
  };
}

export async function addForeignWord(id: string): Promise<Word> {
  const res = await api.post(`/words/add/${id}`);

  return {
    id: res.data._id,
    en: res.data.en,
    ua: res.data.ua,
    category: res.data.category,
    progress: res.data.progress,
    isIrregular: res.data.isIrregular,
  };
}
