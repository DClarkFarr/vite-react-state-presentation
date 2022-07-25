import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import useTasksQuery from "../../hooks/useTasksQuery";
import useUserQuery from "../../hooks/useUserQuery";
import CustomLink from "./NavLink";

const MainLayout = ({ children = null }: { children?: ReactNode }) => {
  /**
   * NOTE 7
   * Very easy to use in other places, and they're always in sync!
   */
  const { user } = useUserQuery();
  const { tasks } = useTasksQuery();

  const { tasks: userTasks } = useTasksQuery({ isGeneric: false, userId: user?.id });

  return (
    <>
      <div className="header">
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/tasks">
          <span>Tasks</span>
          <span>
            <span className="badge">
              {tasks.length}
            </span>
          </span>
        </CustomLink>
        <CustomLink to="/profile">
          <span>Profile</span>
          <span>
            <span className="badge">
              {userTasks.length}
            </span>
          </span>
        </CustomLink>

        <div className="header__right">
          {user && (
            <>
              Welcome, <span className="badge">{user.name}</span>
            </>
          )}
        </div>
      </div>
      <div className="main">{children}</div>
      <div className="footer">
        &copy; 2022 - DCF Coders - All rights reserved
      </div>
    </>
  );
};

export default MainLayout;
