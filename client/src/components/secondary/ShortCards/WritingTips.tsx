import { Button } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const WritingTips = () => {
  const navigate = useNavigate();
  return (
    <div className="flex sm:w-full sm:justify-center mb-3 sm:hidden">
      <div className="mb-7 w-[290px] rounded-md bg-[#C4E2FF] px-6 py-6 sm:w-[220px]">
        <p className="text-[17px] font-bold sm:text-[15px]">
          Write on Maadhyam
        </p>
        <div className="mt-4 flex flex-col space-y-2 text-[15px] sm:text-[13px]">
          <Link to="/blog/64a6b8c95b02a2fbc7bee5b2">
            <p className="font-medium ">New writer FAQ</p>
          </Link>
          <Link to="blog/64a6ba235b02a2fbc7bee656">
            <p className="font-medium ">Expert writing advice</p>
          </Link>

          <Link to="/blog/64a6bad25b02a2fbc7bee666">
            <p className="font-medium ">Grow your readership</p>
          </Link>
        </div>
        <Button
          variant="contained"
          color="inherit"
          style={{
            textTransform: "none",
            borderRadius: 50,
            height: 33,
            marginTop: 20,
            backgroundColor: "rgb(40, 40, 40)",
            color: "#ffffff",
            boxShadow: "none",
            fontSize: 14,
          }}
          onClick={() => navigate("/write")}
        >
          Start Writing
        </Button>
      </div>
    </div>
  );
};

export default WritingTips;
