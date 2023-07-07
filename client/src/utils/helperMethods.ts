import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "@firebase/storage";
import { storage } from "@/utils/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { debug_mode } from "@/debug-controller";
import mongoose from "mongoose";

export const uploadImage = async ({
  image,
  imageCategory,
}: {
  image: Blob | null;
  imageCategory: "PROFILE_PICTURE" | "POST_IMAGE";
}): Promise<{ success: boolean; imageURL?: string; error?: any }> => {
  if (image === null) return { success: false, error: "image is set to null" };

  if (image.type !== "image/jpeg" && image.type !== "image/png" && image.type !== "image/jpg" && image.type !== "image/gif")
    return { success: false, error: "File type is not jpeg or png" };

  if (image.size > 2097152)
    return { success: false, error: "Image size is greater than 2MB" };

  const folderName =
    imageCategory === "PROFILE_PICTURE" ? "profilePictures" : "postImages";

  const imageRef = ref(storage, `${folderName}/${image?.name + uuidv4()}`);

  try {
    const snapshot = await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(snapshot.ref);
    if (debug_mode) {
      debug_mode && console.log("File available at", imageURL);
    }
    return { success: true, imageURL };
  } catch (error) {
    debug_mode && console.log({ success: false, error });
    return { success: false, error };
  }
};

export const deleteImage = async (
  imageURL: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    if (imageURL === "") return { success: false, error: "imageURL is empty" };
    const storageRef = ref(storage, imageURL);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    debug_mode && console.log({ success: false, error });
    return { success: false, error };
  }
};


export function getTimeAgo(timestamp) {
  const date: any = new Date(timestamp);
  const now: any = new Date();

  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
}

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}


export function convertNumberToShortFormat(number) {
  if(!number) return 0;
  const suffixes = {
    B: 1e9,
    M: 1e6,
    K: 1e3
  };

  for (const suffix in suffixes) {
    if (Math.abs(number) >= suffixes[suffix]) {
      const convertedNumber = (number / suffixes[suffix]).toFixed(1).replace('.0', '');
      return convertedNumber + suffix;
    }
  }

  return number.toString();
}