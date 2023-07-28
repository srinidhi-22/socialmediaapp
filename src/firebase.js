import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLbysad6HYAXXEoJDY4neV2ofozVfWuMo",
  authDomain: "socialapp-dc9c8.firebaseapp.com",
  projectId: "socialapp-dc9c8",
  storageBucket: "socialapp-dc9c8.appspot.com",
  messagingSenderId: "1062289884244",
  appId: "1:1062289884244:web:badc5d2aa9b714f08059c1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const storage = getStorage();
export const db = getFirestore(app);
