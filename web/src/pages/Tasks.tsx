import { useEffect, useState } from "react";
import TaskForm, { TaskFormState } from "../components/Forms/TaskForm";
import TaskGrid from "../components/Task/TaskGrid";
import TaskService from "../services/taskService";
import { Task } from "../types/TaskTypes";

const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const onSaveTask = async (values: TaskFormState) => {
    if(selectedTaskId) {
      const task = await TaskService.update(selectedTaskId, values);
      const index = tasks.findIndex(t => t.id === task.id);
      const ts = [...tasks];
      ts.splice(index, 1, task);
      setTasks(ts);
    }else{
      const task = await TaskService.create(values);
      setTasks([...tasks, task]);
    }

    setSelectedTaskId(null);
  }

  const onToggleTaskComplete = async (id: number, completed: boolean) => {
    const index = tasks.findIndex(task => task.id === id);
    const ts = [...tasks];

    ts.splice(index, 1, { ...ts[index], completed });
    setTasks(ts);

    TaskService.update(id, { completed });
  }

  useEffect(() => {
    TaskService.list().then(setTasks);
  }, []);

  return <div className="tasks">
    <h1>Tasks</h1>

    <TaskForm onSubmit={onSaveTask} />
    <br />
    <br />
    <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
  </div>;
};

export default Tasks;
