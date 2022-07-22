import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import { createTasksStore, TasksContext } from "./stores/contextTasksStore";

function App() {
  const tasksStore = createTasksStore();
  return (
    <TasksContext.Provider value={tasksStore}>
      <div className="app">
        <Routes>
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </TasksContext.Provider>
  );
}

export default App;
