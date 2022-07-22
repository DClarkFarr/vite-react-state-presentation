import { useEffect, useState } from "react";
import UserForm, { UserFormState } from "../components/Forms/UserForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import UserService from "../services/userService";
import useTasksHook from "../stores/useTasksHook";
import { User } from "../types/UserTypes";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * NOTE 2 
   * You cannot conditionally render hooks.
   * This hook will always fire twice. Once when user is empty, and again when user has loaded.
   * This produces the "flicker" where we see all tasks load, and then some disappear.
   */
  const {
    tasks, 
    isLoading,
    updateTask
  } = useTasksHook({ userId: user?.id });

  const handleSubmit = async (values: UserFormState) => {
    const user = await UserService.setUser(values.name);
    setUser(user);
  }

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    updateTask(id, { completed });
  }

  useEffect(() => {
    UserService.getUser().then(setUser);
  }, [])




  return (
    <MainLayout>
      <div className="profile">
        <h1>
          Profile
        </h1>
        <br />
        
        <UserForm onSubmit={handleSubmit} user={user || undefined} key={user?.name} />
        <br /><br />
        {user && !isLoading && <>
          <h3>My Tasks</h3>
          <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
        </>}
      </div>
    </MainLayout>
  )
};

export default Profile;
