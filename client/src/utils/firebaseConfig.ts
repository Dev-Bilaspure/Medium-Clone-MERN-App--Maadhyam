// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import dotenv from "dotenv";

// dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR FIREBASE API KEY",
  authDomain: "YOUR FIREBASE AUTH DOMAIN",
  projectId: "YOUR FIREBASE PROJECT ID",
  storageBucket: "YOUR FIREBASE STORAGE BUCKET",
  messagingSenderId: "YOUR FIREBASE MESSAGING SENDER ID",
  appId: "YOUR FIREBASE APP ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default app;
