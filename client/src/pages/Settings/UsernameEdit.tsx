import { debug_mode } from "@/debug-controller";
import { useStore } from "@/store/useStore";
import { usernameSchema } from "@/utils/schemas";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const UsernameEdit = (props) => {
  const {
    data: { authenticatedUser },
    actions: {
      user: { updateUser },
      auth: { checkUsernameAvailability },
    },
  } = useStore();
  const [editUsername, setEditUsername] = useState<Boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [isCheckingAvailability, setIsCheckingAvailability] =
    useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedUser) {
      navigate("/");
      return;
    }
    setUsername(authenticatedUser?.username);
  }, [authenticatedUser]);

  const handleSubmit = async () => {
    if (
      isSubmitting ||
      !editUsername ||
      fieldErrors ||
      isCheckingAvailability ||
      !isUsernameAvailable ||
      username === authenticatedUser.username
    )
      return;
    setIsSubmitting(true);
    setSubmitError(false);

    if (!isUsernameAvailable) return;

    try {
      usernameSchema.parse(username);
    } catch (error: any) {
      setFieldErrors(error);
      debug_mode && console.log(error);
      setIsSubmitting(false);
      return;
    }

    const response = await updateUser({ username });
    if (!response.success) {
      setIsSubmitting(false);
      setSubmitError(true);
      return;
    }

    setIsSubmitting(false);
    setEditUsername(false);
  };

  const handleOnChange = async (e) => {
    if (isSubmitting || !editUsername) return;
    setFieldErrors(null);
    try {
      usernameSchema.parse(e.target.value);
    } catch (error: any) {
      setFieldErrors(error);
      debug_mode && console.log(error);
      setIsSubmitting(false);
    }
    setUsername(e.target.value);

    if (!fieldErrors) {
      if (e.target.value.length < 3) return;
      // console.log({ username: e.target.value })
      setIsCheckingAvailability(true);
      const response = await checkUsernameAvailability(e.target.value);
      if (response.success) {
        if (e.target.value !== authenticatedUser.username)
          setIsUsernameAvailable(response.isAvailable || false);
      } else {
        setSubmitError(true);
      }
      setIsCheckingAvailability(false);
      // console.log(response);
    }
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
        Username & URL
      </Typography>
      <div className="flex w-full justify-between space-x-20 sm:flex-col sm:space-y-3 sm:space-x-0">
        <div className="flex w-full flex-col space-y-5">
          <div className="flex w-full space-x-5">
            <Typography
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "rgb(41,41,41)",
                marginTop: 5,
              }}
            >
              Username:
            </Typography>
            <div className="flex w-full">
              <div className="w-full">
                <input
                  type="text"
                  disabled={!editUsername || isSubmitting}
                  className={`overflow-wrap-break-word w-full border-b border-[#E6E6E6] bg-white pb-1  outline-none focus:outline-none ${
                    editUsername && "border-black"
                  } text-[14px]`}
                  placeholder="Username"
                  value={username}
                  onChange={handleOnChange}
                  spellCheck={false}
                  onPaste={(e) => e.preventDefault()}
                />
                {!isUsernameAvailable && (
                  <p className="mt-[3px] text-[10px] text-[#f44336]">
                    Username not available
                  </p>
                )}
              </div>
              {isCheckingAvailability && (
                <CircularProgress color="inherit" size={18} />
              )}
            </div>
          </div>
          <div className="mt-5 flex space-x-5">
            <Typography
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "rgb(41,41,41)",
                marginTop: 5,
              }}
            >
              URL:
            </Typography>
            <input
              type="text"
              disabled={true}
              value={`${window.location.origin}/${username}`}
              className={`overflow-wrap-break-word w-full border-b border-[#E6E6E6] bg-white pb-0  text-[14px] outline-none focus:outline-none`}
              placeholder="Username"
            />
          </div>
        </div>
        <div className="sm:flex sm:justify-end">
          {!editUsername ? (
            <Button
              variant="outlined"
              color="inherit"
              style={{ textTransform: "none", borderRadius: 20 }}
              onClick={() => setEditUsername(true)}
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
                    username === authenticatedUser.username) ||
                  !isUsernameAvailable ||
                  fieldErrors
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
                  setUsername(authenticatedUser.username);
                  setIsUsernameAvailable(true);
                  setIsCheckingAvailability(false);
                  setSubmitError(false);
                  setEditUsername(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[18px] sm:mt-[5px]">
        <Typography
          style={{
            fontSize: 13,
            color: "rgb(59, 59, 59)",
            marginBottom: 20,
          }}
        >
          Your username is your address on Maadhyam.
          <div
            style={{
              color: fieldErrors ? "rgb(244,66,55)" : "rgb(59, 59, 59)",
              marginTop: 5,
            }}
          >
            It is required field. Min 3 characters with no space.
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

export default UsernameEdit;
