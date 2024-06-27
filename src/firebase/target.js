import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";


export const createTarget= async (db, targetData) => {
    try {
        const docRef = await addDoc(collection(db, "targets"), targetData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding target:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};


export const setNewTarget = async (db, userId, updatedData) => {
    try {
        // Query for the document to update
        const q = query(
            collection(db, "targets"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update the existing document with the new data
            await updateDoc(doc(db, "targets", querySnapshot.docs[0].id), updatedData);
            console.log("target updated successfully!");
        }
    } catch (error) {
        console.error("Error updating target:", error);
        throw error;
    }
};

export const fetchOrCreateTarget = async (db, userId) => { 
    try {
        const targetsRef = collection(db, "targets");
        const q = query(targetsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Return the existing target data
            return querySnapshot.docs[0].data();
        } else {
            // No target found, create a new one with a default value of 0
            const newTargetData = { userId, targetValue: 0 };
            const docRef = await addDoc(targetsRef, newTargetData);
            console.log("New target initialised with ID:", docRef.id);
            return newTargetData;
        }
    } catch (error) {
        console.error("Error retrieving or creating target:", error);
        throw error;
    }
}
