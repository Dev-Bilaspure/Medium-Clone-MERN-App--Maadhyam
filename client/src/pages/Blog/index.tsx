import { debug_mode } from "@/debug-controller";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { defaultUserPic } from "@/constants";
import { Button, Typography } from "@mui/material";
import MiddleBar from "./MiddleBar";
import { twMerge } from "tailwind-merge";
import { convert } from "html-to-text";
import "./blogContentStyle.css";
import ReactQuill from "react-quill";
import { useStore } from "@/store/useStore";
import NotFound from "../NotFound";
import SplashScreen from "../SplashScreen";
import { getTimeAgo, isValidObjectId } from "@/utils/helperMethods";
import { INTERNAL_SERVER_ERROR, RESOURCE_NOT_FOUND } from "@/utils/errorTypes";
import _ from "lodash";
import FetchingDataLoader from "@/components/primary/FetchingDataLoader";
import SEO from "@/components/primary/SEO";

const Blog = (props) => {
  const [post, setPost] = useState<any>({});
  const [isResourceNotFound, setIsResourceNotFound] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { postId } = useParams();
  const [postsAuthor, setPostsAuthor] = useState<any>(null);

  const navigate = useNavigate();

  const {
    data: { authenticatedUser },
    actions: {
      user: { unfollowAUser, followAUser, getUserById },
      post: { getPostById },
    },
  } = useStore();

  useEffect(() => {
    if (!post?.authorId) return;
    (async () => {
      try {
        const response = await getUserById(post.authorId);
        if (response.success) {
          setPostsAuthor(response.user);
          setIsFollowing(
            authenticatedUser &&
              response.user.followers.includes(authenticatedUser._id)
          );
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [post]);

  useEffect(() => {
    if (!postId) return;
    setIsFetching(true);
    if (!isValidObjectId(postId)) {
      setIsResourceNotFound(true);
      setIsFetching(false);
      return;
    }
    (async () => {
      try {
        const response = await getPostById(postId);

        if (response.success) {
          if (response.post.isPublished === false) {
            setIsResourceNotFound(true);
            setIsFetching(false);
            return;
          }
          setPost(response.post);
          
        } else {
          const errorType = response?.error?.response?.data?.errorType;
          if (errorType === RESOURCE_NOT_FOUND) {
            setIsResourceNotFound(true);
          }
        }
        debug_mode && console.log(response);
        setIsFetching(false);
      } catch (error: any) {
        setIsFetching(false);
      }
    })();
  }, []);

  const handleFollowButtonClick = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    if (authenticatedUser._id === post?.authorId) return;
    try {
      if (isFollowing) {
        const response = await unfollowAUser(post.authorId);
        if (response.success) {
          debug_mode && console.log("unfollowed successfully");
          setIsFollowing(false);
        }
        debug_mode && console.log(response);
      } else {
        const response = await followAUser(post.authorId);
        if (response.success) {
          debug_mode && console.log("followed successfully");
          setIsFollowing(true);
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  return isFetching ? (
    <div className="mt-40 flex justify-center sm:mt-[100px]">
      <FetchingDataLoader />
    </div>
  ) : isResourceNotFound ? (
    <NotFound />
  ) : (
    <div
      className={twMerge("flex justify-center pt-10 sm:px-5", props.className)}
    >
      <SEO options={{ title: post.title }} />
      <div className="w-1/2 lg:w-3/4 xs:w-full">
        <p className="font-merriWeather text-[40px] font-bold leading-tight text-[#373737] lg:text-[40px] md:text-[35px] sm:text-[28px] sm:leading-9">
          {post?.title}
        </p>
        <img
          src={post?.image?.length > 0 ? post?.image : ""}
          className="h-hull mt-5 w-full rounded-lg object-cover"
        />
        <div className="mt-10 pb-10 sm:pb-5">
          <div className="flex h-[42px] space-x-3 ">
            <Link to={`/${postsAuthor ? postsAuthor.username : ""}`}>
              <img
                src={
                  postsAuthor && postsAuthor.profilePicture?.length > 0
                    ? postsAuthor.profilePicture
                    : defaultUserPic
                }
                className="h-[45px] w-[45px] cursor-pointer rounded-full object-cover sm:h-[40px] sm:w-[40px]"
              />
            </Link>
            <div className="item-center flex cursor-pointer flex-col justify-center space-y-[5px]">
              <div className="flex space-x-5">
                <Link to={`/${postsAuthor ? postsAuthor.username : ""}`}>
                  <p className="text-[14px]">
                    {`${post?.authorInfo?.firstName} ${post?.authorInfo?.lastName}`}
                  </p>
                </Link>
                <Button
                  variant="text"
                  color="success"
                  style={{
                    padding: 0,
                    minWidth: 0,
                    textTransform: "none",
                    height: 21,
                  }}
                  onClick={handleFollowButtonClick}
                >
                  <p className="text-[14px] font-medium">
                    {isFollowing ? "Following" : "Follow"}
                  </p>
                </Button>
              </div>
              <div className="flex text-[13px] font-medium text-[#757575]">
                {getTimeAgo(post?.createdAt)}{" "}
                <div className="ml-[7px] mt-[9px] h-[2px] w-[2.5px] bg-[#757575]"></div>
                <span className="ml-[7px]  font-medium text-[#757575]">{`${post.views} views`}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 h-[45px] w-full border-b-2 border-t-2 border-[#F2F2F2] border-[#F2F2F2] sm:h-[40px]">
          <MiddleBar
            textToRead={convert(post?.description)}
            post={post}
            setPost={setPost}
          />
        </div>
        {post?.tags?.length > 0 && (
          <div className="mt-7 flex space-x-5 sm:mt-5 sm:space-x-2">
            <p className="flex items-center justify-center text-[17px] font-medium sm:text-[13px]">
              Topics:{" "}
            </p>
            <div className="flex items-center justify-center space-x-3 sm:space-x-2">
              {post?.tags?.map((item) => {
                return (
                  <Link to={`/tag/${item}`}>
                    <div className="flex w-fit cursor-pointer items-center justify-center rounded-full border border-[#E6E6E6] bg-[#E8E8E8] px-[10px] py-[2px] pt-1 text-[13px] hover:shadow-lg focus:shadow-sm  sm:px-[5px] sm:py-0 sm:text-[11px]">
                      {_.capitalize(item)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-10 mb-20 pb-20 font-merriWeather text-[16px] sm:mt-5 sm:text-[15px]">
          <ReactQuill
            value={post?.description}
            readOnly={true}
            className="ql-style-blog"
          />
        </div>
      </div>
    </div>
  );
};

export default Blog;
