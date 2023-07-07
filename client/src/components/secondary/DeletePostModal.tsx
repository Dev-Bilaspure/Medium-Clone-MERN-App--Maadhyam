import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import SuccessSnackBar from "./SuccessSnackBar";
import ErrorSnackBar from "./ErrorSnackBar";
const DeletePostModal = ({
  isDeletePostModalOpen,
  setIsDeletePostModalOpen,
  postId,
  ...props
}) => {
  const [openSuccessSnackBar, setSuccessSnackBar] = React.useState(false);
  const [errorSnackBar, setErrorSnackBar] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleClose = () => setIsDeletePostModalOpen(false);
  const {data: {authenticatedUser}, actions: {post: {deletePost}}} = useStore();
  const handleDelete = async() => {
    if(!authenticatedUser || isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await deletePost(postId);
      if(response.success) {
        setSuccessSnackBar(true);
        setIsDeletePostModalOpen(false);
        if(props?.setPosts)
          props.setPosts(prev => prev.filter(post => post._id !== postId));
      } else {
        setErrorSnackBar(true);
      }
      debug_mode && console.log(response);
    } catch(error) {
      debug_mode && console.log(error);
    } finally {
      setIsProcessing(false);
    }
  }
  return (
    <div className="sm:px-5">
      <SuccessSnackBar open={openSuccessSnackBar} handleClose={() => setSuccessSnackBar(false)} message={"Post deleted successfully!"}/>
      <ErrorSnackBar open={errorSnackBar} handleClose={() => setErrorSnackBar(false)} message={"Error deleting post!"}/>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isDeletePostModalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isDeletePostModalOpen}>
          <div className="absolute top-1/2 left-1/2 w-2/5 md:w-2/3 sm:w-9/10 -translate-x-1/2 -translate-y-1/2 transform bg-white ">
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
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center md:w-full sm:py-10 sm:px-5">
              <p className="text-[30px] font-medium sm:text-[25px]">
                Delete Story
              </p>
              <p className=" mt-3 text-[14px] text-[#757575] sm:text-[13px]">
                Deletion is not reversible, and the story will be completely
                deleted. If you do not want to delete, you can{" "}
                <span className="font-medium">unpublish the story</span>.
              </p>
              <div className="mt-10 flex space-x-7 sm:mt-5">
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
                  <p className="sm:text-[13px]">Cancel</p>
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  style={{
                    borderRadius: 50,
                    textTransform: "none",
                    boxShadow: "none",
                    backgroundColor: "#C94A4A",
                    opacity: isProcessing ? 0.5 : 1,
                  }}
                  onClick={handleDelete}
                  disabled={isProcessing}
                >
                  <p className="sm:text-[13px] text-[#ffffff]">{isProcessing ? 'Deleting' : 'Delete'}</p>
                </Button>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default DeletePostModal;
