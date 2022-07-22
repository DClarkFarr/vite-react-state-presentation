import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import CustomLink from "./NavLink";

const MainLayout = () => {
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
      </div>
      <div className="main">
        <Outlet />
      </div>
      <div className="footer">
        &copy; 2022 - DCF Coders - All rights reserved
      </div>
    </>
  );
};

export default MainLayout;
