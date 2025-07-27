import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    signInAnonymously,
    signInWithCustomToken
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    addDoc, 
    collection, 
    query, 
    onSnapshot 
} from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined' 
    ? JSON.parse((window as any).__firebase_config) 
    : {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = typeof (window as any).__app_id !== 'undefined' 
    ? (window as any).__app_id 
    : 'default-app-id';

export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInAnonymously,
    signInWithCustomToken,
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    query,
    onSnapshot
};