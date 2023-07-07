import SEO from "@/components/primary/SEO";
import SimpleIconZoom from "@/components/primary/SimpleIconZoom";
import { LinearProgress } from "@mui/material";

const SplashScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center ">
      <SEO options={{ title: "Loading..." }} />
      <div className="w-[100px] text-center overflow-hidden">
        <SimpleIconZoom />
        <LinearProgress color="inherit" style={{marginTop: '10px'}}/>
      </div>
      
    </div>
  );
};

export default SplashScreen;
