import { ChangeEvent } from "react";
import { Task } from "../../types/TaskTypes";

export type TaskItemProps = {
  task: Task,
  onToggleComplete: (id: number, completed: boolean) => void;
}
const TaskItem = ({ task, onToggleComplete }: TaskItemProps) => {

  const onChange = (e: ChangeEvent) => {
    const { checked } = e.target as HTMLInputElement;
    onToggleComplete(task.id, checked);
  }
  return (<div className="task">
    <div className="task__author">
      {task.user.name}
    </div>
    <div className="task__text">
      {task.title}
    </div>
    <div className={`task__status ${task.completed ? 'task__status--completed' : ''}`}>
      <label>
        <input type="checkbox" onChange={onChange} checked={task.completed} /> {task.completed ? 'Completed' : 'Not completed'}
      </label>
    </div>
  </div>)
}
export default TaskItem;
