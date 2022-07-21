import { Task } from "../types/TaskTypes";
import axiosClient from "./axiosClient";

class UserService {
  static async getUser() {
    return axiosClient
      .get<{ tasks: Task[] }>("/tasks")
      .then(({ data: { tasks } }) => tasks);
  }
}

export default UserService;
