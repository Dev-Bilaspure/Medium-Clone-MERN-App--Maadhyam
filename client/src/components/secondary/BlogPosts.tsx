import { defaultUserPic } from "@/constants";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import _, { set } from "lodash";
import BlogOptionsMenu from "./BlogOptionMenu";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import { convert } from "html-to-text";
import SuccessSnackBar from "./SuccessSnackBar";
import { Tab, Tabs, styled } from "@mui/material";
import { getTimeAgo } from "@/utils/helperMethods";

const BlogPosts = ({ posts, setPosts, noPostsMessage, ...props }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    data: { authenticatedUser },
  } = useStore();

  // only for bookmarks page
  const onPostUnBookmarked = (pId) => {
    setPosts(posts.filter((post) => post._id !== pId));
  };

  // only for liked posts page
  const onPostUnLiked = (pId) => {
    setPosts(posts.filter((post) => post._id !== pId));
  };

  const AntTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      backgroundColor: "#000000",
      height: 1,
    },
  });
  // for styling signin tab
  const AntTab1 = styled((props) => <Tab disableRipple {...props} />)(() => ({
    textTransform: "none",
    fontSize: 15,
    color: tabValue === 0 ? "#000000" : "rgb(97,97,97)",
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
    paddingBottom: 5,
  }));

  // for styling signup tab
  const AntTab2 = styled((props) => <Tab disableRipple {...props} />)(() => ({
    textTransform: "none",
    fontSize: 15,
    color: tabValue === 1 ? "#000000" : "rgb(97,97,97)",
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
    paddingBottom: 5,
  }));
  return (
    <div
      className={twMerge(
        `flex flex-col space-y-[40px] pb-10 sm:space-y-[30px] sm:border-b sm:border-gray`,
        props.className
      )}
    >
      {authenticatedUser && (
        <div className="border-b border-gray">
          <div className="w-[250px] sm:w-[200px] ">
            <AntTabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
              style={{ width: "100%" }}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
            >
              <AntTab1 label="Home" />
              <AntTab2 label="Followings" />
            </AntTabs>
          </div>
        </div>
      )}
      {(!authenticatedUser || tabValue === 0
        ? posts.length
        : posts.filter((post) =>
            authenticatedUser.followings.includes(post.authorId)
          ).length) === 0 ? (
        <div className="rgb(60, 60, 60) flex w-full justify-center text-[14px] sm:text-[13px]">
          {noPostsMessage}
        </div>
      ) : (
        <div className="space-y-[60px] sm:space-y-[50px]">
          {posts.map((post) => {
            return (
              <BlogPost
                post={post}
                key={post._id}
                setPosts={setPosts}
                onPostUnBookmarked={onPostUnBookmarked}
                onPostUnLiked={onPostUnLiked}
                tagValue={tabValue}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const BlogPost = ({ post, setPosts, tagValue, ...props }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [postsAuthor, setPostsAuthor] = useState<any>(null);

  const [likedPostSuccess, setLikedPostSuccess] = useState(false);
  const [unlikedPostSuccess, setUnlikedPostSuccess] = useState(false);
  const [bookmarkedPostSuccess, setBookmarkedPostSuccess] = useState(false);
  const [unbookmarkedPostSuccess, setUnbookmarkedPostSuccess] = useState(false);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const {
    data: { authenticatedUser },
    actions: {
      post: { likeAPost, unlikeAPost },
      user: { bookmarkAPost, unbookmarkAPost, getUserById },
    },
  } = useStore();

  useEffect(() => {
    (async () => {
      try {
        const response = await getUserById(post.authorId);
        if (response.success) {
          setPostsAuthor(response.user);
        }
        debug_mode && console.log(response);
      } catch (error) {
        debug_mode && console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    if (authenticatedUser) {
      setIsLiked(_.includes(post.likes, authenticatedUser._id));
      setIsBookmarked(_.includes(authenticatedUser.bookmarks, post._id));
    }
    setLikesCount(post.likes?.length);
  }, [authenticatedUser]);

  const handleLike = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    try {
      if (isLiked) {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
        const response = await unlikeAPost(post._id);
        if (response.success) {
          setUnlikedPostSuccess(true);
          debug_mode && console.log("post unliked successfully");
          if (pathname === "/me/liked" && props.onPostUnLiked) {
            props.onPostUnLiked(post._id);
          }
        }
        debug_mode && console.log(response);
      } else {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
        const response = await likeAPost(post._id);
        if (response.success) {
          setLikedPostSuccess(true);
          debug_mode && console.log("post liked successfully");
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
        setIsBookmarked(false);
        const response = await unbookmarkAPost(post._id);
        if (response.success) {
          debug_mode && console.log("unbookmarked successfully");
          setUnbookmarkedPostSuccess(true);
          if (pathname === "/me/bookmarks" && props.onPostUnBookmarked) {
            props.onPostUnBookmarked(post._id);
          }
        }
        debug_mode && console.log(response);
      } else {
        setIsBookmarked(true);
        const response = await bookmarkAPost(post._id);
        if (response.success) {
          debug_mode && console.log("bookmarked successfully");
          setBookmarkedPostSuccess(true);
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  return (
    (!authenticatedUser ||
      tagValue === 0 ||
      authenticatedUser.followings.includes(post.authorId)) && (
      <div className={twMerge("", props.className)}>
        <div className="mb-[2px] flex flex-row space-x-2">
          <Link to={`/${postsAuthor ? postsAuthor.username : ""}`}>
            <img
              src={
                postsAuthor
                  ? postsAuthor.profilePicture.length > 0
                    ? postsAuthor.profilePicture
                    : defaultUserPic
                  : defaultUserPic
              }
              className="h-[24px] w-[24px] cursor-pointer rounded-lg object-cover"
            />
          </Link>
          <Link to={`/${postsAuthor ? postsAuthor.username : ""}`}>
            <p className="mt-[2px] flex cursor-pointer flex-row items-center justify-center text-[14px] font-medium sm:text-[12px]">
              {postsAuthor
                ? postsAuthor.firstName + " " + postsAuthor.lastName
                : ""}
              <span className="ml-[7px]">
                <div className="h-[2.5px] w-[2.5px] bg-[#757575]"></div>
              </span>
              <span className="ml-[7px] text-[14px] font-medium text-[#757575] sm:text-[12px]">
                {getTimeAgo(post.createdAt)}
              </span>
              <span className="ml-[7px]">
                <div className="h-[2.5px] w-[2.3px] bg-[#757575]"></div>
              </span>
              <span className="ml-[7px] text-[14px] font-medium text-[#757575] sm:text-[12px]">{`${post.views} views`}</span>
            </p>
          </Link>
        </div>
        <div className="flex h-[150px] flex-row space-x-[50px] rounded-lg md:space-x-10 sm:space-x-2">
          <div
            className={`flex  ${
              post.image?.length === 0 ? "w-full" : "w-2/3"
            } flex-col space-y-1 rounded-lg`}
          >
            <div className="flex h-full flex-col space-y-3 rounded-lg">
              <div className="flex h-full flex-col space-y-2 rounded-lg">
                <Link to={`/blog/${post._id}`}>
                  <p className="cursor-pointer font-outfit text-[21px] font-bold line-clamp-2 sm:text-[16px]">
                    {post.title}
                  </p>
                </Link>
                <Link to={`/blog/${post._id}`}>
                  <p className="font-sans text-[14px] leading-6 text-[#555555] line-clamp-2 sm:text-[12px] sm:leading-5">
                    {_.startCase(_.toLower(convert(post.description)))}
                  </p>
                </Link>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-row space-x-7">
                  <div className="flex flex-row space-x-2">
                    {isLiked ? (
                      <i
                        className="fa-solid fa-thumbs-up rbg(70, 70, 70) flex cursor-pointer flex-row items-center justify-center text-[18px]"
                        onClick={handleLike}
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-thumbs-up flex cursor-pointer flex-row items-center justify-center text-[18px]"
                        onClick={handleLike}
                      ></i>
                    )}
                    <p className="mt-1 font-sans text-[13px]">{likesCount}</p>
                  </div>
                  {isBookmarked ? (
                    <i
                      className="fa-solid fa-bookmark  flex cursor-pointer flex-row items-center justify-center text-[17px]"
                      style={{ color: "rgb(26,136,22)" }}
                      onClick={handleBookmark}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-bookmark flex cursor-pointer flex-row items-center justify-center text-[17px]"
                      onClick={handleBookmark}
                    ></i>
                  )}
                </div>
                {authenticatedUser &&
                  authenticatedUser._id === post.authorId && (
                    <div className="item-center flex cursor-pointer justify-center">
                      <BlogOptionsMenu postId={post._id} setPosts={setPosts} />
                    </div>
                  )}
              </div>
            </div>
          </div>
          {!(post.image?.length === 0) && (
            <div className="w-1/3 rounded-r-lg object-cover">
              <Link to={`/blog/${post._id}`}>
                <img
                  src={post.image?.length ? post.image : ""}
                  className="h-full w-full cursor-pointer rounded-sm object-cover"
                />
              </Link>
            </div>
          )}
        </div>
        {post.tags?.length > 0 && (
          <div className="mt-1 flex flex-row flex-wrap space-x-4">
            {post.tags.map((tag) => {
              return (
                <Link to={`/tag/${tag}`}>
                  <div className="mt-2 cursor-pointer rounded-full border border-[#E6E6E6] bg-[#E8E8E8] px-[8px] py-[1px] text-[11px] hover:shadow-lg focus:shadow-sm sm:text-[10px]">
                    {_.capitalize(tag)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <SuccessSnackBar
          handleClose={() => setLikedPostSuccess(false)}
          open={likedPostSuccess}
          message={"Post liked!"}
        />
        <SuccessSnackBar
          handleClose={() => setUnlikedPostSuccess(false)}
          open={unlikedPostSuccess}
          message={"Post unliked!"}
        />
        <SuccessSnackBar
          handleClose={() => setBookmarkedPostSuccess(false)}
          open={bookmarkedPostSuccess}
          message={"Post bookmarked!"}
        />
        <SuccessSnackBar
          handleClose={() => setUnbookmarkedPostSuccess(false)}
          open={unbookmarkedPostSuccess}
          message={"Post unbookmarked!"}
        />
      </div>
    )
  );
};

export default BlogPosts;
