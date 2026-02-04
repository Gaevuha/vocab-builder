export type Category = {
  id: string;
  name: string;
};

export type Word = {
  id: string;
  en: string;
  ua: string;
  category: string;
  progress: number;
};
