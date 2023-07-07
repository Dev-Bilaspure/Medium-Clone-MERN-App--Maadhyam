import React from "react";
import bannerImage from "../../assets/images/bannerImg.jpg";
import { twMerge } from "tailwind-merge";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeBanner = ({ className }) => {
  const navigate = useNavigate();
  return (
    <div
      className={twMerge(
        `h-[450px] bg-cover object-cover px-10 pt-5 sm:h-[350px] sm:px-5 sm:pt-[25px] xs:h-[290px]`,
        className
      )}
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div style={{ textShadow: "0px 0px 10px #000000" }}>
        <p className="font-robotoSlab text-[60px] leading-[80px] text-[#FFFFFF] sm:text-[40px] xs:text-[35px] sm:leading-[45px]">
          Maadhyam: A paltform <br className="sm:hidden" />
          to read, write and <br className="sm:hidden" /> connect
        </p>

        <p className="mt-5  font-sans text-[18px] text-[#FFFFFF] sm:mt-3 sm:text-[15px] xs:text-[13px]">
          If you have a story to tell, knowledge to share, or a{" "}
          <br className="sm:hidden" />
          perspective to offer — welcome home.
        </p>
        <button
          onClick={() => navigate("/write")}
          className="shadow-3xl mt-[40px] rounded-3xl bg-white px-5 py-2 font-sans text-black sm:mt-[18px] sm:px-3 sm:py-1 sm:text-[12px] xs:text-[11px]"
        >
          Start Writing
        </button>
      </div>
    </div>
  );
};

export default HomeBanner;
