import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { GoogleUser } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyDlcS9oV71Y5Z1h91my_iaU3zI29KpFW-0",
  authDomain: "placement-readiness-5-day.firebaseapp.com",
  projectId: "placement-readiness-5-day",
  storageBucket: "placement-readiness-5-day.firebasestorage.app",
  messagingSenderId: "463380341823",
  appId: "1:463380341823:web:26fe148a5636df266e848a",
  measurementId: "G-D7WWZD39NE"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Single canonical Demo User
export const DEMO_USER: GoogleUser = {
  id: 'google-demo-user-777',
  name: 'Demo Student',
  email: 'demo.student@gmail.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+Student&background=6366f1&color=ffffff&bold=true',
  signedInAt: new Date().toISOString(),
};

/**
 * Sign in with official Google Firebase Popup
 */
export async function signInWithGoogleFirebase(): Promise<GoogleUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  return {
    id: fbUser.uid,
    name: fbUser.displayName || 'Google Learner',
    email: fbUser.email || 'learner@gmail.com',
    avatar: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'G')}&background=0ea5e9&color=ffffff`,
    signedInAt: new Date().toISOString(),
  };
}

/**
 * Sign out from Firebase
 */
export async function signOutFirebase(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn('Firebase signout note:', err);
  }
}
