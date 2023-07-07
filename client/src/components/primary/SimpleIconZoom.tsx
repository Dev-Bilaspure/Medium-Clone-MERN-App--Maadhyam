import { Box, Zoom } from "@mui/material";
import { useEffect, useState } from "react";

const SimpleIconZoom = () => {
  // const [checked, setChecked] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setChecked(!checked);
  //   }, 500);
  // }, [checked]);
  return (
    <Box>
      {/* <Zoom in={checked}> */}
        <div>
          <i className="fab fa-medium rotate-180 transform text-[45px] text-black sm:text-[36px]"></i>
        </div>
      {/* </Zoom> */}
    </Box>
  );
};


export default SimpleIconZoom;