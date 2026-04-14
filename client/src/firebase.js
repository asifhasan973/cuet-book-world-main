import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfJUh0IMyY40Y-G1gzmseWIjzd5KO-7tY",
  authDomain: "cuet-book-world.firebaseapp.com",
  projectId: "cuet-book-world",
  storageBucket: "cuet-book-world.firebasestorage.app",
  messagingSenderId: "882121128276",
  appId: "1:882121128276:web:7a1bd11a3f7af87fab30c1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
