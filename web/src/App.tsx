import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Routes>
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
