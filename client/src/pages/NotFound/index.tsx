import SEO from "@/components/primary/SEO";
import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const NotFound = (props) => {
  const message = `You can find (just about) anything on Maadhyam — apparently even a page that doesn’t exist. But don't worry, we won't leave you hanging! It's time to turn the page and head back to the homepage, where a world of captivating content awaits. The path to enlightenment begins by returning to the homepage. Happy exploring!`;
  return (
    <div
      className={twMerge(
        "flex justify-center pt-10 pb-20 sm:px-5 sm:pb-10",
        props.className
      )}
    >
      <SEO options={{ title: "404 - Page Not Found" }} />
      <div className="w-1/2 md:w-2/3 sm:w-full">
        <p className="text-[16px] uppercase sm:text-center sm:text-[14px]">
          Page Not Found
        </p>
        <p className="font-robotoSlab text-[120px] text-[#B2B2B2] sm:text-center sm:text-[90px]">
          404
        </p>
        <div
          className="w-1/2 font-nanum text-[54px] md:w-full sm:text-center sm:text-[40px]"
          style={{ lineHeight: 1.4 }}
        >
          <p>Out of, nothing, something.</p>
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

export default NotFound;
