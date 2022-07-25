import { debounce } from 'lodash'
import { useEffect, useMemo } from 'react'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import TaskService from '../services/taskService'
import { Task, TaskListOptions, TaskPostData } from '../types/TaskTypes'

type UseTasksState = {
  tasks: Task[]
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  createTask: (data: {title: string}) => Promise<Task>;
  updateTask: (id: number, data: TaskPostData) => Promise<Task>;
  getTasks: () => Promise<Task[]>;
  refreshTasks: () => Promise<Task[]>;
}

const getOptionKey = (options: TaskListOptions = {}) => {
  let completed = 'all';
  if(typeof options.completed === 'boolean'){
    completed = options.completed ? 'complete' : 'incomplete';
  }
  let userId = 'all';
  if(typeof options.userId === 'number'){
    userId = options.userId.toString();
  }
  return `tasks-${completed}-${userId}`
}

/**
 * NOTE 1
 * Nice persist middleware!
 */

const createTasksScore = (options: TaskListOptions = {}) => {
  console.log('creating store with key', getOptionKey(options));
  return create<UseTasksState>()(
    devtools(
      persist(
        (set, get) => ({
          tasks: [],
          isLoading: false,
          setLoading: (isLoading: boolean) => set(state => ({ ...state, isLoading })),
          updateTask: async (id: number, data: TaskPostData) => {
            get().setLoading(true);
            const task = await TaskService.update(id, data);
  
            set((state) => {
              const index = state.tasks.findIndex(t => t.id === task.id);
              let tasks = state.tasks;
              tasks.splice(index, 1, task);
  
              return {...state, tasks, isLoading: false};
            })
  
            return task;
          },
          createTask: async (data: {title: string}) => {
            const task = await TaskService.create(data);
  
            set((state) => {
              const tasks = [...state.tasks, task];
  
              return {...state, tasks}
            })
  
            return task;
          },
          getTasks: async () => {
            const tasks = await TaskService.list(options);
  
            set((state) => {
              return {...state, tasks}
            })
  
            return tasks;
          },
          refreshTasks: debounce(async () => {
            return get().getTasks();
          }, 100) as UseTasksState['refreshTasks'],
        }),
        {
          name: getOptionKey(options),
        }
      )
    )
  );
}


/**
 * NOTE 3
 * Annoying work-around to be able to maintain parallel stores
 */
type StoreContexts = Record<string, any>;
const contexts: StoreContexts = {};

const getTaskStore = (options: TasksListOptions = {}) => {
  const key = getOptionKey(options);
  if(!contexts[key]){
    contexts[key] = createTasksScore(options);
  }

  return contexts[key];
}


const useTasks = (options: TasksListOptions = {}) => {
  const store = getTaskStore(options)();

  if(!store){
    throw new Error('Could not create task store');
  }

  useEffect(() => {
    if(typeof options.userId === 'number' && options.userId > 0){
      store.refreshTasks();
    }else if(typeof options.userId !== 'number'){
      store.refreshTasks();
    }
  }, [options.userId]);

  const totalTasks = useMemo(() => store.tasks.length, [store.tasks]);

  return Object.assign(store, {totalTasks});
}

export default useTasks;
