import { debounce } from 'lodash';
import { useEffect } from 'react';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import UserService from '../services/userService';
import { User } from "../types/UserTypes";

type UseUserState = {
  user: User | null;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  getUser: () => Promise<User>;
  refreshUser: () => Promise<User>;
  setUser: (data: {name: string}) => void;
}

const useUserStore = create<UseUserState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: false,
      setLoading: (isLoading: boolean) => set(state => ({ ...state, isLoading })),
      getUser: async () => {
        get().setLoading(true);
        const user = await UserService.getUser();
        set(state => ({ ...state, user, isLoading: false }));
        return user;
      },
      refreshUser: debounce(() => get().getUser(), 100) as UseUserState['refreshUser'],
      setUser: async ({name}: {name: string}) => {
        const user = await UserService.setUser(name);
        set((state) => ({...state, user}))
      },
    })
  )
);


const useUser =() => {
  const store = useUserStore();

  useEffect(() => {
    store.refreshUser();
  }, [])

  return store;
}

export default useUser;
