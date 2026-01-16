// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1QexAZ_Vz9stQxmKZp1wyoFleb5aX4UE",
  authDomain: "mobiilikehitysprojekti-c4c1c.firebaseapp.com",
  projectId: "mobiilikehitysprojekti-c4c1c",
  storageBucket: "mobiilikehitysprojekti-c4c1c.firebasestorage.app",
  messagingSenderId: "57653476975",
  appId: "1:57653476975:web:0cf2bd29dc3e45b076579a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);

/*
 WARN  [2026-01-16T09:16:44.583Z]  @firebase/auth: Auth (12.8.0): 
You are initializing Firebase Auth for React Native without providing
AsyncStorage. Auth state will default to memory persistence and will not
persist between sessions. In order to persist auth state, install the package
"@react-native-async-storage/async-storage" and provide it to
initializeAuth:

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
*/