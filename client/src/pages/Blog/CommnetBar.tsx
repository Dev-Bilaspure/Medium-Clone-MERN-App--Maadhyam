import { Button, Drawer, TextareaAutosize, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Comments from "./Comments";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { defaultUserPic } from "@/constants";
import { debug_mode } from "@/debug-controller";
import ReactQuill from "react-quill";
import "./commentTextBoxStyle.css";
import { convert } from "html-to-text";

const CommentBar = ({
  showComments,
  onCloseShowComment,
  post,
  setPost,
  ...props
}) => {
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState("");
  const [commentToEdit, setCommentToEdit] = useState<any>(null);
  const [commentsToEditNewContent, setCommentsToEditNewContent] =
    useState<string>(""); // [commentId]: newContent

  const {
    data: { authenticatedUser },
    actions: {
      comment: { createComment, updateComment },
    },
  } = useStore();

  const handleComment = async () => {
    if (!authenticatedUser || newComment.length === 0) return;
    try {
      const response = await createComment({
        postId: post._id,
        content: newComment,
      });
      if (response.success) {
        setComments([response.comment, ...comments]);
        setPost({
          ...post,
          comments: [response.comment._id, ...post.comments],
        });
        setNewComment("");
      }
      debug_mode && console.log(response);
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  const handleEditComment = async () => {
    if (!authenticatedUser || !commentToEdit) return;
    try {
      const response = await updateComment({
        commentId: commentToEdit._id,
        content: commentsToEditNewContent,
      });
      if (response.success) {
        setComments(
          comments.map((c) => {
            if (c._id === commentToEdit._id) {
              return response.comment;
            }
            return c;
          })
        );
        setCommentToEdit(null);
        setCommentsToEditNewContent("");
      }
      debug_mode && console.log(response);
    } catch (error) {
      debug_mode && console.log(error);
    }
  };

  return (
    <div className={twMerge("", props.className)}>
      <div className="block sm:hidden">
        <Drawer
          anchor={"right"}
          open={showComments}
          onClose={onCloseShowComment}
          PaperProps={{
            className: "w-1/3 md:w-3/5 sm:w-5/6",
          }}
        >
          <div className="py-5">
            <div className="border-b border-[#E6E6E6] px-7 pb-10">
              <p className="font-arimo text-[21px] font-bold">{`Responses (${comments.length})`}</p>
              {!authenticatedUser || !post.isCommentsEnabled ? (
                !authenticatedUser ? (
                  <Link to="/login">
                    <TextareaAutosize
                      disabled={true}
                      className="mt-7 w-full resize-none rounded-md bg-white px-4 py-3 text-[14px] outline-none"
                      placeholder="What are your thoughts?"
                      style={{ boxShadow: "0px 0px 10px rgb(180, 180, 180)" }}
                    />
                  </Link>
                ) : (
                  <TextareaAutosize
                    disabled={true}
                    className="mt-7 w-full resize-none rounded-md bg-white px-4 py-3 text-[14px] outline-none"
                    placeholder="What are your thoughts?"
                    style={{ boxShadow: "0px 0px 10px rgb(180, 180, 180)" }}
                  />
                )
              ) : (
                <div
                  className="mt-7 flex w-full resize-none flex-col space-y-3 rounded-md bg-white px-4 py-4 text-[14px] outline-none"
                  style={{ boxShadow: "0px 0px 10px rgb(180, 180, 180)" }}
                >
                  <div className="flex space-x-2">
                    <div
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-cover"
                      style={{
                        backgroundImage: `url(${
                          authenticatedUser.profilePicture || defaultUserPic
                        })`,
                      }}
                    ></div>
                    <p className="flex items-center justify-center text-[14px]">
                      {`${authenticatedUser.firstName} ${authenticatedUser.lastName}`}
                    </p>
                  </div>
                  {/* <TextareaAutosize
                    className=" w-full resize-none rounded-md bg-white py-3 text-[14px] outline-none "
                    placeholder="What are your thoughts?"
                    value={
                      (commentToEdit && commentsToEditNewContent) || newComment
                    }
                    onChange={(e) => {
                      if (!authenticatedUser) return;
                      if (commentToEdit) {
                        setCommentsToEditNewContent(e.target.value);
                        return;
                      }
                      setNewComment(e.target.value);
                    }}
                  /> */}
                  <ReactQuill
                    value={
                      (commentToEdit && commentsToEditNewContent) || newComment
                    }
                    onChange={(val) => {
                      if (!authenticatedUser) return;
                      if (commentToEdit) {
                        setCommentsToEditNewContent(val);
                        return;
                      }
                      setNewComment(val);
                      if (convert(val) === "\n") {
                        setNewComment("");
                        setCommentsToEditNewContent("");
                      }
                    }}
                    theme="snow"
                    placeholder="What are your thoughts?"
                    className="ql-style-comment-section"
                  />
                  <div className="flex w-full justify-end space-x-4 font-bold">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="text"
                        color="inherit"
                        style={{
                          textTransform: "none",
                          paddingTop: 0,
                          paddingBottom: 0,
                          paddingLeft: 0,
                          paddingRight: 0,
                          minWidth: 0,
                          cursor: "pointer",
                        }}
                      >
                        <Typography
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            setNewComment("");
                            setCommentToEdit(null);
                            setCommentsToEditNewContent("");
                          }}
                        >
                          Cancel
                        </Typography>
                      </Button>
                    </div>
                    <div className="item-center flex justify-center">
                      <Button
                        variant="contained"
                        color="success"
                        disabled={
                          (newComment.length === 0 && !commentToEdit) ||
                          (commentToEdit &&
                            commentsToEditNewContent === commentToEdit.content)
                        }
                        style={{
                          borderRadius: 30,
                          textTransform: "none",
                          paddingTop: 3,
                          paddingBottom: 3,
                          paddingLeft: 12,
                          paddingRight: 12,
                          boxShadow: "none",
                        }}
                        onClick={
                          commentToEdit ? handleEditComment : handleComment
                        }
                      >
                        <Typography style={{ fontSize: 13 }}>
                          {commentToEdit ? "Edit" : "Comment"}
                        </Typography>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-7">
              {post.isCommentsEnabled ? (
                <Comments
                  post={post}
                  commentToEdit={commentToEdit}
                  setCommentToEdit={setCommentToEdit}
                  setNewComment={setNewComment}
                  comments={comments}
                  setComments={setComments}
                  setCommentsToEditNewContent={setCommentsToEditNewContent}
                />
              ) : (
                <div className="mt-10 flex justify-center font-sans text-[14px] sm:mt-5 sm:text-[13px]">
                  Comments are turned off.
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default CommentBar;
