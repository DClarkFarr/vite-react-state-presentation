import { useState } from "react";
import TaskForm, { TaskFormState } from "../components/Forms/TaskForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import { useTasksStore } from "../stores/contextTasksStore";

const Tasks = () => {
  const {
    tasks,
    createTask,
    updateTask,
    isLoading
  } = useTasksStore();

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const onSubmitTask = async (values: TaskFormState) => {
    if(selectedTaskId) {
      await updateTask(selectedTaskId, values);
    }else{
      await createTask(values);
    }

    setSelectedTaskId(null);
  }

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    await updateTask(id, { completed });
  }


  return (
    <MainLayout>
      <div className="tasks">
        <h1>Tasks</h1>

        <TaskForm onSubmit={onSubmitTask} />
        <br />
        <br />
        {isLoading && <div>Loading...</div>}
        {!isLoading && ( 
          <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
        )}
      </div>
    </MainLayout>
  )
};

export default Tasks;
