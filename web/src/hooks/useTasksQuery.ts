import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { Task, TaskListOptions, TaskPostData } from "../types/TaskTypes";
import TaskService from "../services/taskService";
import { useMemo } from "react";


/**
 * NOTE 1 
 * With options, we can simultaneously handle multiple task queries such as:
 * - all tasks (ex: options = {})
 * - all completed tasks: (ex: options = { completed: true })
 * - all incomplete tasks: (ex: options = { completed: false })
 * - user tasks (ex: options = { userId: 123 })
 * - user completed tasks (ex: options = { userId: 123, completed: true })
 * - user incomplete tasks (ex: options = { userId: 123, completed: false })
 */
const useTasksQuery = (
  { isGeneric, ...options }: TaskListOptions & { isGeneric: boolean } = {
    isGeneric: true,
  }
) => {

  /**
   * NOTE 4.A
   * Query key can be a string, but it's better to use an array of values. We'll see why later.
   */
  const queryKey = [
    "tasks",
    options.userId || null,
    typeof options.completed === "boolean" ? options.completed : null,
  ];

  const queryClient = useQueryClient();

  /**
   * NOTE 4.C
   * Match queries based on the following criteria:
   *  - is a "tasks" query set
   *  - update applicable "completed" status query set
   *    -- task query "completed" status matches the tasks "completed" status
   *    -- task query "completed" status is null 
   */
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

  /**
   * NOTE 2
   * In react query, all aspects of query state are always defined. Data is undefined until query completes.
   */
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
      /**
       * NOTE 3
       * Customizing re-query
       */
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
          /**
           * NOTE 4.B
           * Need to apply created task to all relevant query sets
           */
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
          /**
           * NOTE 4.B
           * Need to apply updated task to all relevant query sets
           */
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
