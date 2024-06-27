import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";



//create a new balance for stock portfolio based off user id , month and year

export const CreateBalance= async (db, balanceData) => {
    try {
        const docRef = await addDoc(collection(db, "stockBalance"), balanceData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding balance:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};


export const EditBalance = async (db, userId, year, month, updatedData) => {
    try {
        // Query for the document to update
        const q = query(
            collection(db, "stockBalance"),
            where("userId", "==", userId),
            where("year", "==", year),
            where("month", "==", month)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update the existing document with the new data
            await updateDoc(doc(db, "stockBalance", querySnapshot.docs[0].id), updatedData);
            console.log("stockBalance updated successfully!");
        }
    } catch (error) {
        console.error("Error updating stockBalance:", error);
        throw error;
    }
};




export const RetrieveBalance = async (db, userId, year, month) => { 
    try {
        const q = query(
            collection(db, "stockBalance"),
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
        console.error("Error retrieving stockBalance:", error);
        throw error;
    }
}
