// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZBAemiYHn-l11Wm5-C7yj1GRZHIQVJRo",
  authDomain: "exhibition-curation-platform.firebaseapp.com",
  projectId: "exhibition-curation-platform",
  storageBucket: "exhibition-curation-platform.firebasestorage.app",
  messagingSenderId: "276870702725",
  appId: "1:276870702725:web:24ee6b0a71547a8e9eabec",
  measurementId: "G-1MB8LW0EFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize Analytics if needed
// const analytics = getAnalytics(app);

export default app;
