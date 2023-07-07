// import { storage } from "@/utils/firebaseConfig";
// import { v4 as uuidv4 } from "uuid";

import React, { useState } from "react";
// import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { uploadImage } from "@/utils/helperMethods";
import { debug_mode } from "@/debug-controller";

const TestingImageUpload = () => {
  const [imageUpload, setImageUpload] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageURL, setImageURL] = useState<string | undefined>("");

  return (
    <div className="flex justify-center">
      <div className="mx-auto mt-20 w-[300px] ">
        <input
          type="file"
          onChange={(e) => {
            const seletedImage = e.target.files?.[0];
            if (!seletedImage) return;
            setImageUpload(seletedImage);
          }}
        />
        <br />
        <button
          onClick={async () => {
            setIsProcessing(true);
            const response = await uploadImage({
              image: imageUpload,
              imageCategory: "PROFILE_PICTURE",
            });
            if(debug_mode) console.log(response);
            setIsProcessing(false);
            setImageUpload(null);
            setImageURL(response.imageURL);
          }}
          className="mt-[20px] rounded-lg bg-[#126EB8] p-[5px] px-[10px] text-[#FFFFFF]"
        >
          {isProcessing ? 'Uploading...' :  'Upload'}
        </button>
        <br />
        <div className="mt-5">
          <p>Image URL: {imageURL && `"${imageURL}"`}</p>
        </div>
      </div>
    </div>
  );
};

export default TestingImageUpload;
