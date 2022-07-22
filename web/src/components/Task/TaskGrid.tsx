import { Task } from "../../types/TaskTypes"
import TaskItem from "./Taskitem"

type TaskGridProps = {
  tasks: Task[],
  onToggleComplete: (id: number, completed: boolean) => void;
}
const TaskGrid = ({ tasks, onToggleComplete }: TaskGridProps) => {
  return (<div className="task-grid">
    {tasks.map((task) => {
      return (<TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} />)
    })}
  </div>)
}

export default TaskGrid
