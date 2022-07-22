import { useEffect, useState } from "react";
import UserForm, { UserFormState } from "../components/Forms/UserForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useRenderCounter from "../hooks/useRenderCounter";
import useTasks from "../hooks/useTasks";
import useUser from "../hooks/useUser";
import TaskService from "../services/taskService";
import UserService from "../services/userService";
import { Task } from "../types/TaskTypes";
import { User } from "../types/UserTypes";

const Profile = () => {
  
  const { user, isLoading: isLoadingUser, setUser } = useUser();

  const { count } = useRenderCounter('profile');

  const {tasks, isLoading: isLoadingTasks, updateTask } = useTasks({ userId: user?.id || -1 });


  const handleSubmit = async (values: UserFormState) => {
    return setUser(values);
  }


  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    return updateTask(id, { completed });
  }

  

  return (
    <MainLayout>
      <div className="profile">
        <h1>
          Profile
        </h1>
        <br />
        
        <UserForm onSubmit={handleSubmit} user={user || undefined} key={user?.name} />
        <br /><br />
        {isLoadingTasks ? <div>Loading...</div> : <div>{tasks.length} Tasks loaded</div>}
        {user && <h3>My Tasks</h3>}
        <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
      </div>
    </MainLayout>
  )
};

export default Profile;
