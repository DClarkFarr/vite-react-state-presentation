import { User } from './UserTypes'

export type TasksListOptions = Partial<{completed: boolean, userId: number}>;

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  user: User
};

export type TaskPostData = Partial<{ title: string, completed: boolean }>;
export type TaskListOptions = Partial<{completed: boolean, userId: number}>;
