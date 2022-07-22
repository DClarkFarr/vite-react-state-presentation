import { useEffect, useState } from "react";
import TaskForm, { TaskFormState } from "../components/Forms/TaskForm";
import MainLayout from "../components/Layout/MainLayout";
import TaskGrid from "../components/Task/TaskGrid";
import useTasks from "../hooks/useTasks";
import TaskService from "../services/taskService";
import { Task } from "../types/TaskTypes";

const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  
  const { tasks, isLoading, createTask, updateTask, refreshTasks } = useTasks();


  /**
   * NOTE 4
   * Creating a task on general useTasks() does update useTasks({ userId: user?.id || -1 }), 
   * so we have a problem
   */
  const onSaveTask = async (values: TaskFormState) => {
    if(selectedTaskId) {
      updateTask(selectedTaskId, values);
    }else{
      createTask(values);
    }

    setSelectedTaskId(null);
  }

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    updateTask(id, { completed });
  }

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <MainLayout>
      <div className="tasks">
        <h1>Tasks</h1>

        <TaskForm onSubmit={onSaveTask} />
        <br />
        <br />
        {isLoading ? <div>Loading...</div> : <div>{tasks.length} Tasks loaded</div>}
        <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
      </div>
    </MainLayout>
  )
};

export default Tasks;
