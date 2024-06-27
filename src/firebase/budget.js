import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";


export const createBudget = async (db, budgetData) => {
    try {
        const docRef = await addDoc(collection(db, "newbudgets"), budgetData);
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding budget:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};


export const setNewBudget = async (db, userId, updatedData) => {
    try {
        // Query for the document to update
        const q = query(
            collection(db, "newbudgets"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update the existing document with the new data
            await updateDoc(doc(db, "newbudgets", querySnapshot.docs[0].id), updatedData);
            console.log("target updated successfully!");
        }
    } catch (error) {
        console.error("Error updating target:", error);
        throw error;
    }
};

export const fetchOrCreateBudget = async (db, userId) => { 
    try {
        const budgetsRef = collection(db, "newbudgets");
        const q = query(budgetsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Return the existing target data
            return querySnapshot.docs[0].data();
        } else {
            // No target found, create a new one with a default value of 0
            const newBudgetData = { userId, budgetValue: 0 };
            const docRef = await addDoc(budgetsRef, newBudgetData);
            console.log("New target initialised with ID:", docRef.id);
            return newBudgetData;
        }
    } catch (error) {
        console.error("Error retrieving or creating target:", error);
        throw error;
    }
}
