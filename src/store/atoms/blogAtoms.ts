import { atom } from "recoil";

export const selectedBlogIdState = atom<string | null>({
    key: 'selectedBlogIdState',
    default: null    
});
