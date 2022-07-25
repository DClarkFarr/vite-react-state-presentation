import { useEffect, useState } from "react";
import { TaskFormState } from "../components/Forms/TaskForm";
import TaskService from "../services/taskService";
import { Task, TasksListOptions } from "../types/TaskTypes";
import { debounce } from 'lodash';

const useTasksHook = (options: TasksListOptions = {}) => {
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

  const getTasks = async () => {
    /**
     * NOTE 3
     * Reducer discussion HERE AND NOW!
     * With react 18, set state calls are grouped, to avoid unnecessary re-renders,
     * making useReducer hateful in every single way
     * 
     * 
     * STEP 3.A
     * PROVE IT:  Uncomment the logs, and compare with profile render counter.
     */
    setIsLoading(true);
    //  console.log('getTasks => setIsLoading(true)');
    try {
      const tasks = await TaskService.list(options)
      setTasks(tasks);
      //  console.log('getTasks => setTasks(tasks)');
    }catch(err){
      console.warn('error refreshing tasks', err);
    }
    setIsLoading(false);
    //  console.log('getTasks => setIsLoading(false)');
    
    if(!hasLoaded) {
      setHasLoaded(true);
      //  console.log('getTasks => setHasLoaded(true)');
    }
  }

  const refreshTasks = debounce(async () => {
    return getTasks();
  }, 100);

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

    /**
     * STEP 1
     */
    getTasks();

    /**
     * STEP 2
     */
    // refreshTasks();

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
