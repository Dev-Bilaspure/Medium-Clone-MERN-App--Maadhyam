import { LinearProgress } from "@mui/material";
import React from "react";

const FetchingDataLoader = () => {
  return (
    <div className="flex w-20 flex-col space-y-3 text-center sm:w-[55px] sm:space-y-2">
      <i className="fab fa-medium rotate-180 transform text-[35px] text-black sm:text-[28px]"></i>
      <LinearProgress color="inherit" />
    </div>
  );
};

export default FetchingDataLoader;
