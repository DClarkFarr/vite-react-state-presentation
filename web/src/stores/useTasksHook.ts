import { useEffect, useState } from "react";
import { TaskFormState } from "../components/Forms/TaskForm";
import TaskService from "../services/taskService";
import { Task } from "../types/TaskTypes";
import { debounce } from 'lodash';

const useTasksHook = (options: Partial<{completed: boolean, userId: number}> = {}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const createTask = async (values: TaskFormState) => {
    setIsCreating(true);
    try {
      const task = await TaskService.create(values);
      setTasks([...tasks, task]);
    }catch(err){
      console.error('error creating task', err);
    }
    setIsCreating(false);
  }

  const updateTask = async (id: number, data: Partial<{completed: boolean, title: string}>) => {
    const index = tasks.findIndex(task => task.id === id);
    
    setIsUpdating(true);
    try {
      const task = await TaskService.update(id, data);
      const ts = [...tasks];
      ts.splice(index, 1, task);
      setTasks(ts);
    }catch(err){
      console.error('error updating task', err);
    }
    setIsUpdating(false);
  }

  /**
   * STEP 1
   */
  const refreshTasks = async () => {
    setIsLoading(true);
    try {
      await TaskService.list(options).then(setTasks);
    }catch(err){
      console.warn('error refreshing tasks', err);
    }
    setIsLoading(false);
    
    if(!hasLoaded) {
      setHasLoaded(true);
    }
  }

  /** 
   * STEP 2
   */
  // const refreshTasks = debounce(async () => {
  //   setIsLoading(true);
  //   try {
  //     await TaskService.list(options).then(setTasks);
  //   }catch(err){
  //     console.warn('error refreshing tasks', err);
  //   }
  //   setIsLoading(false);
    
  //   if(!hasLoaded) {
  //     setHasLoaded(true);
  //   }
  // }, 100);

  /**
   * Single query on init
   */
  useEffect(() => {
    /**
     * NOTE 1
     * Try to avoid repeated queries, right?
     */
    if(!isLoading && !hasLoaded) {
      refreshTasks();
    }
  }, []);

  /**
   * Update task list when hook options change
   */
  useEffect(() => {
    /**
     * NOTE 2
     * Do we get duplicate queries?
     */
    console.log('options changed, when', hasLoaded)
    refreshTasks();

    // Must serialize options, because obj === obj will fail as it's technically a different object
  }, [JSON.stringify(options)]);

  return {
    tasks,
    isLoading,
    isUpdating,
    isCreating,
    createTask,
    updateTask,
    hasLoaded,
  }
}

export default useTasksHook;
