// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEhrzMNsceQBsbHPqJnjAAGDL-NZGwt9U",
  authDomain: "stayalivemerch.firebaseapp.com",
  projectId: "stayalivemerch",
  storageBucket: "stayalivemerch.firebasestorage.app",
  messagingSenderId: "371521010883",
  appId: "1:371521010883:web:598adf1a3e70422d0e7676",
  measurementId: "G-BG758GJ5QE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Para Firestore
export const storage = getStorage(app); // Para subir imágenes
export const auth = getAuth(app); // Para autenticación
// const analytics = getAnalytics(app);
