import React, { useContext, useEffect, useState } from "react";
import TaskService from "../services/taskService";
import { Task } from "../types/TaskTypes";
import { debounce } from "lodash";
export type TasksStore = {
  tasks: Task[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createTask: (data: { name: string }) => Promise<Task>;
  updateTask: (id: number, data: { name: string }) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

export const createTasksStore = (): TasksStore => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createTask = async (data: { name: string }) => {
    setIsCreating(true);
    return TaskService.create(data)
      .then((task) => {
        setTasks([...tasks, task]);
        return task;
      })
      .finally(() => setIsCreating(false));
  };

  const updateTask = async (id: number, data: { name: string }) => {
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

  const refreshTasks = async () => {
    setIsLoading(true);
    return TaskService.list()
      .then((tasks) => {
        setTasks(tasks);
      })
      .finally(() => setIsLoading(false));
  };

  const onMount = debounce(() => {
    if (!isLoading) {
      refreshTasks();
    }
  }, 100);

  useEffect(() => {
    console.log("mounted context tasks store");
    /**
     * STEP 1
     * What, this doesn't work?!?!
     */
    if (!isLoading) {
      refreshTasks();
    }

    /**
     * STEP 2
     */
    // onMount();
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

export const TasksContext = React.createContext<TasksStore>({} as TasksStore);

export const useTasksStore = () => {
  return useContext(TasksContext);
};
