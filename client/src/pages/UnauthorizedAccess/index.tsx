import SEO from "@/components/primary/SEO";
import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const UnauthorizedAccess = (props) => {
  const message = `Oops! It seems you've stumbled upon uncharted territory. This resource may be out of reach, like a hidden gem guarded by the digital gods. But fret not! Your path to discovery lies at the homepage, where a wealth of captivating content awaits.  Happy navigating and enjoy the journey!`;
  return (
    <div
      className={twMerge(
        "flex justify-center pt-10 pb-20 sm:px-5 sm:pb-10",
        props.className
      )}
    >
      <SEO options={{ title: "401 - Unauthorized Access" }} />
      <div className="w-1/2 md:w-2/3 sm:w-full">
        <p className="text-[16px] uppercase sm:text-center sm:text-[14px]">
          Unauthorized Access
        </p>
        <p className="font-robotoSlab text-[120px] text-[#B2B2B2] sm:text-center sm:text-[90px]">
          401
        </p>
        <div
          className="w-1/2 font-nanum text-[54px] md:w-full sm:text-center sm:text-[40px]"
          style={{ lineHeight: 1.4 }}
        >
          <p>Oops! This page is a stranger in your digital realm.</p>
        </div>
        <p
          className="mt-5 w-3/4 sm:w-full sm:text-center sm:text-[15px]"
          style={{ lineHeight: 1.7 }}
        >
          {message}
        </p>
        <Link to="/">
          <p className="mt-1 text-[16px] font-medium underline sm:text-center sm:text-[15px]">
            Home
          </p>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
