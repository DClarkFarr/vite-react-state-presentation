import { useEffect, useState } from "react";
import { UserFormState } from "../components/Forms/UserForm";
import UserService from "../services/userService";
import { User } from "../types/UserTypes";
import { debounce } from "lodash";

const useUserHook = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const updateUser = async (values: UserFormState) => {
    setIsUpdating(true);
    try {
      const user = await UserService.setUser(values.name);
      setUser(user);
    }catch(err){
      console.error('error updating user', err);
    }
    setIsUpdating(false);
  }

  const getUser = async () => {
    setIsLoading(true);
    try {
      const user = await UserService.getUser();
      setUser(user);
    }catch(err){
      console.warn('error getting user', err);
    }
    setIsLoading(false);
  }

  const refreshUser = debounce(() => getUser(), 100);

  useEffect(() => {
    /**
     * STEP 1
     */
    getUser();

    /**
     * STEP 2
     */
    // refreshUser();
    
  }, []);


  return {
    user,
    isLoading,
    isUpdating,
    updateUser,
    getUser,
  }
}


export default useUserHook;
