import React, { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/utils/schemas";
import { useStore } from "@/store/useStore";
import { debug_mode } from "@/debug-controller";
import SEO from "@/components/primary/SEO";

const Login = ({ setIsSubmittingForm, setSubmittionError }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const {
    actions: { auth: {loginUser} },
  } = useStore();

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (debug_mode) console.log(response);

      if(response.success) {
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
      <SEO options={{ title: "Login" }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="email"
          label="Email"
          variant="standard"
          style={{ width: "100%", marginTop: 10 }}
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
          required
        />
        <TextField
          id="password"
          label="Password"
          variant="standard"
          type={showPassword ? "text" : "password"}
          style={{ width: "100%", marginTop: 20 }}
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
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
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
          Login
        </Button>
      </form>
      <div className="mt-[10px] flex justify-center">
        <Typography style={{ color: "black" }}>
          Don't have an account?{" "}
          <span
            className="underline hover:cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default Login;
