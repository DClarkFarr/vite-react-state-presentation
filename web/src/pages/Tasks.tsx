import { useState } from "react";
import TaskForm, { TaskFormState } from "../components/Forms/TaskForm";
import TaskService from "../services/taskService";

const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const onSaveTask = async (values: TaskFormState) => {
    if(selectedTaskId) {
      await TaskService.update(selectedTaskId, values);
    }else{
      await TaskService.create(values);
    }

    setSelectedTaskId(null);
  }

  return <div className="tasks">
    <h1>Tasks</h1>

    <TaskForm onSubmit={onSaveTask} />
  </div>;
};

export default Tasks;
