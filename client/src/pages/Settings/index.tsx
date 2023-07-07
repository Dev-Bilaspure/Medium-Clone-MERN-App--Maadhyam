import { useStore } from "@/store/useStore";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import FirstNameEdit from "./FirstNameEdit";
import LastNameEdit from "./LastNameEdit";
import UsernameEdit from "./UsernameEdit";
import ProfilePictureEdit from "./ProfilePictureEdit";
import BioEdit from "./BioEdit";
import PasswordEdit from "./PasswordEdit";
import SEO from "@/components/primary/SEO";

const Settings = () => {
  const {
    data: { authenticatedUser },
  } = useStore();
  
  return (
    !authenticatedUser ? <Navigate to="/login" /> : 
    <div className="flex w-full justify-center pt-5 sm:px-5 pb-20">
      <SEO options={{ title: "Settings" }} />
      <div className=" mt-10 w-1/2 overflow-x-hidden md:w-3/4 sm:mt-5 sm:w-full">
        <div className="mb-10 flex w-full space-x-4 border-b border-[#E6E6E6] pb-2 sm:space-x-2 sm:pb-1">
          <div className="mt-[7px] h-[45px] w-[45px] rounded-full bg-[#E6E6E6] text-[27px] sm:h-[33px] sm:w-[33px] sm:text-[20px]">
            <i className="fa-solid fa-gear text-[rgb(45, 45, 45)] ml-[10px] mt-[10px]  sm:mt-[7px] sm:ml-[7px]"></i>
          </div>
          <p
            style={{
              fontFamily: `'Outfit', 'sans-serif'`,
              color: "rgb(41,41,41)",
            }}
            className="text-[40px] sm:text-[30px]"
          >
            Settings
          </p>
        </div>
        <div className="flex flex-col space-y-10 sm:space-y-[60px] ">
          {/*First Name Edit Part=================================================================================*/}
          <FirstNameEdit />

          {/*Last Name Edit Part=================================================================================*/}
          <LastNameEdit />

          {/*Username Edit Part=================================================================================*/}
          <UsernameEdit />

          {/*Profile Picture Edit Part=================================================================================*/}
          <ProfilePictureEdit />

          {/*Bio Edit Part=================================================================================*/}
          <BioEdit />

          {/*Save Button Part=================================================================================*/}
          <PasswordEdit />
        </div>
      </div>
    </div>
  );
};

export default Settings;
