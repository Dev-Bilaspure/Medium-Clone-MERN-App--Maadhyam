// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import dotenv from "dotenv";

// dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0x3j7aGufMVvwz-6xYiRk9DPS5LzlDdI",
  authDomain: "maadhyam-blogging-app.firebaseapp.com",
  projectId: "maadhyam-blogging-app",
  storageBucket: "maadhyam-blogging-app.appspot.com",
  messagingSenderId: "636993503487",
  appId: "1:636993503487:web:f996eb3fa32e674ac24cca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default app;
