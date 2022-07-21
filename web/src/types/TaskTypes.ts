import { User } from './UserTypes'

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  user: User
};
