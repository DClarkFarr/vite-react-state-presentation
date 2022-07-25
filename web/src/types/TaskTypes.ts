import { User } from './UserTypes'

export type TaskListOptions = Partial<{completed: boolean, userId: number}>;
export type TaskPostData = Partial<{ title: string, completed: boolean }>;

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  user: User
};
