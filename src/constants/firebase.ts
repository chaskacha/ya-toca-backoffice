// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCq76pyf2WjrwLBSqlVkBzDbPvxtPee6Mg",
    authDomain: "ya-toca-v1.firebaseapp.com",
    projectId: "ya-toca-v1",
    storageBucket: "ya-toca-v1.firebasestorage.app",
    messagingSenderId: "99585901129",
    appId: "1:99585901129:web:345f0e476bcdfe50bbf598"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Get a Firestore instance
export const db: Firestore = getFirestore(app);