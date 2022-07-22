import React, { useContext, useEffect, useState } from "react";
import TaskService from "../services/taskService";
import { Task, TaskListOptions, TaskPostData } from "../types/TaskTypes";
import { debounce } from "lodash";

/**
 * STEP 1.A
 * Maybe we don't need to maintain this?
 */
// export type TasksStore = {
//   tasks: Task[];
//   isLoading: boolean;
//   isCreating: boolean;
//   isUpdating: boolean;
//   isDeleting: boolean;
//   createTask: (data: { title: string }) => Promise<Task>;
//   updateTask: (id: number, data: TaskPostData) => Promise<Task>;
//   deleteTask: (id: number) => Promise<void>;
//   refreshTasks: (options?: TaskListOptions) => Promise<void>;
// };

export const createTasksStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createTask = async (data: { title: string }) => {
    setIsCreating(true);
    return TaskService.create(data)
      .then((task) => {
        setTasks([...tasks, task]);
        return task;
      })
      .finally(() => setIsCreating(false));
  };

  const updateTask = async (id: number, data: TaskPostData) => {
    setIsUpdating(true);
    return TaskService.update(id, data)
      .then((task) => {
        const ts = [...tasks];
        const i = ts.findIndex((t) => t.id === id);
        ts.splice(i, 1, task);

        setTasks(ts);

        return task;
      })
      .finally(() => setIsUpdating(false));
  };

  const deleteTask = async (id: number) => {
    setIsDeleting(true);
    return TaskService.delete(id).finally(() => setIsDeleting(false));
  };

  const getTasks = async (options?: TaskListOptions) => {
    setIsLoading(true);
    return TaskService.list(options)
      .then((tasks) => {
        setTasks(tasks);
      })
      .finally(() => setIsLoading(false));
  };

  const refreshTasks = debounce(async (options?: TaskListOptions) => {
    if (!isLoading) {
      await getTasks(options);
    }
    /**
     * STEP 1.B
     * Maybe we don't need as TaskStore['refreshTasks']?
     */
  }, 100) /* as TaskStore['refreshTasks'] */;

  useEffect(() => {
    console.log("mounted context tasks store");
    /**
     * STEP 2
     * What, this doesn't work?!?!
     */
    if (!isLoading) {
      // getTasks();
      refreshTasks();
    }
  }, []);

  return {
    tasks,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
};

/**
 * STEP 1.C
 * Now we're dynamic
 */
type TasksStore = ReturnType<typeof createTasksStore>

export const TasksContext = React.createContext<TasksStore>({} as TasksStore);

export const useTasksStore = () => {
  return useContext(TasksContext);
};
