import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import MainLayout from "./components/Layout/MainLayout";

function App() {

  return (
      <div className="app">
        <Routes>
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
        </Routes>
      </div>
  );
}

export default App;
