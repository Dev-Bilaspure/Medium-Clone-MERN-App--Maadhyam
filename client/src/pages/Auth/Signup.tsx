import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupSchema } from "@/utils/schemas";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import { AxiosError } from "axios";
import SEO from "@/components/primary/SEO";

const Signup = ({ setIsSubmittingForm, setSubmittionError }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<Boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<Boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const {
    actions: { auth: {signupUser} },
  } = useStore();

  const onSubmit = async (data) => {
    // Perform form submission logic here
    setConfirmPasswordError(false);
    setIsSubmittingForm(true);
    if (data.password !== data.confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }
    try {
      const response = await signupUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (debug_mode) console.log(response);

      if (response.success) {
        navigate("/");
      } else {
        setSubmittionError(response.message);
      }
      setIsSubmittingForm(false);
    } catch (error: any) {
      debug_mode && console.log(error);
      setSubmittionError(error.message);
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="mt-7 flex flex-col">
      <SEO options={{ title: "Signup" }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="firstName"
          label="First name"
          variant="standard"
          style={{ width: "100%", marginTop: 10 }}
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message?.toString()}
          required
        />
        <TextField
          id="lastName"
          label="Last name"
          variant="standard"
          style={{ width: "100%", marginTop: 20 }}
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message?.toString()}
          required
        />
        <TextField
          id="email"
          label="Email"
          variant="standard"
          style={{ width: "100%", marginTop: 20 }}
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
          required
        />
        <TextField
          label="Password"
          variant="standard"
          placeholder="password"
          {...register("password")}
          fullWidth
          style={{ marginTop: 20 }}
          type={showPassword ? "text" : "password"}
          InputProps={{
            // Toggle button code remains the same
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
          required
        />
        <TextField
          label="Confirm password"
          variant="standard"
          placeholder="Confirm password"
          {...register("confirmPassword")}
          fullWidth
          style={{ marginTop: 20 }}
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            // Toggle button code remains the same
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError && "Passwords do not match"}
          required
        />
        <Button
          type="submit"
          variant="contained"
          style={{
            color: "#FFFFFF",
            backgroundColor: "rgb(45, 45, 45)",
            borderRadius: 13,
            marginTop: 40,
            boxShadow: "none",
            width: "100%",
          }}
        >
          Signup
        </Button>
      </form>
      <div className="mt-[10px] flex justify-center">
        <Typography style={{ color: "black" }}>
          Already have an account?{" "}
          <span
            className="underline hover:cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default Signup;
