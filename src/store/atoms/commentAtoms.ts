import { atom } from 'recoil';

export interface Comment {
  profile: any;
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

export const editCommentState = atom<boolean>({
  key: 'editCommentState',
  default: false
})

