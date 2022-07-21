import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import CustomLink from "./NavLink";

const MainLayout = () => {
  return (
    <>
      <div className="header">
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/tasks">Tasks</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
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
