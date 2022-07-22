import { ReactNode, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useTasksStore } from "../../stores/contextTasksStore";
import { useUserStore } from "../../stores/contextUserStore";
import CustomLink from "./NavLink";

const MainLayout = ({children = null}: {children?: ReactNode}) => {
  const { tasks, getFilteredTasks } = useTasksStore();
  const { user } = useUserStore();

  /**
   * NOTE 2
   * Super easy to get totals in nav 
   * No extra queries
   */
  const allTasksTotal = useMemo(() => {
    return tasks.length;  
  }, [tasks]);

  const userTasksTotal = useMemo(() => {
    if(!user?.id || !tasks.length){
      return 0;
    }

    return getFilteredTasks({ userId: user.id }).length;
  }, [tasks, user?.id])

  return (
    <>
      <div className="header">
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/tasks">
          <span>
            Tasks
          </span> 
          <span>
            <span className="badge">
              {allTasksTotal}
            </span>
          </span>
        </CustomLink>
        <CustomLink to="/profile">
          <span>Profile</span>
          <span>
            <span className="badge">
              {userTasksTotal}
            </span>
          </span>
        </CustomLink>

    
        <div className="header__right">
          {user?.name && <>
            Welcome, <span className="badge">
              {user?.name}
            </span>
          </>}
        </div>
      </div>
      <div className="main">
        {children}
      </div>
      <div className="footer">
        &copy; 2022 - DCF Coders - All rights reserved
      </div>
    </>
  );
};

export default MainLayout;
