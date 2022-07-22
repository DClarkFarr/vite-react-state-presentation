import { debounce } from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import { UserFormState } from "../components/Forms/UserForm";
import UserService from "../services/userService";
import { User } from "../types/UserTypes";

export const createUserStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUser = async (values: UserFormState) => {
    setIsUpdating(true);
    try {
      const user = await UserService.setUser(values.name);
      setUser(user);
    }catch(err){
      console.log("error updating user", err);
    }
    setIsUpdating(false);
  } 

  const getUser = async () => {
    setIsLoading(true);
    try {
      const user = await UserService.getUser()
      setUser(user);
    }catch(err){
      console.log("error getting user", err);
    }
    setIsLoading(false);
  }

  const refreshUser = debounce(() => {
    return getUser();
  }, 100);

  useEffect(() => {
    refreshUser();
  }, []);


  return {
    user,
    refreshUser,
    updateUser,
    isLoading,
    isUpdating,
  }
}

type UserContextState = ReturnType<typeof createUserStore>

export const UserContext = createContext<UserContextState>({} as UserContextState);


export const useUserStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserStore must be used within a UserContext");
  }
  return context;
}
