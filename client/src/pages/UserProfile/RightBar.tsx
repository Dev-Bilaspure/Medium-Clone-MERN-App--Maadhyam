import FetchingDataLoader from "@/components/primary/FetchingDataLoader";
import { defaultUserPic } from "@/constants";
import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { convertNumberToShortFormat } from "@/utils/helperMethods";
import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const RightBar = ({ user, isFetchingUser }) => {
  const [isFollowings, setIsFollowings] = React.useState(false);
  const { username } = useParams();
  const {
    data: { authenticatedUser },
    actions: {
      user: { followAUser, unfollowAUser },
    },
  } = useStore();

  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    if (!authenticatedUser || !user) return;
    setIsFollowings(user.followers?.includes(authenticatedUser._id));
  }, [user]);

  const handleFollow = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    if (authenticatedUser._id === user._id) return;
    try {
      if (isFollowings) {
        const response = await unfollowAUser(user._id);
        if (response.success) {
          debug_mode && console.log("unfollowed successfully");
          setIsFollowings(false);
        }
        debug_mode && console.log(response);
      } else {
        const response = await followAUser(user._id);
        if (response.success) {
          debug_mode && console.log("followed successfully");
          setIsFollowings(true);
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };
  return (
    <div className="pt-[120px] sm:border-t sm:border-gray sm:pt-[50px]">
      {isFetchingUser ? (
        <div className="mt-5 flex justify-center">
          <FetchingDataLoader />
        </div>
      ) : (
        <div>
          <div
            className={`flex h-[90px] w-[90px] justify-center rounded-full bg-cover sm:h-[75px] sm:w-[75px]`}
            style={{
              backgroundImage: `url("${
                user && user.profilePicture?.length > 0
                  ? user.profilePicture
                  : defaultUserPic
              }")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <p className="mt-2 font-sans text-[16px] font-medium sm:text-[15px]">{`${user?.firstName} ${user?.lastName}`}</p>
          <div className="flex space-x-5 sm:space-x-4">
            <Button
              variant="text"
              color="inherit"
              style={{
                padding: 0,
                textTransform: "none",
                minWidth: 0,
                minHeight: 0,
                paddingTop: 0,
                marginTop: 7,
              }}
            >
              <Link to={`/${username}/followers`}>
                <p className="cursor-pointer text-[14px] text-[#1B5E20] sm:text-[13px]">
                  {`${convertNumberToShortFormat(
                    user?.followers?.length
                  )} Followers`}
                </p>
              </Link>
            </Button>
            <Button
              variant="text"
              color="inherit"
              style={{
                padding: 0,
                textTransform: "none",
                minWidth: 0,
                minHeight: 0,
                paddingTop: 0,
                marginTop: 7,
              }}
            >
              <Link to={`/${username}/followings`}>
                <p className="cursor-pointer text-[14px] text-[#1B5E20] sm:text-[13px]">
                  {`${convertNumberToShortFormat(
                    user?.followings?.length
                  )} Following`}
                </p>
              </Link>
            </Button>
          </div>
          <p className="mt-2 text-[14px] font-medium text-[#757575] sm:text-[13px]">
            {user?.bio}
          </p>
          {!authenticatedUser ||
            (user._id !== authenticatedUser._id && (
              <div className="mt-5">
                <Button
                  variant="contained"
                  color="success"
                  style={{
                    textTransform: "none",
                    borderRadius: 50,
                    height: 33,
                    boxShadow: "none",
                  }}
                  onClick={handleFollow}
                >
                  <p className="text-[14px] sm:text-[13px]">
                    {!isFollowings ? "Follow" : "Following"}
                  </p>
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RightBar;
