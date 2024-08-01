import { atom } from 'recoil';

export interface Comment {
  profile: any;
  id: string;
  comment: string;
  commentDislikes: number;
  commentLikes: number;
  userId: string;
}

//for fetching comments from the server
export const currCommentState = atom<Comment[]>({
  key: 'currCommentState ',
  default: [],
});

//to provide the id for the intended comment
export const selectedCommentIdState = atom<string | null>({
  key: 'selectedCommentIdState',
  default: null,
});

//for editing a comment based on boolean value of editCommentState
export const editCommentState = atom<boolean>({
  key: 'editCommentState',
  default: false
})

export const selectedCommentState= atom<string | null>({
  key: 'selectedCommentState',
  default: null,
});

