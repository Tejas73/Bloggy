import { atom } from 'recoil';

export interface Comment {
    id: string;
    comment: string;
    commentDislikes: number;
    commentLikes: number;
    userId: string;
}

export const commentsState = atom<Comment[]>({
    key: 'commentsState',
    default: [],
});

// export const blogIdState = atom<string | null>({
//     key: 'blogIdState',
//     default: null,
// });

// export const userIdState = atom<string | null>({
//     key: 'userIdState',
//     default: null,
// });