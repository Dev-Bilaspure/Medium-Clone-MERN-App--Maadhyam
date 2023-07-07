import React, { useState } from "react";
import ReactQuill from "react-quill";
import { TextareaAutosize } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import "./testingQuill.css";

const TextEditor = () => {
  const [editorHtml, setEditorHtml] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: "" }, { align: "center" }, { align: "right" }],
      ["link"],
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
  ];

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  return (
    <div className="text-editor-container">
      <ReactQuill
        value={editorHtml}
        onChange={handleChange}
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="Write something..."
        className="ql-style"
      />
      <TextareaAutosize
        value={editorHtml}
        onChange={(e) => setEditorHtml(e.target.value)}
        aria-label="empty textarea"
        placeholder="Write something..."
      />
    </div>
  );
};

export default TextEditor;
