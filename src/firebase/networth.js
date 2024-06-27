import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";



//crud for net worth


export const AddUserWorth= async (db, netData) => {
    try {
        const docRef = await addDoc(collection(db, "userNetWorth"), netData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding goal:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};

export const EditUserWorth = async (db, userId, year, month, updatedData) => {
    try {
        // Query for the document to update
        const q = query(
            collection(db, "userNetWorth"),
            where("userId", "==", userId),
            where("year", "==", year),
            where("month", "==", month)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update the existing document with the new data
            await updateDoc(doc(db, "userNetWorth", querySnapshot.docs[0].id), updatedData);
            console.log("userNetWorth updated successfully!");
        }
    } catch (error) {
        console.error("Error updating userNetWorth:", error);
        throw error;
    }
};

export const RetrieveUserWorth = async (db, userId, year, month) => { 
    try {
        const q = query(
            collection(db, "userNetWorth"),
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
        console.error("Error retrieving userNetWorth:", error);
        throw error;
    }
}