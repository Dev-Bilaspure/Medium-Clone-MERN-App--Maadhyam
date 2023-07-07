import HomeBanner from "@/components/secondary/HomeBanner";
import { Button } from "@mui/material";
import React, { Component, useEffect, useState } from "react";
import BlogPosts from "../../components/secondary/BlogPosts";
import Suggestions from "../../components/secondary/Suggestions";
import { twMerge } from "tailwind-merge";
import TagsTabs from "../../components/secondary/TagsTabs";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import Posts from "./Posts";
import { defaultUserPic } from "@/constants";
import RightBar from "./RightBar";
import { useParams } from "react-router-dom";
import { isValidObjectId } from "@/utils/helperMethods";
import { INTERNAL_SERVER_ERROR, RESOURCE_NOT_FOUND } from "@/utils/errorTypes";
import NotFound from "../NotFound";
import FetchingDataLoader from "@/components/primary/FetchingDataLoader";
import SEO from "@/components/primary/SEO";

const UserProfile = (props) => {
  const [isResourceNotFound, setIsResourceNotFound] = useState(false);
  const [user, setUser] = useState<any>({});
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);
  const { username } = useParams();
  const {
    actions: {
      user: { getUserByUsername },
    },
  } = useStore();

  useEffect(() => {
    if (!username) return;
    setIsResourceNotFound(false);

    (async () => {
      try {
        setIsFetchingUser(true);
        const response = await getUserByUsername(username);
        if (response.success) {
          setUser(response.user);
        } else {
          const errorType = response?.error?.response?.data?.errorType;
          if (errorType === RESOURCE_NOT_FOUND) {
            setIsResourceNotFound(true);
          }
        }
        debug_mode && console.log(response);
      } catch (error) {
        debug_mode && console.log(error);
        setIsResourceNotFound(true);
      } finally {
        setIsFetchingUser(false);
      }
    })();
  }, [username]);
  return isResourceNotFound ? (
    <NotFound />
  ) : (
    <div className={twMerge(`mb-20 w-full`, props.className)}>
      <SEO options={{ title: user.firstName + " " + user.lastName }} />
      <div className="flex min-h-screen w-full flex-row sm:flex-col sm:space-y-10">
        <div className="w-2/3 overflow-y-auto px-[120px] pt-[50px] md:px-[50px] sm:w-full sm:px-5">
          {isFetchingUser ? (
            <div className="mt-5 flex justify-center">
              <FetchingDataLoader />
            </div>
          ) : (
            <div>
              <div className="flex flex-col space-y-0 border-b-2 border-[#E6E6E6] pb-5">
                <p className="font-arimo text-[40px] font-bold sm:text-[34px] ">
                  {user?.firstName + " " + user?.lastName}
                </p>
                <p className="font-sans text-[14px] font-medium italic text-[#757575] sm:text-[12px]">
                  {`@${user?.username}`}
                </p>
              </div>
              <div className="mt-10">
                <Posts
                  user={user}
                  setIsResourceNotFound={setIsResourceNotFound}
                />
              </div>
            </div>
          )}
        </div>
        <div className="fixed right-0 top-0 h-screen w-1/3 space-y-5 border-l border-gray px-10 md:px-10 sm:static sm:inset-auto sm:h-auto sm:w-full sm:border-none sm:px-5">
          <RightBar user={user} isFetchingUser={isFetchingUser} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
