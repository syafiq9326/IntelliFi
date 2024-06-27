// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getStorage, ref } from 'firebase/storage'; // Add this import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
//left blank (need fil urs)
  // apiKey: "",
  // authDomain: 
  // projectId: "
  // storageBucket:
  // messagingSenderId: 
  // appId: 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const storageRef = ref(storage);
console.log(storage); // Check if storage object is available


//adding in collections to the database
// const notesCollection = collection(db, "notes")




export { app, auth , db, storage, storageRef};
