import React, { useEffect } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BigLogo from "../primary/BigLogo";
import { useStore } from "@/store/useStore";
import { defaultUserPic } from "@/constants";
import PopoverMoreIcon from "./PopoverMoreIcon";
import AccountMenu from "./AccountMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: { authenticatedUser },
    actions: {
      auth: { logoutUser },
    },
  } = useStore();

  return (
    <div className="">
      <AppBar style={{ boxShadow: "none" }}>
        <Toolbar
          className={`h-[60px] w-full border-b ${
            location.pathname === "/" ? "border-black" : "border-[#F2F2F2]"
          } bg-white sm:h-[40px]`}
        >
          <div className={`flex w-full justify-between px-10 sm:px-0`}>
            <BigLogo className={""} />
            <div className="flex flex-row items-center justify-center space-x-10 text-[15px] text-black sm:space-x-5">
              <a
                href="https://linkedin.com/in/dev-bilaspure"
                target="_blank"
                className="md:hidden"
              >
                <p className="">Contact us</p>
              </a>

              <Link
                to="https://github.com/Dev-Bilaspure/Medium-Clone-MERN-App--Maadhyam"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex space-x-1">
                  <i className="fa-brands fa-github flex items-center justify-center sm:text-[12px]"></i>
                  <p className="sm:text-[13px]">Github</p>
                </div>
              </Link>
              {location.pathname !== "/write" && (
                <Link to="/write" className="sm:hidden">
                  <div className="flex space-x-1">
                    <i className="fa-regular fa-pen-to-square flex items-center justify-center sm:text-[13px]"></i>
                    <p className="sm:text-[13px]">Write</p>
                  </div>
                </Link>
              )}
              {!authenticatedUser && (
                <Link to="/login">
                  <p className="sm:text-[13px]">Sign In</p>
                </Link>
              )}
              {!authenticatedUser && (
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-3xl bg-[rgb(31,31,31)] px-[20px] py-[7px] text-white shadow-none sm:px-[11px] sm:py-[6px] sm:text-[11px]"
                >
                  Get Started
                </button>
              )}
              {authenticatedUser && <AccountMenu />}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
