import { useState } from "react";
import TaskForm, { TaskFormState } from "../components/Forms/TaskForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useTasksQuery from "../hooks/useTasksQuery";

const Tasks = () => {
  const [selectedTaskId] = useState<number | null>(null);
  
  const {
    tasks,
    isLoading,
    updateTask,
    createTask
  } = useTasksQuery();

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    updateTask(id, { completed });
  }

  const onCreateTask = async (values: TaskFormState) => {
    if(selectedTaskId){
      await updateTask(selectedTaskId, values);
    }else{
      await createTask(values);
    }
  }

  return (
    <MainLayout>
      <div className="tasks">
        <h1>Tasks</h1>

        <TaskForm onSubmit={onCreateTask} />
        <br />
        <br />
        {isLoading ? <div>Loading...</div> : <div>{tasks.length} Tasked Loaded</div>}
        <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
      </div>
    </MainLayout>
  )
};

export default Tasks;
