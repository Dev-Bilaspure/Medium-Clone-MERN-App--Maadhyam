import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { passwordSchema, usernameSchema } from "@/utils/schemas";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const PasswordEdit = (props) => {
  const {
    data: { authenticatedUser },
    actions: {
      user: { updateUser },
    },
  } = useStore();
  const [editPassword, setEditPassword] = useState<Boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<boolean>(false);
  const [passwordResetSuccess, setPasswordResetSuccess] =
    useState<boolean>(false);

  const handleSubmit = async () => {
    if (isSubmitting || !editPassword) return;
    setIsSubmitting(true);
    setSubmitError(false);
    setConfirmPasswordError(false);
    setPasswordResetSuccess(false);

    try {
      passwordSchema.parse(newPassword);
    } catch (error: any) {
      setFieldErrors(error);
      debug_mode && console.log(error);
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(true);
      setIsSubmitting(false);
      return;
    }

    const response = await updateUser({ password: newPassword });
    if (!response.success) {
      setIsSubmitting(false);
      setSubmitError(true);
      return;
    }

    setPasswordResetSuccess(true);
    setIsSubmitting(false);
    setEditPassword(false);
    setNewPassword("");
    setConfirmPassword("");
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
        Reset Password
      </Typography>
      <div className="flex w-full flex-col space-y-3">
        <div className="flex w-full flex-col space-y-5">
          <div className="flex w-full space-x-3">
            <Typography
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "rgb(41,41,41)",
                marginTop: 5,
                width: 145,
              }}
            >
              New Password:
            </Typography>
            <input
              type="text"
              disabled={!editPassword || isSubmitting}
              className={`overflow-wrap-break-word w-full border-b border-[#E6E6E6] bg-white pb-1  outline-none focus:outline-none ${
                editPassword && "border-black"
              } text-[14px]`}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                if (isSubmitting || !editPassword) return;
                setFieldErrors(null);
                setNewPassword(e.target.value);
              }}
            />
          </div>
          <div className="mt-5 flex space-x-2">
            <Typography
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "rgb(41,41,41)",
                marginTop: 5,
              }}
            >
              Confirm Password:
            </Typography>
            <input
              type="text"
              disabled={!editPassword || isSubmitting}
              className={`overflow-wrap-break-word w-full border-b border-[#E6E6E6] bg-white pb-0  outline-none focus:outline-none ${
                editPassword && "border-black"
              } text-[14px]`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                if (isSubmitting || !editPassword) return;
                setFieldErrors(null);
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          {!editPassword ? (
            <Button
              variant="outlined"
              color="inherit"
              style={{ textTransform: "none", borderRadius: 20 }}
              onClick={() => setEditPassword(true)}
            >
              Reset Password
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
                disabled={isSubmitting || !newPassword}
                onClick={handleSubmit}
              >
                {!isSubmitting ? (
                  "Save Password"
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
                  setNewPassword("");
                  setConfirmPassword("");
                  setEditPassword(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="sm:mt-[5px]">
        <Typography
          style={{
            fontSize: 13,
            color: "rgb(59, 59, 59)",
            marginBottom: 20,
          }}
        >
          {passwordResetSuccess && (
            <div
              style={{
                color: "#2E7D32",
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              Password reset successfully.
            </div>
          )}
          <div
            style={{
              color: fieldErrors ? "rgb(244,66,55)" : "rgb(59, 59, 59)",
              marginTop: 5,
            }}
          >
            Min 6 characters with no space.
          </div>
          <div
            style={{
              color: confirmPasswordError
                ? "rgb(244,66,55)"
                : "rgb(59, 59, 59)",
              marginTop: 5,
            }}
          >
            New password should match confirm password.
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

export default PasswordEdit;
