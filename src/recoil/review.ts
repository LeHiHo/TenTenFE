import { atom } from 'recoil';

type Keyword = {
  keywordId: number;
  content: string;
};

export const ratingState = atom({
  key: 'ratingState',
  default: 0,
});

export const keywordsState = atom<Keyword[]>({
  key: 'keywordsState',
  default: [],
});

export const contentState = atom({
  key: 'contentState',
  default: '',
});
