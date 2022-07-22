import { ReactNode } from "react";
import useTasks from "../../hooks/useTasks";
import useUser from "../../hooks/useUser";
import CustomLink from "./NavLink";

const MainLayout = ({children = null}: {children?: ReactNode}) => {

  /**
   * NOTE 2
   * WIll re-query on every page change, whether or not it needs to, because 
   * useTasks() hook ==> +3 queries per page load, not great
   */
  const { totalTasks } = useTasks();
  const { user } = useUser();

  const { totalTasks: userTasks } = useTasks({ userId: user?.id || -1 });


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
              {totalTasks}
            </span>
          </span>
        </CustomLink>
        <CustomLink to="/profile">
          <span>Profile</span>
          <span>
            <span className="badge">{ userTasks }</span>
          </span>
        </CustomLink>

        <div className="header__right">
          {user && <>
            Welcome, <span className="badge">
              {user.name}
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
