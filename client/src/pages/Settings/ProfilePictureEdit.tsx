import { defaultUserPic } from "@/constants";
import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { deleteImage, uploadImage } from "@/utils/helperMethods";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const ProfilePictureEdit = (props) => {
  const {
    data: { authenticatedUser },
    actions: {
      user: { updateUser },
    },
  } = useStore();
  const [editProfilePicture, setEditProfilePicture] = useState<boolean>(false);
  const [isCreatingURL, setIsCreatingURL] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState(defaultUserPic);

  useEffect(() => {
    setProfilePicture(authenticatedUser?.profilePicture);
  }, [authenticatedUser]);

  const handleImageChange = async (e) => {
    if (isSubmitting || !editProfilePicture) return;
    const seletedImage = e.target.files?.[0];
    if (!seletedImage) return;
    setPreviewImage(URL.createObjectURL(seletedImage));
    setImageBlob(seletedImage);
  };

  const handleSubmit = async () => {
    if (!imageBlob || isSubmitting || isCreatingURL || !editProfilePicture)
      return;
    setIsCreatingURL(true);
    setIsSubmitting(true);
    setSubmitError(false);

    await deleteImage(authenticatedUser.profilePicture);
    const response = await uploadImage({
      image: imageBlob,
      imageCategory: "PROFILE_PICTURE",
    });
    if (response.success) {
      const updateUserResponse = await updateUser({
        profilePicture: response.imageURL,
      });
      if (!updateUserResponse.success) {
        debug_mode && console.log({ updateUserResponse });
        setSubmitError(true);
        setIsCreatingURL(false);
        setIsSubmitting(false);
        return;
      }
    } else {
      debug_mode && console.log(response);
      setSubmitError(true);
      setIsCreatingURL(false);
      setIsSubmitting(false);
      return;
    }
    setIsCreatingURL(false);
    setIsSubmitting(false);
    setEditProfilePicture(false);
  };

  return (
    <div className={twMerge("w-full", props.className)}>
      <Typography
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "rgb(41,41,41)",
          marginBottom: 15,
        }}
      >
        Profile Picture
      </Typography>

      <div className="flex justify-between">
        <div>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            id="profilePictureInput"
            className="hidden"
            disabled={!editProfilePicture || isSubmitting || isCreatingURL}
            onChange={handleImageChange}
          />
          <label htmlFor="profilePictureInput">
            <div
              className={`w-fit rounded-full ${
                editProfilePicture && "cursor-pointer"
              }`}
            >
              <div
                className={`flex h-[100px] w-[100px] justify-center rounded-full bg-cover ${
                  editProfilePicture && "border-2 border-black"
                }`}
                style={{
                  backgroundImage: `url(${previewImage || profilePicture})`,
                  opacity: editProfilePicture ? 0.3 : 1,
                }}
              >
                {editProfilePicture && (
                  <div className="">
                    {isCreatingURL ? (
                      <CircularProgress
                        color="inherit"
                        className="mt-[29px] text-[30px]"
                      />
                    ) : (
                      <i className="fa-solid fa-camera mt-[35px] text-[30px] text-[#000000]"></i>
                    )}
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>

        <div>
          {!editProfilePicture ? (
            <Button
              variant="outlined"
              color="inherit"
              style={{ textTransform: "none", borderRadius: 20 }}
              onClick={() => setEditProfilePicture(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex space-x-5">
              <Button
                variant="outlined"
                color="success"
                style={{
                  textTransform: "none",
                  borderRadius: 20,
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
                onClick={handleSubmit}
                disabled={isSubmitting || isCreatingURL || !imageBlob}
              >
                {!isSubmitting ? (
                  "Save"
                ) : (
                  <CircularProgress color="success" size={23} />
                )}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                style={{ textTransform: "none", borderRadius: 20 }}
                onClick={() => {
                  if (isSubmitting || isCreatingURL) return;
                  setImageBlob(null);
                  setPreviewImage("");
                  setEditProfilePicture(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[20px]">
        <Typography
          style={{ width: "100%", fontSize: 13, color: "rgb(59, 59, 59)" }}
        >
          Your photo appears on your{" "}
          <Link
            style={{ color: "inherit", textDecoration: "underline" }}
            to="/profile"
          >
            Profile
          </Link>{" "}
          and with your stories across Maadhyam.
        </Typography>
        <Typography
          style={{
            paddingTop: 5,
            width: "100%",
            fontSize: 13,
            color: "rgb(59, 59, 59)",
            marginBottom: 30,
          }}
        >
          Recommended size: Square, at least 1000 pixels per side. File type:
          JPG, PNG or GIF.
          {submitError && (
            <div style={{ color: "rgb(244,66,55)", marginTop: 5 }}>
              Something went wrong. Please try again.
            </div>
          )}
        </Typography>
      </div>
    </div>
  );
};

export default ProfilePictureEdit;
