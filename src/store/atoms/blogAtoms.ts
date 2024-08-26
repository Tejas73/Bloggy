import { atom } from "recoil";

interface BlogLikes {
    blogId: string,
    blogliked: boolean,
    userId: string
}

interface BlogField {
    title: string,
    description: string,
    id: string,
    authorId: string,
    blogLike: number,
    profile: {
        bio: string,
        id: string,
        name: string,
        userId: string
    },
    comments: { length: number },
    blogLikes: Array<BlogLikes>
}

export const currBlogState = atom<BlogField[] | null>({
    key: 'currBlogState',
    default: []    
});
