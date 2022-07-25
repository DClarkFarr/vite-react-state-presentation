import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "../services/userService";
import { User } from "../types/UserTypes";
const useUserQuery = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    error: errorMessage,
    isLoading,
    refetch: refetchUser,
  } = useQuery(
    ["user"],
    () => {
      return UserService.getUser();
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (queriedUser) => {
        /**
         * Trigger any task queries for this user to be re-fetched
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
          queryClient.setQueryData<User | null>(["user"], optimisticUser);

          return { optimisticUser };
        },
        onError: (error, variables, context) => {
          queryClient.setQueryData<User | null>(
            ["user"],
            context?.optimisticUser || null
          );
        },
        onSuccess: (data) => {
          queryClient.setQueryData<User | null>(["user"], data);
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
