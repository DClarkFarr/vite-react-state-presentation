import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "../services/userService";
import { User } from "../types/UserTypes";
const useUserQuery = () => {
  const queryClient = useQueryClient();

  const queryKey = ['user'];

  const {
    data: user,
    error: errorMessage,
    isLoading,
    refetch: refetchUser,
  } = useQuery(
    queryKey,
    () => {
      return UserService.getUser();
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (queriedUser) => {
        /**
         * NOTE 5
         * Trigger any task queries for this user to be re-fetched
         * 
         * IMPORTANT 
         * QueryClient is not re-render safe, so this works best 
         * when you are using the query you are invalidating a query
         * that you are using.
         */
        queryClient.invalidateQueries({
          predicate: (query) => {
            return (
              query.queryKey[0] === "tasks" &&
              query.queryKey[1] === queriedUser.id
            );
          },
        });
      },
    }
  );

  /**
   * NOTE 6
   * - use onMutate for optimistic updates.  Return context values to reset state on error.
   */
  const { isLoading: isUpdatingUser, mutateAsync: setUserMutation } =
    useMutation(
      ["set-user"],
      (data: { name: string }) => {
        return UserService.setUser(data.name);
      },
      {
        onMutate: ({ name }) => {
          const optimisticUser = {
            id: -666, // an ID we know we won't get back from the server
            name,
          };
          queryClient.setQueryData<User | null>(queryKey, optimisticUser);

          return { oldUser: user, optimisticUser };
        },
        onError: (error, variables, context) => {
          queryClient.setQueryData<User | null>(
            queryKey,
            context?.oldUser || null
          );
        },
        onSuccess: (user) => {
          queryClient.setQueryData<User | null>(queryKey, user);
        },
      }
    );

  const setUser = (data: { name: string }) => setUserMutation(data);

  return {
    user: user || null,
    errorMessage: errorMessage,
    isLoading: isLoading,
    refetchUser: refetchUser,
    setUser,
  };
};

export default useUserQuery;
