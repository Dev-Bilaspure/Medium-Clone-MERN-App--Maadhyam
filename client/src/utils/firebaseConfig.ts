// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import dotenv from "dotenv";

// dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your_firebase_app_api_key",
  authDomain: "your_firebase_app_auth_domain",
  projectId: "your_firebase_project_id",
  storageBucket: "your_firebase_app_storage_bucket",
  messagingSenderId: "your_firebase_app_messaging_sender_id",
  appId: "your_fireabase_app_id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default app;
