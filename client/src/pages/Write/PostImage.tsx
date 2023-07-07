import { bannerImages } from "@/constants";
import bannerimage from "../../assets/images/bannerImg.jpg";
import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { twMerge } from "tailwind-merge";
import { debug_mode } from "@/debug-controller";
import { deleteImage, uploadImage } from "@/utils/helperMethods";

const buttonStyle = {
  borderRadius: 100,
  paddingLeft: 0,
  paddingRight: 0,
  height: 35,
  width: 35,
  minWidth: 0,
  paddingTop: 0,
  paddingBottom: 0,
};
const PostImage = ({ handleImageChange, image, setImage, page, ...props }) => {
  const [previewImage, setPreviewImage] = useState("");
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  useEffect(() => {
    if(page === 'write') 
      setPreviewImage('')
  }, [page])

  const handleOnChange = async (e) => {
    setIsUpdatingImage(true);
    const seletedImage = e.target.files?.[0];
    if (!seletedImage) return;
    setPreviewImage(URL.createObjectURL(seletedImage));
    if (image.length > 0) {
      try {
        const response = await deleteImage(image);
        debug_mode && console.log({ imageDeleteResponse: response });
      } catch (error) {
        debug_mode && console.log(error);
      }
    }
    try {
      const response = await uploadImage({
        image: seletedImage,
        imageCategory: "POST_IMAGE",
      });
      if (response.success) {
        setImage(response.imageURL);
        handleImageChange(response.imageURL);
      }
      debug_mode && console.log(response);
    } catch (error) {
      debug_mode && console.log(error);
    }
    setIsUpdatingImage(false);
  };

  return (
    <div
      className={twMerge(
        "mt-5 flex w-full flex-col space-y-5",
        props.className
      )}
    >
      {(previewImage || image.length > 0) && (
        <img
          src={previewImage || (image.length ? image : "")}
          className="w-full rounded-lg"
          style={{
            opacity: isUpdatingImage ? 0.5 : 1,
          }}
        />
      )}
      <div className="flex space-x-5 rounded-full ">
        <Button variant="outlined" color="inherit" style={buttonStyle}>
          <label htmlFor="profilePictureInput" className="cursor-pointer">
            <input
              type="file"
              onChange={handleOnChange}
              className="hidden"
              id="profilePictureInput"
              accept=".png, .jpg, .jpeg, .gif"
            />
            {!(image.length || previewImage) ? (
              <Tooltip title="Add Image" placement="bottom">
                <AddIcon color="inherit" />
              </Tooltip>
            ) : (
              <Tooltip title="Change Image">
                <CachedOutlinedIcon color="inherit" />
              </Tooltip>
            )}
          </label>
        </Button>
        {(previewImage || image.length > 0) && (
          <Button
            variant="outlined"
            color="inherit"
            style={buttonStyle}
            onClick={async () => {
              setIsUpdatingImage(true);
              setPreviewImage("");
              if (image.length) {
                try {
                  const response = await deleteImage(image);
                  if (response.success) {
                    setImage("");
                    handleImageChange("");
                  }
                  debug_mode && console.log(response);
                } catch (error) {
                  debug_mode && console.log(error);
                }
              }
              setIsUpdatingImage(false);
            }}
          >
            <Tooltip title="Delete Image" placement="bottom-start">
              <ClearOutlinedIcon color="inherit" style={{ fontSize: 27 }} />
            </Tooltip>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostImage;
