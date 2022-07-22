import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import { createTasksStore, TasksContext } from "./stores/contextTasksStore";
import { createUserStore, UserContext } from "./stores/contextUserStore";

function App() {
  const tasksStore = createTasksStore();
  const userStore = createUserStore();
  return (
    <UserContext.Provider value={userStore}>
      <TasksContext.Provider value={tasksStore}>
        <div className="app">
          <Routes>
              <Route path="tasks" element={<Tasks />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </TasksContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
