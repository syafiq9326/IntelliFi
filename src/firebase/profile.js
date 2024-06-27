import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    setDoc,
  } from "firebase/firestore";
  import { db } from "./firebase"; // Adjust the import path as needed
  
  // Simplified for brevity
  export async function fetchProfile(userId, email) {
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("userId", "==", userId));
    
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Return the first matching profile data
        return querySnapshot.docs[0].data();
      } else {
        // No profile found, create one with default values
        const defaultProfile = {
          userId,
          email,
          name: " ",
          surname: " ",
          phone: " ",
          country: " ",
          picture: "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg",
        };
        await createProfile(defaultProfile);
        return defaultProfile; // Return the default profile
      }
    }
    
    export async function createProfile(profile) {
      const profilesRef = collection(db, "profiles");
      try {
        await addDoc(profilesRef, profile);
        console.log("Profile created successfully.");
      } catch (error) {
        console.error("Error creating profile:", error);
      }
    }
    
  
    export async function updateProfile(userId, profileData) {
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("userId", "==", userId));
      
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming the first document is the user's profile
          const profileDocRef = querySnapshot.docs[0].ref;
          await updateDoc(profileDocRef, profileData);
          console.log("Profile updated successfully.");
        } else {
          console.log("No profile found for the given userId, profile not updated.");
          // Optionally handle the case where no profile is found (e.g., create a new profile)
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }