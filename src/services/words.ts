import { request } from "./api";
import type { Word } from "../types/words";

export type WordsResponse = {
  items: Word[];
  total: number;
};

export function fetchWords(query: string) {
  return request<WordsResponse>(`/words${query}`);
}

export function addWord(payload: {
  en: string;
  ua: string;
  category: string;
  verbType?: string;
}) {
  return request<Word>("/words", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateWord(
  wordId: string,
  payload: { en: string; ua: string }
) {
  return request<Word>(`/words/${wordId}` as const, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteWord(wordId: string) {
  return request<void>(`/words/${wordId}` as const, {
    method: "DELETE",
  });
}
