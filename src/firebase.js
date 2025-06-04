// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8qu-rfyRVIud9uY8CJJzVI4VqfUHZn3Q",
  authDomain: "lep-intake.firebaseapp.com",
  projectId: "lep-intake",
  storageBucket: "lep-intake.firebasestorage.app",
  messagingSenderId: "893852765931",
  appId: "1:893852765931:web:65788c4bf56e69068a78ae",
  measurementId: "G-J5MEDNVCMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export Firestore so your form can use it
export { db };