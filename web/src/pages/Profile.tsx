import { useEffect, useState } from "react";
import UserForm, { UserFormState } from "../components/Forms/UserForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useRenderCounter from "../hooks/useRenderCounter";
import TaskService from "../services/taskService";
import UserService from "../services/userService";
import { Task } from "../types/TaskTypes";
import { User } from "../types/UserTypes";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  const { count } = useRenderCounter('profile');

  /**
   * NOTE 3 
   * Local only.  How do we get this into the nav?
   */
  const handleSubmit = async (values: UserFormState) => {
    const user = await UserService.setUser(values.name);
    setUser(user);
  }

  /**
   * NOTE 2.B 
   * Have to prop drill this every time a prop grid is used
   */
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
      setIsLoading(true);
      TaskService.list({ userId: user?.id }).then(setTasks).finally(() => setIsLoading(false));
    }
  }, [user])

  return (
    <MainLayout>
      <div className="profile">
        <h1>
          Profile
        </h1>
        <br />
        
        <UserForm onSubmit={handleSubmit} user={user || undefined} key={user?.name} />
        <br /><br />
        {isLoading ? <div>Loading...</div> : <div>{tasks.length} Tasks</div>}
        {user && <h3>My Tasks</h3>}
        <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
      </div>
    </MainLayout>
  )
};

export default Profile;
