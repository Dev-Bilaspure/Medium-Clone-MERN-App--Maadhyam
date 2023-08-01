import { defaultUserPic } from "@/constants";
import { Button, Popover, Tooltip, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useEffect, useState } from "react";
import PopoverMoreIcon from "@/components/secondary/PopoverMoreIcon";
import { twMerge } from "tailwind-merge";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import { convertNumberToShortFormat, getTimeAgo } from "@/utils/helperMethods";
import ReactQuill from "react-quill";
import "./commentDisplayStyles.css";

const Comments = ({
  post,
  commentToEdit,
  setCommentToEdit,
  setNewComment,
  comments,
  setComments,
  setCommentsToEditNewContent,
}) => {
  const {
    actions: {
      comment: { getPostComments },
    },
    data: { authenticatedUser },
  } = useStore();

  useEffect(() => {
    // if (!authenticatedUser) return;
    (async () => {
      const response = await getPostComments(post._id);
      if (response.success) {
        setComments(response.comments);
      }
      debug_mode && console.log(response);
    })();
  }, []);

  const updateCommentsOnLikeUnlike = (comment) => {
    setComments(
      comments.map((c) => {
        if (c._id === comment._id) return comment;
        return c;
      })
    );
  };
  return (
    <div className="w-full">
      {comments.length === 0 ? (
        <div className="mt-10 flex justify-center sm:mt-5">
          <p className="font-sans text-[14px] sm:text-[13px]">
            No comments yet.
          </p>
        </div>
      ) : (
        comments.map((comment) => {
          return (
            <Comment
              key={comment?._id}
              post={post}
              comment={comment}
              setComments={setComments}
              comments={comments}
              commentToEdit={commentToEdit}
              setCommentToEdit={setCommentToEdit}
              setNewComment={setNewComment}
              updateCommentsOnLikeUnlike={updateCommentsOnLikeUnlike}
              setCommentsToEditNewContent={setCommentsToEditNewContent}
            />
          );
        })
      )}
    </div>
  );
};

const Comment = ({
  post,
  comment,
  setComments,
  comments,
  commentToEdit,
  setCommentToEdit,
  setNewComment,
  updateCommentsOnLikeUnlike,
  setCommentsToEditNewContent,
  ...props
}) => {
  const [isLiked, setIsLiked] = useState<boolean>();
  const {
    data: { authenticatedUser },
    actions: {
      comment: { deleteComment, likeAComment, unlikeAComment },
    },
  } = useStore();

  useEffect(() => {
    if (!authenticatedUser) return;
    setIsLiked(comment.likes.includes(authenticatedUser._id));
  }, [comments]);

  const handleLike = async () => {
    if (!authenticatedUser) return;
    try {
      if (isLiked) {
        const response = await unlikeAComment(comment._id);
        if (response.success) {
          updateCommentsOnLikeUnlike({
            ...comment,
            likes: comment.likes.filter(
              (like) => like !== authenticatedUser._id
            ),
          });
        }
        debug_mode && console.log(response);
      } else {
        const response = await likeAComment(comment._id);
        if (response.success) {
          updateCommentsOnLikeUnlike({
            ...comment,
            likes: [...comment.likes, authenticatedUser._id],
          });
        }
        debug_mode && console.log(response);
      }
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!authenticatedUser) return;
    try {
      const response = await deleteComment(comment._id);
      if (response.success) {
        setComments((comment) => {
          return comment.filter((c) => c._id !== response.comment._id);
        });
      }
      debug_mode && console.log(response);
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  return (
    <div
      className={twMerge(
        "mt-[30px] border-b border-[#E6E6E6] pb-5 ",
        props.className
      )}
    >
      <div className="flex h-9 space-x-3">
        <img
          src={comment?.authorInfo?.profilePicture || defaultUserPic}
          className="h-[40px] w-[40px] cursor-pointer rounded-full object-cover"
        />
        <div className="item-center flex cursor-pointer flex-col justify-center">
          <div className="flex space-x-3">
          <p className="font-sans text-[14px]">
            {comment?.authorId === authenticatedUser?._id
              ? "You"
              : comment?.authorInfo.firstName +
                " " +
                comment?.authorInfo.lastName}
          </p>
          {comment.authorId === post.authorId && <div className="bg-[#2E7D32] flex justify-center px-2 rounded-xl h-[19px]">
            <p className="text-[11px] mt-[3px] text-[#ffffff]  ">AUTHOR</p>
          </div>}
          </div>
          <p className="text-[12px]">{getTimeAgo(comment?.createdAt)}</p>
        </div>
      </div>
      <div className="mt-5 ">
        <ReactQuill
          value={comment?.content}
          readOnly={true}
          className="ql-style-comment-display"
        />
        <div className="mt-2 flex flex-row justify-between">
          <div className="flex flex-row space-x-2">
            {isLiked ? (
              <i
                className="fa-solid fa-thumbs-up flex cursor-pointer flex-row items-center justify-center text-[17px]"
                style={{ color: "rgb(70, 70, 70)" }}
                onClick={handleLike}
              ></i>
            ) : (
              <i
                className="fa-regular fa-thumbs-up flex cursor-pointer flex-row items-center justify-center text-[17px]"
                onClick={handleLike}
              ></i>
            )}
            <p className="mt-1 font-sans text-[12px]">
              {comment?.likes?.length > 0
                ? convertNumberToShortFormat(comment?.likes?.length)
                : 0}
            </p>
          </div>
          {authenticatedUser &&
            (comment?.authorId === authenticatedUser._id ||
              post.authorId === authenticatedUser._id) && (
              <Tooltip title="more" placement="top">
                <div className="item-center flex cursor-pointer justify-center">
                  <PopoverMoreIcon
                    element={
                      <div className="flex flex-col  py-2 pt-1">
                        <div className="flex justify-center border-b border-[#E6E6E6] py-2 px-5">
                          <Button
                            variant="text"
                            color="error"
                            style={{ textTransform: "none", padding: 0 }}
                            onClick={handleDelete}
                          >
                            Delete
                          </Button>
                        </div>
                        {comment?.authorId === authenticatedUser._id && (
                          <div className="flex justify-center py-1 px-5 pt-2">
                            <Button
                              variant="text"
                              color="inherit"
                              style={{ textTransform: "none", padding: 0 }}
                              onClick={() => {
                                setNewComment("");
                                setCommentToEdit(comment);
                                setCommentsToEditNewContent(comment?.content);
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    }
                    buttonElement={
                      <MoreHorizIcon color="inherit" style={{ fontSize: 20 }} />
                    }
                  />
                </div>
              </Tooltip>
            )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
