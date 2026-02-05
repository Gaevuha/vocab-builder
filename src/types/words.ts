export type Category = string;

export type Word = {
  id: string;
  en: string;
  ua: string;
  category: Category;
  progress: number;
  isIrregular?: boolean;
};

export type WordsResponse = {
  items: Word[];
  total: number;
};

export type FetchWordsParams = {
  keyword?: string;
  category?: Category;
  isIrregular?: boolean;
  page?: number;
  limit?: number;
};

export type Statistics = {
  totalCount: number;
};

export type CreateWordPayload = {
  en: string;
  ua: string;
  category: Category;
  isIrregular?: boolean;
};

export type UpdateWordPayload = {
  en: string;
  ua: string;
};
export type WordDto = {
  _id: string;
  en: string;
  ua: string;
  category: string;
  progress: number;
  isIrregular?: boolean;
};
export type WordsResponseDto = {
  results: WordDto[];
  totalPages: number;
  page: number;
  perPage: number;
};

export type WordsTableProps = {
  words: Word[];
  withActions?: boolean;
  onEdit?: (word: Word) => void;
  onDelete?: (word: Word) => void;
  onAddToDictionary?: (word: Word) => void;
};

export type WordsPaginationProps = {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};
