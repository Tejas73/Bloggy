import { commentsState } from '../atoms/commentAtoms';
// import { commentsState } from '../atoms/commentsState';
// import { Comment } from '../types';

export const commentByIdSelector = selectorFamily<Comment | undefined, string>({
  key: 'commentByIdSelector',
  get: (id: string) => ({ get }) => {
    const comments = get(commentsState);
    return comments.find(comment => comment.id === id);
  },
});
