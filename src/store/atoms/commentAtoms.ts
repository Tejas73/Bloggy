import { atom } from 'recoil';

export interface Comment {
  id: string;
  comment: string;
  commentDislikes: number;
  commentLikes: number;
  userId: string;
}

export const currCommentState = atom<Comment[]>({
  key: 'currCommentState ',
  default: [],
});

export const selectedCommentIdState = atom<string | null>({
  key: 'selectedCommentIdState',
  default: null,
});