// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClhBtjx1_WGLSBuEkcBQ0cNRwywxr_UcU",
  authDomain: "instagram-clone-d409b.firebaseapp.com",
  projectId: "instagram-clone-d409b",
  storageBucket: "instagram-clone-d409b.appspot.com",
  messagingSenderId: "785879437603",
  appId: "1:785879437603:web:99b30596b6bfce65a47c96",
  measurementId: "G-TK19Y76Z00"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, serverTimestamp };
