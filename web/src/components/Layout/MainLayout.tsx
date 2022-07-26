import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import CustomLink from "./NavLink";

const MainLayout = ({children = null}: {children?: ReactNode}) => {
  /**
   * NOTE 4, 5
   * How do we get task totals into the nav?
   */
  return (
    <>
      <div className="header">
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/tasks">
          <span>
            Tasks
          </span> 
          <span>
            <span className="badge">0</span>
          </span>
        </CustomLink>
        <CustomLink to="/profile">
          <span>Profile</span>
          <span>
            <span className="badge">0</span>
          </span>
        </CustomLink>

        <div className="header__right">
          Welcome, <span className="badge">User?</span>
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
