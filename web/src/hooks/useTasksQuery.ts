import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { Task, TaskListOptions, TaskPostData } from "../types/TaskTypes";
import { isEqual } from "lodash";
import TaskService from "../services/taskService";
import { useMemo } from "react";

const useTasksQuery = (
  { isGeneric, ...options }: TaskListOptions & { isGeneric: boolean } = {
    isGeneric: true,
  }
) => {
  const queryKey = [
    "tasks",
    options.userId || null,
    typeof options.completed === "boolean" ? options.completed : null,
  ];

  const queryClient = useQueryClient();

  const getTaskQueries = (task: Task) => {
    const queries = queryClient.getQueriesData({
      predicate: (query) => {
        return (
          query.queryKey[0] === "tasks" && (query.queryKey[2] === task.completed || query.queryKey[2] === null)
        );
      },
    });

    return queries;
  };

  const addTaskToQueries = (task: Task) => {
    const queries = getTaskQueries(task);

    queries.forEach(([queryKey]) => {
      queryClient.setQueryData<Task[]>(queryKey, (old) => [...(old || []), task]);
    });
  };

  const updateTaskQueries = (task: Task) => {
    const queries = getTaskQueries(task);

    queries.forEach(([queryKey]) => {
      queryClient.setQueryData<Task[]>(queryKey, (old) => {
        if (!old) {
          return [task];
        }
        return old.map((t) => (t.id === task.id ? task : t));
      });
    });
  };

  const {
    data: queryTasks,
    error: errorMessage,
    isLoading,
    refetch: refetchTasks,
  } = useQuery(
    queryKey,
    () => {
      return TaskService.list(options);
    },
    {
      enabled: isGeneric || (!!options.userId && options.userId > 0),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    }
  );

  const tasks = useMemo(() => queryTasks || [], [queryTasks]);

  const { isLoading: isCreating, mutateAsync: createTaskMutation } =
    useMutation(
      ["create-task"],
      (data: { title: string }) => {
        return TaskService.create(data);
      },
      {
        onSuccess(task) {
          addTaskToQueries(task);
        },
      }
    );

  const { isLoading: isUpdating, mutateAsync: updateTaskMutation } =
    useMutation(
      ["update-task"],
      ({ id, data }: { id: number; data: TaskPostData }) => {
        return TaskService.update(id, data);
      },
      {
        onSuccess(task) {
          updateTaskQueries(task);
        },
      }
    );

  const createTask = async (data: { title: string }) =>
    createTaskMutation(data);

  const updateTask = async (id: number, data: TaskPostData) =>
    updateTaskMutation({ id, data });

  return {
    tasks,
    errorMessage,
    isLoading,
    refetchTasks,
    isCreating,
    createTask,
    isUpdating,
    updateTask,
  };
};

export default useTasksQuery;
