import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { firstLastNameSchema } from "@/utils/schemas";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const LastNameEdit = (props) => {
  const {
    data: { authenticatedUser },
    actions: {
      user: { updateUser },
    },
  } = useStore();
  const [editLastName, setEditLastName] = useState<Boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<boolean>(false);

  useEffect(() => {
    setLastName(authenticatedUser?.lastName);
  }, [authenticatedUser]);

  const handleSubmit = async () => {
    if (isSubmitting || !editLastName) return;
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      firstLastNameSchema.parse(lastName);
    } catch (error: any) {
      setFieldErrors(error);
      debug_mode && console.log(error);
      setIsSubmitting(false);
      return;
    }

    const response = await updateUser({ lastName });
    if (!response.success) {
      setIsSubmitting(false);
      setSubmitError(true);
      return;
    }
    setIsSubmitting(false);
    setEditLastName(false);
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
        Last Name
      </Typography>
      <div className="flex w-full space-x-20 sm:flex-col sm:space-y-3 sm:space-x-0">
        <input
          type="text"
          disabled={!editLastName || isSubmitting}
          className={`overflow-wrap-break-word w-full border-b border-[#E6E6E6] bg-white pb-1 outline-none focus:outline-none ${
            editLastName && "border-black"
          } text-[14px]`}
          placeholder="Last name"
          onChange={(e) => {
            if (isSubmitting || !editLastName) return;
            setFieldErrors(null);
            setLastName(e.target.value);
          }}
          value={lastName}
          maxLength={20}
        />
        <div className="sm:flex sm:justify-end">
          {!editLastName ? (
            <Button
              variant="outlined"
              color="inherit"
              style={{ textTransform: "none", borderRadius: 20 }}
              onClick={() => setEditLastName(true)}
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
                  (authenticatedUser &&
                    lastName === authenticatedUser?.lastName)
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
                  setLastName(authenticatedUser?.lastName);
                  setEditLastName(false);
                }}
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
          Your last name appears on your{" "}
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

export default LastNameEdit;
