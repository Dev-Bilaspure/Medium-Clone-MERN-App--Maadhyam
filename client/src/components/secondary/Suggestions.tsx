import { defaultUserPic } from "@/constants";
import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const Suggestions = (props) => {
  const [suggestions, setSuggestions] = useState<any>([]);
  const {
    actions: {
      user: { getSuggestedUsers },
    },
    data: { authenticatedUser },
  } = useStore();

  useEffect(() => {
    (async () => {
      try {
        const response = await getSuggestedUsers();
        if (response.success) {
          setSuggestions(
            authenticatedUser
              ? response.users?.filter(
                  (usr) => usr._id !== authenticatedUser._id
                )
              : response.users
          );
        }
        debug_mode && console.log(response);
      } catch (error) {
        debug_mode && console.log(error);
      }
    })();
  }, []);
  return suggestions?.length === 0 ? (
    <div></div>
  ) : (
    <div className={twMerge("mb-10", props.className)}>
      <p className="mb-4 font-outfit text-[24px] font-bold text-[#3c3c3c] sm:text-[21px]">
        Who to follow
      </p>
      <div className=" flex flex-col space-y-5">
        {" "}
        {suggestions.map((user) => {
          return <Suggestion user={user} key={user._id} />;
        })}
      </div>
    </div>
  );
};

const Suggestion = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const {
    data: { authenticatedUser },
    actions: {
      user: { followAUser, unfollowAUser },
    },
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (authenticatedUser) {
      setIsFollowing(user.followers.includes(authenticatedUser._id));
    }
  }, [authenticatedUser]);

  const handleFollow = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    try {
      if (isFollowing) {
        const response = await unfollowAUser(user._id);
        if (response.success) {
          setIsFollowing(false);
        }
        debug_mode && console.log(response);
      } else {
        const response = await followAUser(user._id);
        if (response.success) {
          setIsFollowing(true);
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  return (
    <div
      className={`flex w-[300px] flex-row space-x-3 sm:w-auto sm:justify-between sm:space-x-8 sm:space-x-0`}
    >
      <div className="flex space-x-3">
        <div className="w-[45px] h-[45px] sm:w-[40px] sm:h-[40px]">
          <Link to={`/${user ? user.username : ""}`}>
            <img
              src={
                user.profilePicture?.length > 0
                  ? user.profilePicture
                  : defaultUserPic
              }
              className="h-full w-full rounded-full object-cover sm:w-[45px]"
            />
          </Link>
        </div>
        <div className="flex-1 w-[150px] mb-[3px] sm:w-fit">
          <Link to={`/${user ? user.username : ""}`}>
            <p className="font-lato text-[14px]">
              {user.firstName + " " + user.lastName}
            </p>
          </Link>
          <p className="text-[12px] text-[#757575] line-clamp-2">{`${user.bio}`}</p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <Button
          variant="outlined"
          style={{
            background: "#fff",
            color: "rgb(26,136,22)",
            border: "1px solid rgb(26,136,22)",
            borderRadius: 100,
            textTransform: "none",
            marginLeft: 10,
            boxShadow: "none",
            paddingBottom: 0,
            paddingTop: 0,
            height: 33,
          }}
          onClick={handleFollow}
        >
          <p className="mt-[1px] text-[14px] sm:text-[13px]">
            {isFollowing ? "Following" : "Follow"}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default Suggestions;
