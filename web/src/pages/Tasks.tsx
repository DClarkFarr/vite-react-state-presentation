import { useEffect, useState } from "react";
import TaskForm, { TaskFormState } from "../components/Forms/TaskForm";
import TaskGrid from "../components/Task/TaskGrid";
import TaskService from "../services/taskService";
import { Task } from "../types/TaskTypes";

const Tasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  /**
   * NOTE 1 
   * Local state management.
   * If I want a task list somewhere else, I would either have to:
   *   A: Duplicate logic
   *   B: Abstract this into a hook, but will have to prop drill everything
   */
  const onCreateTask = async (values: TaskFormState) => {
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


  /**
   * NOTE 2.A 
   * Have to prop drill this every time a prop grid is used
   */
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

    <TaskForm onSubmit={onCreateTask} />
    <br />
    <br />
    <TaskGrid tasks={tasks} onToggleComplete={onToggleTaskComplete} />
  </div>;
};

export default Tasks;
