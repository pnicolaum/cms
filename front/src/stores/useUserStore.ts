
import {create} from "zustand";

type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
} | null;

interface UserState {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));
