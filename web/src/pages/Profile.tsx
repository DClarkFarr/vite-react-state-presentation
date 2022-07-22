import UserForm, { UserFormState } from "../components/Forms/UserForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useRenderCounter from "../hooks/useRenderCounter";
import useTasksHook from "../stores/useTasksHook";
import useUserHook from "../stores/useUserHook";

const Profile = () => {

  const { user, updateUser } = useUserHook();

  const { count } = useRenderCounter('profile');

  /**
   * STEP 3.B
   */
  // console.log('rendered count', count)

  /**
   * NOTE 4
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
    updateUser(values);
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
        {user && !isLoading && <>
          <h3>My Tasks</h3>
          <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
        </>}
      </div>
    </MainLayout>
  )
};

export default Profile;
