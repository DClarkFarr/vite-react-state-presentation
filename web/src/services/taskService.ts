import { Task } from "../types/TaskTypes";
import axiosClient from "./axiosClient";

class TaskService {
  static async list(options: Partial<{completed: boolean, userId: number}>) {
    return axiosClient
      .get<{ tasks: Task[] }>("/tasks", { params: options })
      .then(({ data: { tasks } }) => tasks);
  }
  static async create(data: { title: string }) {
    return axiosClient
      .post<{ task: Task }>("/tasks", data)
      .then(({ data: { task } }) => task);
  }
  static async update(id: number, data: Partial<{ title: string, completed: boolean }>) {
    return axiosClient
      .put<{ task: Task }>(`/tasks/${id}`, data)
      .then(({ data: { task } }) => task);
  }
  static async delete(id: number) {
    return axiosClient.delete(`/tasks/${id}`).then(() => {});
  }
}

export default TaskService;
