import { useEffect, useState } from "react";
import UserForm, { UserFormState } from "../components/Forms/UserForm";
import TaskGrid from "../components/Task/TaskGrid";
import TaskService from "../services/taskService";
import UserService from "../services/userService";
import { Task } from "../types/TaskTypes";
import { User } from "../types/UserTypes";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);

  const handleSubmit = async (values: UserFormState) => {
    const user = await UserService.setUser(values.name);
    setUser(user);
  }

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    const index = tasks.findIndex(task => task.id === id);
    const ts = [...tasks];

    ts.splice(index, 1, { ...ts[index], completed });
    setTasks(ts);

    TaskService.update(id, { completed });
  }

  useEffect(() => {
    UserService.getUser().then(setUser);
  }, [])

  useEffect(() => {
    if(user){
      TaskService.list({ userId: user?.id }).then(setTasks);
    }
  }, [user])

  return <div className="profile">
    <h1>
      Profile
    </h1>
    <br />
    
    <UserForm onSubmit={handleSubmit} user={user || undefined} key={user?.name} />
    <br /><br />
    {user && <h3>My Tasks</h3>}
    <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
  </div>;
};

export default Profile;
