import {
  Box,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BigLogo from "../../components/primary/BigLogo";
import Login from "./Login";
import Signup from "./Signup";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

const Authentication = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState<Boolean>(false);
  const [submittionError, setSubmittionError] = useState<String>("");
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const navigate = useNavigate();

  const {data: {authenticatedUser}} = useStore();

  const AntTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      backgroundColor: "#000000",
      height: 1,
    },
  });
  // for styling signin tab
  const AntTab1 = styled((props) => <Tab disableRipple {...props} />)(() => ({
    textTransform: "none",
    fontSize: 16,
    color: value === 0 ? "#000000" : "rgb(97,97,97)",
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
    paddingBottom: 5,
  }));

  // for styling signup tab
  const AntTab2 = styled((props) => <Tab disableRipple {...props} />)(() => ({
    textTransform: "none",
    fontSize: 16,
    color: value === 1 ? "#000000" : "rgb(97,97,97)",
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
    paddingBottom: 5,
  }));

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") setValue(0);
    else if (location.pathname === "/signup") setValue(1);
  }, [location.pathname]);

  return (
    authenticatedUser ? <Navigate to="/" /> : 
    <div className="flex min-h-screen justify-center bg-[#F5F3F2] pb-20 sm:px-5">
      <div className="mt-20 h-fit w-[400px] bg-white">
        <div className="px-[25px] py-[30px] pb-5">
          <div className="flex w-full justify-center">
            <BigLogo
              className={"w-[250px] border-b border-black pb-2 text-[27px]"}
            />
          </div>

          <div className="mt-3 flex w-full justify-center">
            <AntTabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              style={{ width: "100%" }}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
            >
              <AntTab1 label="Login" onClick={() => navigate("/login")} />
              <AntTab2 label="Sign Up" onClick={() => navigate("/signup")} />
            </AntTabs>
          </div>
          {value === 0 ? (
            <Login
              setIsSubmittingForm={setIsSubmittingForm}
              setSubmittionError={setSubmittionError}
            />
          ) : (
            <Signup
              setIsSubmittingForm={setIsSubmittingForm}
              setSubmittionError={setSubmittionError}
            />
          )}
          {submittionError !== "" && (
            <div className="mt-4 flex w-full justify-center">
              <p className="text-[13px] text-[#D32F2F]">{submittionError}</p>
            </div>
          )}
        </div>
        {isSubmittingForm && <LinearProgress color="inherit" />}
      </div>
    </div>
  );
};

export default Authentication;
