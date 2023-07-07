import React, { useEffect, useState } from "react";
import sampleImage from "../../assets/images/sample-image.jpeg";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PopoverMoreIcon from "@/components/secondary/PopoverMoreIcon";
import { Button, Tooltip } from "@mui/material";
import DeletePostModal from "@/components/secondary/DeletePostModal";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import { INTERNAL_SERVER_ERROR, RESOURCE_NOT_FOUND } from "@/utils/errorTypes";
import { convertNumberToShortFormat, getTimeAgo } from "@/utils/helperMethods";
import BlogOptionsMenu from "@/components/secondary/BlogOptionMenu";
import { convert } from "html-to-text";
import FetchingDataLoader from "@/components/primary/FetchingDataLoader";

const Posts = ({ user, setIsResourceNotFound }) => {
  const [posts, setPosts] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const {
    data: { authenticatedUser },
    actions: {
      post: { getPostsByUserId },
    },
  } = useStore();

  useEffect(() => {
    setIsFetching(true);
    (async () => {
      setIsResourceNotFound(false);
      try {
        const response = await getPostsByUserId(user._id);
        if (response.success) {
          setPosts(response.posts);
        } else {
          debug_mode && console.log(response);
          const errorType = response?.error?.response?.data?.errorType;
          if (errorType === RESOURCE_NOT_FOUND) {
            setIsResourceNotFound(true);
          }
        }
        debug_mode && console.log(response, "devdevdevdevdevdev");
      } catch (error) {
        debug_mode && console.log(error);
      }
      setIsFetching(false);
    })();
  }, [user]);
  return (
    <div className="flex flex-col space-y-[70px] sm:space-y-[50px]">
      {isFetching ? (
        <div className="flex justify-center">
          <FetchingDataLoader />
        </div>
      ) : posts.length === 0 ? (
        <div className="rgb(60, 60, 60) flex justify-center space-x-1 text-[14px] sm:text-[13px]">
          <p>Blogs from </p>
          <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
          <p>will appear here.</p>
        </div>
      ) : (
        posts.map((post) => {
          return (
            <Post key={post._id} post={post} user={user} setPosts={setPosts} />
          );
        })
      )}
    </div>
  );
};

const Post = ({ post, user, setPosts }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const {
    data: { authenticatedUser },
    actions: {
      post: { likeAPost, unlikeAPost },
      user: { bookmarkAPost, unbookmarkAPost, getUserById },
    },
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedUser) return;
    setIsLiked(post.likes?.includes(authenticatedUser._id));
    setIsBookmarked(user.bookmarks?.includes(post._id));
    setLikesCount(post.likes?.length);
  }, [post, authenticatedUser]);

  const handleLike = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    try {
      if (isLiked) {
        const response = await unlikeAPost(post._id);
        if (response.success) {
          setIsLiked(false);
          setLikesCount(likesCount - 1);
        }
        debug_mode && console.log(response);
      } else {
        const response = await likeAPost(post._id);
        if (response.success) {
          setIsLiked(true);
          setLikesCount(likesCount + 1);
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  const handleBookmark = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    try {
      if (isBookmarked) {
        const response = await unbookmarkAPost(post._id);
        if (response.success) {
          setIsBookmarked(false);
        }
        debug_mode && console.log(response);
      } else {
        const response = await bookmarkAPost(post._id);
        if (response.success) {
          setIsBookmarked(true);
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };
  return (
    <div>
      <div className="flex font-sans text-[13px] font-medium text-[#757575] sm:text-[12px]">
        {getTimeAgo(post?.createdAt)}
        <div className="ml-[7px] mt-[9px] h-[2px] w-[2.5px] bg-[#757575]"></div>
        <span className="ml-[7px]  font-medium text-[#757575]">{`${post.views} views`}</span>
      </div>
      <div className="flex max-h-[126px] min-h-[126px] space-x-10 md:space-x-7 sm:space-x-4">
        <div
          className={`flex ${
            post.image?.length ? "w-2/3" : "w-full"
          } flex-col space-y-2 `}
        >
          <div className="flex h-full flex-col space-y-1">
            <Link to={`/blog/${post._id}`}>
              <p className="font-outfit text-[19px] line-clamp-2 sm:text-[17px]">
                {post.title}
              </p>
            </Link>
            <Link to={`/blog/${post._id}`}>
              <p
                className="font-sans text-[14px] line-clamp-2 sm:text-[12px]"
                style={{ textTransform: "none" }}
              >
                {_.startCase(_.toLower(convert(post.description)))}
              </p>
            </Link>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-row space-x-7">
              <div className="flex flex-row space-x-2 ">
                {isLiked ? (
                  <i
                    className="fa-solid fa-thumbs-up flex cursor-pointer flex-row items-center justify-center text-[16px] sm:text-[14px]"
                    style={{ color: "rgb(70, 70, 70)" }}
                    onClick={handleLike}
                  ></i>
                ) : (
                  <i
                    className="fa-regular fa-thumbs-up flex cursor-pointer flex-row items-center justify-center text-[16px] sm:text-[14px]"
                    onClick={handleLike}
                  ></i>
                )}
                <p className="mt-1 items-center justify-center font-sans text-[13px]">
                  {convertNumberToShortFormat(likesCount)}
                </p>
              </div>
              {isBookmarked ? (
                <i
                  className="fa-solid fa-bookmark  flex cursor-pointer flex-row items-center justify-center text-[15px] sm:text-[13px]"
                  style={{ color: "rgb(26,136,22)" }}
                  onClick={handleBookmark}
                ></i>
              ) : (
                <i
                  className="fa-regular fa-bookmark flex cursor-pointer flex-row items-center justify-center text-[15px] sm:text-[13px]"
                  onClick={handleBookmark}
                ></i>
              )}
            </div>
            {authenticatedUser && authenticatedUser._id === post.authorId && (
              <div className="item-center flex cursor-pointer justify-center">
                <BlogOptionsMenu postId={post._id} setPosts={setPosts} />
              </div>
            )}
          </div>
        </div>
        {post.image?.length > 0 && (
          <div className="w-1/3">
            <Link to={`/blog/${post._id}`}>
              <img
                src={post.image}
                className="h-full w-full cursor-pointer object-cover "
              />
            </Link>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-row flex-wrap space-x-2 sm:mt-3">
        {post?.tags?.map((tag) => {
          return (
            <Link to={`/tag/${tag}`}>
              <div className="cursor-pointer rounded-full border border-[#E6E6E6] bg-[#E8E8E8] px-[8px] py-[1px] text-[11px]  hover:shadow-lg focus:shadow-sm sm:px-[5px] sm:text-[10px]">
                {tag}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
