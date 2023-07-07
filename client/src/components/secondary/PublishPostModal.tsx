import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Theme } from "@mui/material/styles";
import {
  Alert,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { tagsArray } from "@/constants";
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { debug_mode } from "@/debug-controller";
import SuccessSnackBar from "./SuccessSnackBar";

const PublishPostModal = ({
  isPublishPostModalOpen,
  setIsPublishPostModalOpen,
  setIsPublishing,
  isPublishing,
  postId,
  post,
}) => {
  const [isNextClicked, setIsNextClicked] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);
  const [isCommentsEnabled, setIsCommentsEnabled] = React.useState(true);
  const [isPublishedSuccess, setIsPublishSuccess] =
    React.useState<boolean>(false);
  const navigate = useNavigate();

  const {
    actions: {
      post: { updatePost },
    },
  } = useStore();

  const handleClose = () => {
    if (isPublishing) return;
    setIsPublishPostModalOpen(false);
    setIsNextClicked(false);
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const response = await updatePost({
        postId,
        isCommentsEnabled,
        tags,
        isPublished: true,
      });
      if (response.success) {
        setIsPublishSuccess(true);
        setIsPublishing(false);
        handleClose();
        navigate(`/blog/${postId}`);
      }
      debug_mode && console.log(response);
    } catch (error) {
      debug_mode && console.log(error);
    }
    setIsPublishing(false);
    handleClose();
  };

  React.useEffect(() => {
    if (post) {
      if (post.tags?.length > 0) setTags(post.tags);
      setIsCommentsEnabled(post?.isCommentsEnabled);
    }
  }, [isNextClicked]);
  return (
    <div className="sm:px-5">
      <SuccessSnackBar
        handleClose={() => setIsPublishSuccess(false)}
        message={"Post published successfully!"}
        open={isPublishedSuccess}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isPublishPostModalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isPublishPostModalOpen}>
          <div className="sm:w-9/10 absolute top-1/2 left-1/2 w-2/5 -translate-x-1/2 -translate-y-1/2 transform bg-white md:w-2/3">
            <div className="absolute right-0 m-3 flex justify-end">
              <Button
                variant="text"
                style={{
                  borderRadius: 50,
                  textTransform: "none",
                  boxShadow: "none",
                  padding: 0,
                  minWidth: 0,
                }}
                onClick={handleClose}
              >
                <CloseIcon style={{ color: "#757575", fontSize: 20 }} />
              </Button>
            </div>
            <div className="flex flex-col py-10 px-10 md:w-full sm:py-10 sm:px-5">
              <div className="w-full">
                <p className="items-center justify-center text-center text-[30px]  font-medium sm:text-[23px]">
                  Publish Story
                </p>
                {!isNextClicked ? (
                  <PublishAlert
                    setIsNextClicked={setIsNextClicked}
                    handleClose={handleClose}
                  />
                ) : (
                  <ConfirmPublishForm
                    handlePublish={handlePublish}
                    handleClose={handleClose}
                    tags={tags}
                    setTags={setTags}
                    isCommentsEnabled={isCommentsEnabled}
                    setIsCommentsEnabled={setIsCommentsEnabled}
                    isPublishing={isPublishing}
                  />
                )}
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

const PublishAlert = ({ setIsNextClicked, handleClose }) => {
  return (
    <div className="w-full items-center  justify-center text-center">
      <p
        className=" mt-3 text-[14px] text-[#757575] sm:text-[12px]"
        style={{ lineHeight: 1.6 }}
      >
        Publishing is a significant step, and once the post is made public, it
        can have a lasting impact. While you can always unpublish or edit the
        post later, it's important to consider the initial impression it
        creates. Take a moment to review your content and ensure it aligns with
        your intentions before making it public.
      </p>
      <div className="mt-10 flex justify-center space-x-7 sm:mt-5 sm:space-x-5">
        <Button
          variant="outlined"
          color="inherit"
          style={{
            borderRadius: 50,
            textTransform: "none",
            boxShadow: "none",
          }}
          onClick={handleClose}
        >
          <p className="sm:text-[13px]">Review</p>
        </Button>
        <Button
          variant="contained"
          color="error"
          style={{
            borderRadius: 50,
            textTransform: "none",
            boxShadow: "none",
            backgroundColor: "#2E7D32",
          }}
          onClick={() => setIsNextClicked(true)}
        >
          <p className="sm:text-[13px]">Next</p>
        </Button>
      </div>
    </div>
  );
};

const ConfirmPublishForm = ({
  handlePublish,
  handleClose,
  tags,
  setTags,
  isCommentsEnabled,
  setIsCommentsEnabled,
  isPublishing,
}) => {
  return (
    <div className="mt-10 w-full">
      <div className="w-full px-5 sm:px-0">
        <div className="mt-5 flex justify-center space-x-8 sm:space-x-6 xs:justify-start xs:space-x-5">
          <p className="flex items-center justify-center text-[15px] font-medium sm:text-[13px]">
            Add Tags:
          </p>
          <div className="w-2/5 md:w-1/2 sm:w-[120px]">
            <MultipleSelectCheckmarks
              tags={tags}
              setTags={setTags}
              className={"flex items-center justify-center"}
              isPublishing={isPublishing}
            />
            <p className="flex justify-end text-[12px] text-[#757575] sm:text-[10px]">{`${
              3 - tags?.length
            }/3`}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-center space-x-5 xs:justify-start">
          <p className="flex items-center justify-center text-[15px] font-medium sm:text-[13px]">
            Enable Comments:
          </p>
          <Switch
            disabled={isPublishing}
            checked={isCommentsEnabled}
            onChange={() => {
              setIsCommentsEnabled(!isCommentsEnabled);
            }}
            inputProps={{ "aria-label": "controlled" }}
            size="medium"
            color="success"
          />
        </div>
      </div>
      <div className="mt-[40px] flex justify-center space-x-7 sm:mt-5 sm:space-x-5">
        <Button
          variant="outlined"
          color="inherit"
          style={{
            borderRadius: 50,
            textTransform: "none",
            boxShadow: "none",
          }}
          onClick={handleClose}
          disabled={isPublishing}
        >
          <p className="sm:text-[13px]">Cancel</p>
        </Button>
        <Button
          variant="contained"
          color="error"
          style={{
            borderRadius: 50,
            textTransform: "none",
            boxShadow: "none",
            backgroundColor: "#2E7D32",
            opacity: isPublishing ? 0.5 : 1,
            cursor: isPublishing ? "default" : "pointer",
          }}
          onClick={handlePublish}
        >
          <p className="sm:text-[13px]">
            {isPublishing ? "Publishing" : "Publish"}
          </p>
        </Button>
      </div>
    </div>
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "fit-content",
    },
  },
};
function MultipleSelectCheckmarks({ tags, setTags, isPublishing, ...props }) {
  const handleChange = (event) => {
    if (event.target.value.length > 3) {
      return;
    }
    const {
      target: { value },
    } = event;
    setTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div className={twMerge("", props.className)}>
      <FormControl sx={{ m: 0, width: "100%" }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          disabled={isPublishing}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={tags}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => {
            return (
              <div className="flex flex-wrap">
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={_.capitalize(value)}
                    style={{ margin: 2, padding: 0, height: 25 }}
                  />
                ))}
              </div>
            );
          }}
          MenuProps={MenuProps}
        >
          {tagsArray.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={{ height: "40px", width: "fit-content" }}
            >
              <Checkbox checked={tags?.indexOf(name) > -1} />
              <ListItemText primary={_.capitalize(name)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
export default PublishPostModal;
