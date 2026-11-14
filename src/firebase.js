// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX1tlqzuAAnE9N5y0s0quWezKFOJIrsl4",
  authDomain: "keuangan-68e0d.firebaseapp.com",
  projectId: "keuangan-68e0d",
  storageBucket: "keuangan-68e0d.firebasestorage.app",
  messagingSenderId: "623320965511",
  appId: "1:623320965511:web:d6ed27b394c42602caf322",
  measurementId: "G-JGDYD1HGEE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const db = getFirestore(app);
