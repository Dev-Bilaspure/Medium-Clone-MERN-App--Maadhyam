import React, { useState } from "react";
import ReactQuill from "react-quill";
import { TextareaAutosize } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import "./TextEditorStyles.css";
import { twMerge } from "tailwind-merge";
import { convert } from "html-to-text";

const TextEditor = ({
  description,
  setDescription,
  isConnected,
  handleDescriptionChange,
  ...props
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: "" }, { align: "center" }, { align: "right" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      ["image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "link",
    "color",
    "background",
    "image",
    "video",
    "clean",
  ];

  const handleChange = (html) => {
    setDescription(html);
    handleDescriptionChange(html);
  };

  return (
    <div className={twMerge("text-editor-container", props.className)}>
      <ReactQuill
        value={description}
        onChange={handleChange}
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="Tell your story..."
        className="ql-style"
        readOnly={!isConnected}
      />
    </div>
  );
};

export default TextEditor;
