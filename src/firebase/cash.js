import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";



//crud for cash 


export const AddUserCash= async (db, cashData) => {
    try {
        const docRef = await addDoc(collection(db, "userCash"), cashData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding goal:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};

export const EditUserCash = async (db, userId, year, month, updatedData) => {
    try {
        // Query for the document to update
        const q = query(
            collection(db, "userCash"),
            where("userId", "==", userId),
            where("year", "==", year),
            where("month", "==", month)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update the existing document with the new data
            await updateDoc(doc(db, "userCash", querySnapshot.docs[0].id), updatedData);
            console.log("userCash updated successfully!");
        }
    } catch (error) {
        console.error("Error updating userCash:", error);
        throw error;
    }
};

export const RetrieveUserCash = async (db, userId, year, month) => { 
    try {
        const q = query(
            collection(db, "userCash"),
            where("userId", "==", userId),
            where("year", "==", year),
            where("month", "==", month)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Return the entire balance object
            return querySnapshot.docs[0].data();
        }
        // Return null when no balance data is found
        return null;
    } catch (error) {
        console.error("Error retrieving userCash:", error);
        throw error;
    }
}