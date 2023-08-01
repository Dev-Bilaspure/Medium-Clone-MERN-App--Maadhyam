import React, { useEffect, useState } from "react";
import RightBar from "./RightBar";
import { twMerge } from "tailwind-merge";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { defaultUserPic } from "@/constants";
import { Button } from "@mui/material";
import _, { set } from "lodash";
import { useStore } from "@/store/useStore";
import { RESOURCE_NOT_FOUND } from "@/utils/errorTypes";
import { debug_mode } from "@/debug-controller";
import NotFound from "../NotFound";
import FetchingDataLoader from "@/components/primary/FetchingDataLoader";

const UserFFs = (props) => {
  const { pathname } = useLocation();
  const [isFetchingFFUsers, setIsFetchingFFUsers] = useState(false);

  const [isResourceNotFound, setIsResourceNotFound] = useState(false);
  const [user, setUser] = useState<any>({});
  const [ffUsers, setffUsers] = useState<any>([]);
  const { username } = useParams();

  const page = pathname.split("/")[2];
  debug_mode && console.log(page);

  const {
    actions: {
      user: { getUserByUsername, getUsersFollowers, getUsersFollowing },
    },
  } = useStore();

  useEffect(() => {
    if (!username) return;
    setIsResourceNotFound(false);
    (async () => {
      try {
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
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setIsFetchingFFUsers(true);
      try {
        if (page === "followers") {
          const response = await getUsersFollowers(user._id);
          if (response.success) {
            setffUsers(response.users);
          }
          debug_mode && console.log(response);
        } else if (page === "followings") {
          const response = await getUsersFollowing(user._id);
          if (response.success) {
            setffUsers(response.users);
          }
          debug_mode && console.log(response);
        }
      } catch (error) {
        debug_mode && console.log(error);
      }
      setIsFetchingFFUsers(false);
    })();
  }, [user, page]);

  return isResourceNotFound ? (
    <NotFound />
  ) : (
    <div className={twMerge(`mb-20 w-full pb-0`, props.className)}>
      <div className="flex min-h-screen w-full flex-row sm:flex-col sm:space-y-10">
        <div className="w-2/3 overflow-y-auto px-[120px] pt-[50px] md:px-20 sm:w-full sm:px-5 sm:pb-[20px]">
          <div className="flex flex-col space-y-0 pb-5">
            <div className="mb-5 flex space-x-2 text-[14px] text-[#757575]">
              <Link to={`/${username}`}>
                <p className="cursor-pointer hover:text-black">
                  {user.firstName + " " + user.lastName}
                </p>
              </Link>
              <p>{">"}</p>
              <Link to={`/${username}/${pathname.split("/")[2]}`}>
                <p className="cursor-pointer hover:text-black">{page}</p>
              </Link>
            </div>
            <p className="font-arimo text-[40px] font-bold sm:text-[34px] ">
              {(ffUsers?.length > 0 ? ffUsers?.length : 0) +
                " " +
                _.capitalize(page)}
            </p>
          </div>
          {isFetchingFFUsers ? (
            <div className="mt-10 flex justify-center">
              <FetchingDataLoader />
            </div>
          ) : !ffUsers ? (
            <div className="rgb(60, 60, 60) mt-5 flex justify-center space-x-1 text-[14px] sm:text-[13px]">
              <p>{`${_.capitalize(page)} of `}</p>
              <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
              <p>will appear here.</p>
            </div>
          ) : (
            <div className="mt-5 flex flex-col space-y-8">
              {ffUsers?.map((ffUser) => {
                return <UserFF ffUser={ffUser} setffUsers={setffUsers} />;
              })}
            </div>
          )}
        </div>
        <div className="fixed right-0 top-0 h-screen w-1/3 space-y-5 border-l border-gray px-10 md:px-10 sm:static sm:inset-auto sm:h-auto sm:w-full sm:border-none sm:px-5">
          <RightBar user={user} isFetchingUser={false} />
        </div>
      </div>
    </div>
  );
};

const UserFF = ({ ffUser, setffUsers }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const {
    data: { authenticatedUser },
    actions: {
      user: { followAUser, unfollowAUser },
    },
  } = useStore();

  useEffect(() => {
    if (!authenticatedUser) return;
    if (ffUser.followers.includes(authenticatedUser._id)) {
      setIsFollowing(true);
    }
  }, [ffUser]);

  const navigate = useNavigate();

  const handleFollow = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    try {
      if (isFollowing) {
        const response = await unfollowAUser(ffUser._id);
        if (response.success) {
          setIsFollowing(false);
          setffUsers((prevffUsers) => {
            return prevffUsers.map((prevffUser) => {
              if (prevffUser._id === ffUser._id) {
                return {
                  ...prevffUser,
                  followers: prevffUser.followers.filter(
                    (follower) => follower !== authenticatedUser._id
                  ),
                };
              }
              return prevffUser;
            });
          });
          debug_mode && console.log("unfollowed successfully");
        }
        debug_mode && console.log(response);
      } else {
        setIsFollowing(true);
        const response = await followAUser(ffUser._id);
        if (response.success) {
          setffUsers((prevffUsers) => {
            return prevffUsers.map((prevffUser) => {
              if (prevffUser._id === ffUser._id) {
                return {
                  ...prevffUser,
                  followers: [...prevffUser.followers, authenticatedUser._id],
                };
              }
              return prevffUser;
            });
          });
          debug_mode && console.log("followed successfully");
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };
  return (
    <div className="flex justify-between">
      <div className="flex space-x-5 sm:space-x-4 ">
        <div className="h-[47px] w-[47px] sm:h-[40px] sm:w-[40px]">
          <Link to={`/${ffUser ? ffUser.username : ""}`}>
            <img
              src={
                ffUser.profilePicture?.length > 0
                  ? ffUser.profilePicture
                  : defaultUserPic
              }
              className="h-full w-full rounded-full object-cover sm:w-[45px]"
            />
          </Link>
        </div>
        <div className="mb-1 flex-1">
          <Link to={`/${ffUser.username}`}>
            <p className=" text-[18px] font-medium sm:text-[16px]">
              {!authenticatedUser || authenticatedUser._id !== ffUser._id
                ? ffUser.firstName + " " + ffUser.lastName
                : "You"}
            </p>
          </Link>
          <Link to={`/${ffUser.username}`}>
            <p className="text-[13px] font-medium text-[#757575] line-clamp-2 sm:text-[12px]">
              {ffUser.bio}
            </p>
          </Link>
        </div>
      </div>
      {!authenticatedUser ? (
        <div className="h-[32px] sm:h-[30]">
          <Button
            variant="contained"
            color="success"
            style={{
              borderRadius: 30,
              textTransform: "none",
              boxShadow: "none",
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 4,
              paddingBottom: 4,
              minWidth: 0,
            }}
            onClick={handleFollow}
          >
            <p className="sm:text-[12px]">{"Follow"}</p>
          </Button>
        </div>
      ) : (
        authenticatedUser._id !== ffUser._id && (
          <div className="h-[32px] sm:h-[30]">
            <Button
              variant="contained"
              color="success"
              style={{
                borderRadius: 30,
                textTransform: "none",
                boxShadow: "none",
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 4,
                paddingBottom: 4,
                minWidth: 0,
              }}
              onClick={handleFollow}
            >
              <p className="sm:text-[12px]">
                {isFollowing ? "Following" : "Follow"}
              </p>
            </Button>
          </div>
        )
      )}
    </div>
  );
};
export default UserFFs;
