import { collection, doc, addDoc, getDocs, updateDoc, query, where, deleteDoc } from "firebase/firestore";


export const AddGoal= async (db, goalData) => {
    try {
        const docRef = await addDoc(collection(db, "stockGoal"), goalData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding goal:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};

export const EditGoal = async (db, userId, updatedData) => {
    try {
        // Query for the document to update
        const q = query(collection(db, "stockGoal"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update the existing document with the new data
            await updateDoc(doc(db, "stockGoal", querySnapshot.docs[0].id), updatedData);
            console.log("Goal updated successfully!");
        }
    } catch (error) {
        console.error("Error updating goal:", error);
        throw error;
    }
};

export const retrieveGoal = async (db, userId) => { 
    try {
        const q = query(collection(db, "stockGoal"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Return only the "goal" field
            return querySnapshot.docs[0].data().goal;
        }
    } catch (error) {
        console.error("Error retrieving goal:", error);
        throw error;
    }
}
