import PopoverMoreIcon from "@/components/secondary/PopoverMoreIcon";
import { Button, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CommentBar from "./CommnetBar";
import { useSpeechSynthesis } from "react-speech-kit";
import { twMerge } from "tailwind-merge";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import { useNavigate } from "react-router-dom";
import { convertNumberToShortFormat } from "@/utils/helperMethods";
import BlogOptionsMenu from "@/components/secondary/BlogOptionMenu";
import SuccessSnackBar from "@/components/secondary/SuccessSnackBar";

const MiddleBar = ({ textToRead, post, setPost, ...props }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likePostSuccess, setLikePostSuccess] = useState<boolean>(false);
  const [unlikePostSuccess, setUnlikePostSuccess] = useState<boolean>(false);
  const [bookmarkPostSuccess, setBookmarkPostSuccess] =
    useState<boolean>(false);
  const [unbookmarkPostSuccess, setUnbookmarkPostSuccess] =
    useState<boolean>(false);

  const [showComments, setShowComments] = useState<Boolean>(false);
  const toggleCommentBar = (value: Boolean) => {
    setShowComments(value);
  };
  const [isPlaying, setIsPlaying] = useState(false);

  const { speak, cancel } = useSpeechSynthesis();

  const {
    data: { authenticatedUser },
    actions: {
      post: { likeAPost, unlikeAPost },
      user: { bookmarkAPost, unbookmarkAPost },
      setAuthenticatedUser,
    },
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedUser) return;
    setIsLiked(post.likes?.includes(authenticatedUser._id));
    setIsBookmarked(authenticatedUser.bookmarks?.includes(post._id));
  }, [authenticatedUser, post]);

  const handleLike = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    try {
      if (isLiked) {
        setIsLiked(false);
        const response = await unlikeAPost(post._id);
        if (response.success) {
          debug_mode && console.log("unliked successfully");
          setPost({
            ...post,
            likes: post.likes.filter((id) => id !== authenticatedUser._id),
          });
          setUnlikePostSuccess(true);
        }
        debug_mode && console.log(response);
      } else {
        setIsLiked(true);
        const response = await likeAPost(post._id);
        if (response.success) {
          debug_mode && console.log("liked successfully");
          setPost({ ...post, likes: [...post.likes, authenticatedUser._id] });
          setLikePostSuccess(true);
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
          setAuthenticatedUser({
            ...authenticatedUser,
            bookmarks: authenticatedUser.bookmarks.filter(
              (id) => id !== post._id
            ),
          });
          setUnbookmarkPostSuccess(true);
        }
        debug_mode && console.log(response);
      } else {
        setIsBookmarked(true);
        const response = await bookmarkAPost(post._id);
        if (response.success) {
          debug_mode && console.log("bookmarked successfully");
          setAuthenticatedUser({
            ...authenticatedUser,
            bookmarks: [...authenticatedUser.bookmarks, post._id],
          });
          setBookmarkPostSuccess(true);
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };
  return (
    <div className={twMerge("", props.className)}>
      <CommentBar
        showComments={showComments}
        onCloseShowComment={() => toggleCommentBar(false)}
        post={post}
        setPost={setPost}
      />
      <div className="mt-2 flex justify-between">
        <div className=" flex flex-row space-x-7 sm:space-x-5">
          <Tooltip title="Like" placement="top-start">
            <div className="flex flex-row space-x-2 ">
              {isLiked ? (
                <i
                  className="fa-solid fa-thumbs-up flex cursor-pointer flex-row items-center justify-center text-[21px] sm:text-[17px]"
                  style={{ color: "rgb(70, 70, 70)" }}
                  onClick={handleLike}
                ></i>
              ) : (
                <i
                  className="fa-regular fa-thumbs-up flex cursor-pointer flex-row items-center justify-center text-[21px] sm:text-[17px]"
                  onClick={handleLike}
                ></i>
              )}
              <p className="mt-1 font-sans text-[14px] sm:text-[13px]">
                {post.likes?.length
                  ? convertNumberToShortFormat(post.likes?.length)
                  : 0}
              </p>
            </div>
          </Tooltip>
          <Tooltip title="Bookmark" placement="top">
            {isBookmarked ? (
              <i
                className="fa-solid fa-bookmark  flex cursor-pointer flex-row items-center justify-center text-[18px] sm:text-[17px]"
                style={{ color: "rgb(26,136,22)" }}
                onClick={handleBookmark}
              ></i>
            ) : (
              <i
                className="fa-regular fa-bookmark flex cursor-pointer flex-row items-center justify-center text-[18px] sm:text-[17px]"
                onClick={handleBookmark}
              ></i>
            )}
          </Tooltip>
          <Tooltip title="Comments" placement="top-start">
            <div className="flex space-x-2 ">
              <i
                className="fa-regular fa-comment flex cursor-pointer flex-row items-center justify-center text-[20px] sm:text-[17px]"
                onClick={() => toggleCommentBar(true)}
              ></i>
              <p className="mt-1 font-sans text-[14px] sm:text-[13px]">
                {post.comments?.length || 0}
              </p>
            </div>
          </Tooltip>
        </div>
        <div className=" flex flex-row space-x-7 sm:space-x-5">
          {authenticatedUser && authenticatedUser._id === post.authorId && (
            <BlogOptionsMenu postId={post._id} />
          )}
          <Tooltip title="Listen" placement="top-start">
            <div className="cursor-pointer">
              {!isPlaying ? (
                <i
                  className="fa-regular fa-circle-play mt-[2px] text-[22px] sm:text-[19px]"
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    speak({ text: textToRead });
                  }}
                ></i>
              ) : (
                <i
                  className="fa-regular fa-circle-pause mt-[2px] text-[22px] sm:text-[19px]"
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    cancel();
                  }}
                ></i>
              )}
            </div>
          </Tooltip>
          <PopoverMoreIcon
            element={
              <Button
                variant="text"
                color="inherit"
                style={{
                  padding: 0,
                  minWidth: 0,
                  backgroundColor: "#FFFFFF",
                  textTransform: "none",
                  height: "fit-content",
                }}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                  } catch (error) {
                    console.error("Failed to copy text:", error);
                  }
                }}
              >
                <div className="flex justify-center space-x-1 px-5 py-3">
                  <ContentCopyIcon
                    color="inherit"
                    style={{ height: 17, marginTop: 2 }}
                  />
                  <p className="text-[14px]">{`Copy Link`}</p>
                </div>
              </Button>
            }
            buttonElement={
              <Tooltip title="Share" placement="top-start">
                <i className="fa-solid fa-arrow-up-from-bracket text-[18px] sm:text-[16px]"></i>
              </Tooltip>
            }
          />
        </div>
      </div>
      <SuccessSnackBar
        handleClose={() => setLikePostSuccess(false)}
        open={likePostSuccess}
        message={"Post liked!"}
      />
      <SuccessSnackBar
        handleClose={() => setUnlikePostSuccess(false)}
        open={unlikePostSuccess}
        message={"Post unliked!"}
      />
      <SuccessSnackBar
        handleClose={() => setBookmarkPostSuccess(false)}
        open={bookmarkPostSuccess}
        message={"Post bookmarked!"}
      />
      <SuccessSnackBar
        handleClose={() => setUnbookmarkPostSuccess(false)}
        open={unbookmarkPostSuccess}
        message={"Post unbookmarked!"}
      />
    </div>
  );
};

export default MiddleBar;
