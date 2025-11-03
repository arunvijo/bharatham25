// Your web app's Firebase configuration

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD80mP5PsBh4S54_XROolc2Ojxc95Jy4Vo",
  authDomain: "bharatham-8f3b2.firebaseapp.com",
  projectId: "bharatham-8f3b2",
  storageBucket: "bharatham-8f3b2.appspot.com",
  messagingSenderId: "980080057961",
  appId: "1:980080057961:web:858889406e79161f334cf8",
  measurementId: "G-6L3DQD986J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
