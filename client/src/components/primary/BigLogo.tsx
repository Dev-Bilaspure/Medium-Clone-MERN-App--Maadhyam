import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const BigLogo = ({ className }) => {
  return (
    <div
      className={twMerge(
        "flex flex-row items-center justify-center text-[30px]",
        className
      )}
    >
      <Link to="/">
        <i className="fab fa-medium rotate-180 transform text-black"></i>
      </Link>
      <Link to="/">
        <p className="ml-2 font-abril text-black sm:hidden">
          Maadhyam
        </p>
      </Link>
    </div>
  );
};

export default BigLogo;
