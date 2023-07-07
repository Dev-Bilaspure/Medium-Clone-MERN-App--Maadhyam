import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { firstLastNameSchema } from "@/utils/schemas";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const FirstNameEdit = (props) => {
  const {
    data: { authenticatedUser },
    actions: {
      user: { updateUser },
    },
  } = useStore();

  const [editFirstName, setEditFirstName] = useState<Boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [submitError, setSubmitError] = useState<boolean>(false);

  useEffect(() => {
    setFirstName(authenticatedUser?.firstName);
  }, [authenticatedUser]);

  const handleSubmit = async () => {
    if (isSubmitting || !editFirstName) return;
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      firstLastNameSchema.parse(firstName);
    } catch (error: any) {
      setFieldErrors(error);
      debug_mode && console.log(error);
      setIsSubmitting(false);
      return;
    }

    const response = await updateUser({ firstName });
    if (!response.success) {
      setIsSubmitting(false);
      setSubmitError(true);
      return;
    }
    setIsSubmitting(false);
    setEditFirstName(false);
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
        First Name
      </Typography>
      <div className="flex w-full flex-row space-x-20 sm:flex-col sm:space-y-3 sm:space-x-0">
        <input
          type="text"
          disabled={!editFirstName || isSubmitting}
          className={`overflow-wrap-break-word w-full border-b border-[#E6E6E6] bg-white pb-1  outline-none focus:outline-none ${
            editFirstName && "border-black"
          } text-[14px]`}
          placeholder="First name"
          onChange={(e) => {
            if (isSubmitting || !editFirstName) return;
            setFieldErrors(null);
            setFirstName(e.target.value);
          }}
          value={firstName}
          maxLength={20}
        />
        <div className="sm:flex sm:justify-end">
          {!editFirstName ? (
            <Button
              variant="outlined"
              color="inherit"
              style={{ textTransform: "none", borderRadius: 20 }}
              onClick={() => setEditFirstName(true)}
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
                disabled={
                  isSubmitting ||
                  (authenticatedUser &&
                    firstName === authenticatedUser.firstName)
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
                variant="outlined"
                color="inherit"
                style={{ textTransform: "none", borderRadius: 20 }}
                onClick={() => {
                  if (isSubmitting) return;
                  setFirstName(authenticatedUser.firstName);
                  setEditFirstName(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[10px] sm:mt-[5px]">
        <Typography
          style={{
            width: "100%",
            fontSize: 13,
            color: "rgb(59, 59, 59)",
            marginBottom: 20,
          }}
        >
          Your first name appears on your{" "}
          <Link
            style={{ color: "inherit", textDecoration: "underline" }}
            to="/profile"
          >
            Profile
          </Link>{" "}
          page, as your byline, and in your responses.
          <div
            style={{
              color: fieldErrors ? "rgb(244,66,55)" : "rgb(59, 59, 59)",
              marginTop: 5,
            }}
          >
            It is a required field. Can only contain english letters. Max 20
            character.
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

export default FirstNameEdit;
