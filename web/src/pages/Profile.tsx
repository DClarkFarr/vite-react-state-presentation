import { useEffect, useMemo, useState } from "react";
import UserForm, { UserFormState } from "../components/Forms/UserForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useRenderCounter from "../hooks/useRenderCounter";
import TaskService from "../services/taskService";
import UserService from "../services/userService";
import { useTasksStore } from "../stores/contextTasksStore";
import { useUserStore } from "../stores/contextUserStore";
import { Task } from "../types/TaskTypes";
import { User } from "../types/UserTypes";

const Profile = () => {
  

  const {
    user,
    isLoading: isLoadingUser,
    updateUser,
  } = useUserStore();

  const {
    tasks: allTasks,
    isLoading: isLoadingTasks,
    updateTask,
    getFilteredTasks,
  } = useTasksStore();

  /**
   * NOTE 1
   * Oh no! User-specific tasks?  
   * Now we have problems:
   * - If we refresh only users's tasks, then we'll erase the "all tasks" list, which will mess up
   *   the nav bar, and require refetching on every page load 
   * - We could add a user.tasks[] object, but then when updating there, we would have to maintain dual task lists 
   *   between tasks store and use store.
   * 
   * Hacky fix
   * - We added a hack method getFilteredTasks(), but that isn't scalable.
   * - Does allow us to re-use task update/create methods
   * 
   */
  const userTasks = useMemo(() => {
    return getFilteredTasks({userId: user?.id});
  }, [allTasks, user?.id])

  const { count } = useRenderCounter('profile');

  const handleSubmit = async (values: UserFormState) => {
    return updateUser(values);
  }

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    updateTask(id, { completed });
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
        {isLoadingTasks && <div>Loading...</div>}
        {!isLoadingTasks && (
          <>
            <h3>My Tasks</h3>
            <TaskGrid tasks={userTasks} onToggleComplete={onToggleTaskComplete} />
          </>
        )}
      </div>
    </MainLayout>
  )
};

export default Profile;
