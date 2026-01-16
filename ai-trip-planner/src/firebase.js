// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAUpr2pOIKFBxUUOAjiVkrBpaAgqKs17TQ",
  authDomain: "well-being-u.firebaseapp.com",
  databaseURL: "https://well-being-u-default-rtdb.firebaseio.com",
  projectId: "well-being-u",
  storageBucket: "well-being-u.firebasestorage.app",
  messagingSenderId: "392014929017",
  appId: "1:392014929017:web:6ac118d016746afbc848a8",
  measurementId: "G-4YR798W0LZ"
};

// ✅ Initialize Firebase FIRST
const app = initializeApp(firebaseConfig);

// ✅ Realtime Database instance
export const db = getDatabase(app);
