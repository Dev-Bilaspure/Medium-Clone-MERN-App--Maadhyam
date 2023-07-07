import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeletePostModal from "@/components/secondary/DeletePostModal";
import SuccessSnackBar from "@/components/secondary/SuccessSnackBar";
import ErrorSnackBar from "@/components/secondary/ErrorSnackBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import PopoverMoreIcon from "./PopoverMoreIcon";
import { Button, Tooltip } from "@mui/material";
import PublishPostModal from "./PublishPostModal";


const BlogOptionsMenu = ({ postId, ...props }) => {
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const {data: {authenticatedUser}, actions: {post: {unPublishPost}}} = useStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishPostModalOpen, setIsPublishPostModalOpen] = useState(false);

  const navigate = useNavigate();
  const {pathname} = useLocation();

  const [isUnpublishPostSuccess, setIsUnpublishSuccess] = useState(false);
  const [isUnpublishPostError, setIsUnpublishError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const handleUnpublish = async () => {
    if(!authenticatedUser) return;
    try {
      const response = await unPublishPost(postId);
      if(response.success) {
        setIsUnpublishSuccess(true);
        navigate('/me/mystories/drafts')
      } else {
        setIsUnpublishError(true);
      }
      debug_mode && console.log(response);
    } catch (error) {
      debug_mode && console.log(error);
    }
  }

  const handleEdit = async() => {
    if(!authenticatedUser) return;
    try {
      const response = await unPublishPost(postId);
      if(response.success) {
        navigate(`/edit/${postId}`)
      } else {
        setIsSomethingWentWrong(true);
      }
      debug_mode && console.log(response);
    } catch (error) {
      debug_mode && console.log(error);
    }
  }
  return (
    <div>
      <Tooltip title="more" placement="top">
      <div>
      <SuccessSnackBar open={isUnpublishPostSuccess} handleClose={() => setIsUnpublishSuccess(false)} message={"Post unpublished successfully!"}/>
      <ErrorSnackBar open={isUnpublishPostError} handleClose={() => setIsUnpublishError(false)} message={"Error unpublishing post."}/>
      <ErrorSnackBar open={isSomethingWentWrong} handleClose={() => setIsSomethingWentWrong(false)} message={"Something went wrong."}/>
      {props?.setPosts ? <DeletePostModal
        isDeletePostModalOpen={isDeletePostModalOpen}
        setIsDeletePostModalOpen={setIsDeletePostModalOpen}
        postId={postId}
        setPosts={props.setPosts}
      /> : <DeletePostModal
      isDeletePostModalOpen={isDeletePostModalOpen}
      setIsDeletePostModalOpen={setIsDeletePostModalOpen}
      postId={postId} />
      }
      {(pathname.split('/')[3] === 'drafts' && props.post) && <PublishPostModal isPublishPostModalOpen={isPublishPostModalOpen} isPublishing={isPublishing} setIsPublishing={setIsPublishing} post={props.post} postId={postId} setIsPublishPostModalOpen={setIsPublishPostModalOpen}/>}
      <PopoverMoreIcon
        element={
          <div className="flex flex-col  py-2 pt-1">
            <div className="flex justify-center border-b border-[#E6E6E6] py-2 px-5">
              <Button
                variant="text"
                color="error"
                style={{ textTransform: "none", padding: 0 }}
                onClick={() => setIsDeletePostModalOpen(true)}
              >
                Delete
              </Button>
            </div>
            <div className={`flex justify-center border-b border-[#E6E6E6] py-1 px-5 pt-2`}>
              <Button
                variant="text"
                color="inherit"
                style={{ textTransform: "none", padding: 0 }}
                onClick={handleEdit}
              >
                Edit
              </Button>
            </div>
            {(pathname.split('/')[3] !== 'drafts') ? <div className="flex justify-center py-1 px-5 pt-2">
              <Button
                variant="text"
                color="inherit"
                style={{ textTransform: "none", padding: 0 }}
                onClick={handleUnpublish}
              >
                Unpublish
              </Button>
            </div> : <div className="flex justify-center py-1 px-5 pt-2">
              <Button
                variant="text"
                color="inherit"
                style={{ textTransform: "none", padding: 0 }}
                onClick={() => setIsPublishPostModalOpen(true)}
              >
                Publish
              </Button>
            </div>}
          </div>
        }
        buttonElement={
          <MoreHorizIcon color="inherit" style={{ fontSize: 23 }} />
        }
      />
      </div>
      </Tooltip>
    </div>
  );
};

export default BlogOptionsMenu;