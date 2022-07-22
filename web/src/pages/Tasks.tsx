import { useState } from "react";
import TaskForm, { TaskFormState } from "../components/Forms/TaskForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useTasksHook from "../stores/useTasksHook";

const Tasks = () => {
  const {tasks, isLoading, updateTask, createTask} = useTasksHook();
  const [taskId, setTaskId] = useState<number | null>(null);

  const onCreateTask = async (values: TaskFormState) => {
    if(taskId){
      updateTask(taskId, values);
    }else{
      createTask(values);
    }
  }

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    updateTask(id, { completed });
  }

  return (
    <MainLayout>
      <div className="tasks">
        <h1>Tasks</h1>

        <TaskForm onSubmit={onCreateTask} />
        <br />
        <br />
        {isLoading ? <div>Loading...</div> : <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />}
        
      </div>
    </MainLayout>
  )
};

export default Tasks;
