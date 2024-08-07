import { atom } from "recoil";

export const isLoggedIn = atom({
    key: 'isLoggedIn',
    default: { isAuthenticated: false }
});

export const currUserId = atom({
    key: 'currUserId',
    default: { userID: null }
  });