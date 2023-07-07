import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { bioSchema } from "@/utils/schemas";
import {
  Button,
  CircularProgress,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const BioEdit = (props) => {
  const {
    data: { authenticatedUser },
    actions: {
      user: { updateUser },
    },
  } = useStore();

  const [editBio, setEditBio] = useState<Boolean>(false);
  const [bio, setBio] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);

  useEffect(() => {
    setBio(authenticatedUser?.bio || "");
  }, [authenticatedUser]);

  const handleSubmit = async () => {
    if (isSubmitting || !editBio) return;
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      bioSchema.parse(bio);
    } catch (error: any) {
      setFieldErrors(error);
      debug_mode && console.log(error);
      setIsSubmitting(false);
      return;
    }

    const response = await updateUser({ bio });
    if (!response.success) {
      setIsSubmitting(false);
      setSubmitError(true);
      return;
    }
    setIsSubmitting(false);
    setEditBio(false);
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
        Short Bio
      </Typography>
      <div className="flex w-full space-x-20 sm:flex-col sm:space-y-3 sm:space-x-0">
        <div className="w-full">
          <TextareaAutosize
            disabled={!editBio || isSubmitting}
            value={bio}
            className={`overflow-wrap-break-word w-full border-b border-[#E6E6E6] bg-white pb-2  outline-none focus:outline-none ${
              editBio && "border-black"
            } text-[13px]`}
            placeholder="Short Bio"
            maxLength={160}
            onChange={(e) => {
              if (isSubmitting || !editBio) return;
              setFieldErrors(null);
              setBio(e.target.value);
            }}
          />
          <p className="text-right text-[12px] text-[#383838]">{`${bio.length}/160`}</p>
        </div>
        <div className="sm:flex sm:justify-end">
          {!editBio ? (
            <Button
              variant="outlined"
              color="inherit"
              style={{ textTransform: "none", borderRadius: 20 }}
              onClick={() => setEditBio(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex space-x-5">
              <Button
                type="submit"
                variant="outlined"
                color="success"
                style={{
                  textTransform: "none",
                  borderRadius: 20,
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
                disabled={
                  isSubmitting ||
                  (authenticatedUser && bio === authenticatedUser?.bio)
                }
                onClick={handleSubmit}
              >
                {!isSubmitting ? (
                  "Save"
                ) : (
                  <CircularProgress color="success" size={23} />
                )}
              </Button>
              <Button
                disabled={isSubmitting}
                variant="outlined"
                color="inherit"
                style={{ textTransform: "none", borderRadius: 20 }}
                onClick={() => {
                  if (isSubmitting) return;
                  setBio(authenticatedUser?.bio);
                  setEditBio(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[0px] sm:mt-[5px]">
        <Typography
          style={{
            width: "100%",
            fontSize: 13,
            color: "rgb(59, 59, 59)",
            marginBottom: 20,
          }}
        >
          Your short bio appears on your{" "}
          <Link
            style={{ color: "inherit", textDecoration: "underline" }}
            to="/profile"
          >
            Profile
          </Link>{" "}
          and next to your stories.
          <div
            style={{
              color: fieldErrors ? "rgb(244,66,55)" : "rgb(59, 59, 59)",
              marginTop: 5,
            }}
          >
            Max 160 characters.
          </div>
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

export default BioEdit;
