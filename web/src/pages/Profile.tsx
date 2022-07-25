import { useEffect } from "react";
import UserForm, { UserFormState } from "../components/Forms/UserForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useRenderCounter from "../hooks/useRenderCounter";
import useTasksQuery from "../hooks/useTasksQuery";
import useUserQuery from "../hooks/useUserQuery";
import TaskService from "../services/taskService";
import UserService from "../services/userService";

const Profile = () => {
  const { user, isLoading: isLoadingUser, setUser } = useUserQuery();

  const { tasks, isLoading: isLoadingTasks, updateTask } = useTasksQuery({
    isGeneric: false,
    userId: user?.id,
  });

  const { count } = useRenderCounter("profile");

  const handleSubmit = async (values: UserFormState) => {
    await setUser(values);
  };

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    await updateTask(id, { completed });
  };

  return (
    <MainLayout>
      <div className="profile">
        <h1>Profile</h1>
        <br />

        <UserForm
          onSubmit={handleSubmit}
          user={user || undefined}
          key={user?.name}
        />
        <br />
        <br />
        {isLoadingTasks ? <div>Loading...</div> : <div>{tasks.length} Tasked Loaded</div>}
        <h3>My Tasks</h3>
        <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
      </div>
    </MainLayout>
  );
};

export default Profile;
