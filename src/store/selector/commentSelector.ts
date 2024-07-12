import { selector } from "recoil";
import { currCommentState, selectedCommentIdState } from "../atoms/commentAtoms";

export const selectedCommentState = selector({
    key: 'selectedCommentState',
    get: ({get})=>{
        const comments =  get(currCommentState);
        const selectedCommentId = get(selectedCommentIdState);
        return comments.find(comment => comment.id ===  selectedCommentId) || null
    }
})
