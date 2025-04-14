// Replace with your actual config from Firebase Console
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCKz-4nOXGq4KE3tmSqWinQeTp1pT35nP4",
  authDomain: "once-upon-us.firebaseapp.com",
  projectId: "once-upon-us",
  storageBucket: "once-upon-us.firebasestorage.app",
  messagingSenderId: "569211551576",
  appId: "1:569211551576:web:6e1fca2f75a6f5fbf2af2d",
  measurementId: "G-7GYTZ6TB9V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
