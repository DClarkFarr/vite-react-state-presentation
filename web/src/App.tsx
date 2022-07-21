import { useEffect } from "react";
import "./App.scss";
import TaskService from "./services/taskService";

function App() {
  useEffect(() => {
    TaskService.list().then((tasks) => {
      console.log("got ttasks", tasks);
    });
    console.log("app mounted");
  }, []);
  return <div className="app">app text here</div>;
}

export default App;
