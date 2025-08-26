import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDb6aQiAYPYX0d8tN4LiL3fV6UT_w-rpv8",
  authDomain: "smash-protocol.firebaseapp.com",
  projectId: "smash-protocol",
  storageBucket: "smash-protocol.firebasestorage.app",
  messagingSenderId: "956361704620",
  appId: "1:956361704620:web:daca183f4dfdd790b08b09",
  measurementId: "G-LYFRS8R38S"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;