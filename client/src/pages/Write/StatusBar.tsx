import React, { useState } from "react";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";
import { Button } from "@mui/material";
import { twMerge } from "tailwind-merge";
import { useLocation } from "react-router-dom";
import { convert } from "html-to-text";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import PublishPostModal from "@/components/secondary/PublishPostModal";

const StatusBar = ({
  postId,
  title,
  isSaving,
  isPublishing,
  setIsPublishing,
  description,
  isConnected,
  post,
  ...props
}) => {
  const { pathname } = useLocation();
  const htmlToText = convert(description);
  const [isPublishPostModalOpen, setIsPublishPostModalOpen] = useState(false);
  return (
    <div>
      <PublishPostModal
        post={post}
        postId={postId}
        setIsPublishPostModalOpen={setIsPublishPostModalOpen}
        isPublishPostModalOpen={isPublishPostModalOpen}
        isPublishing={isPublishing}
        setIsPublishing={setIsPublishing}
      />
      <div className={twMerge("flex justify-between", props.className)}>
        <div className="flex space-x-2 text-[14px] italic text-[#878686] sm:text-[12px]">
          <p className="flex items-center justify-center">Saved to Drafts</p>
          <p className="flex items-center justify-center text-[18px] not-italic">
            |
          </p>
          <p className="flex items-center justify-center">
            {" "}
            <div className="flex space-x-1">
              {isConnected ? (
                isSaving ? (
                  <CloudSyncOutlinedIcon
                    style={{ color: "#878686", fontSize: 18 }}
                  />
                ) : (
                  <CloudDoneOutlinedIcon
                    style={{ color: "#878686", fontSize: 18 }}
                  />
                )
              ) : (
                <CloudOffIcon style={{ color: "#878686", fontSize: 18 }} />
              )}
              <p className="">
                {isConnected
                  ? isSaving
                    ? "Saving..."
                    : "Saved"
                  : "Trying to connect..."}
              </p>
            </div>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Button
            variant="contained"
            color="success"
            style={{
              textTransform: "none",
              padding: 0,
              minWidth: 0,
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 50,
              fontSize: 13,
              boxShadow: "none",
              opacity: isPublishing ? 0.5 : 1,
              cursor: isPublishing ? "not-allowed" : "pointer",
            }}
            disabled={
              pathname.split("/")[1] !== "edit" ||
              htmlToText.length === 0 ||
              htmlToText === "\n" ||
              title === ""
            }
            onClick={() => setIsPublishPostModalOpen(true)}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
