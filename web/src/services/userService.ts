import { User } from "../types/UserTypes";
import axiosClient from "./axiosClient";

class UserService {
  static async getUser() {
    return axiosClient
      .get<{ user: User }>("/user")
      .then(({ data: { user } }) => user);
  }
  static async setUser(name: string){
    return axiosClient
      .post<{ user: User }>("/user", { name })
      .then(({ data: { user } }) => user);
  }
}

export default UserService;
