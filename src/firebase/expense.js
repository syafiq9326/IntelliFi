import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";

import { db } from "./firebase"; // Adjust the import path as needed

//crud for expense for
export const createExpense = async (db, expenseData) => {
    try {
        const docRef = await addDoc(collection(db, "expenses"), expenseData);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id; // Return the ID of the newly created document
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};

export const fetchExpenses = async (db, userId) => {
    const expenses = [];
    const querySnapshot = await getDocs(query(collection(db, "expenses"), where("userId", "==", userId)));
    querySnapshot.forEach((doc) => {
        expenses.push(doc.data());
        console.log("retrieving data");
    });
    return expenses;
};

export const updateExpense = async (db, userId, expenseName, category, date, newAmount, description) => {
    try {
        console.log("Received date object/type:", date, typeof date);
        const dateString = date instanceof Date ? 
                           `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` : 
                           date;
        // Query the expenses collection to find documents with matching user ID and category
        const expenseQuery = query(collection(db, "expenses"),
            where("userId", "==", userId),
            where("expenseName", "==", expenseName));
        const querySnapshot = await getDocs(expenseQuery);
        if (!querySnapshot.empty) {
            // Update the amount and description of the first matching document
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
                amount: parseFloat(newAmount),
                description: description,
                category: category,
                date: dateString
            });
            console.log("Expense updated successfully");
        } else {
            console.log("No matching expense found");
        }
    } catch (error) {
        console.error("Error querying expense:", error);
        throw error;
    }
};

export const deleteExpense = async (db, userId, expenseName, category, date, amount) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "expenses"), where("userId", "==", userId), where("expenseName", "==", expenseName), where("category", "==", category), where("date", "==", date), where("amount", "==", amount)));
        if (!querySnapshot.empty) {
            await deleteDoc(querySnapshot.docs[0].ref);
            console.log("Expense deleted successfully");
        } else {
            console.log("No matching expense found");
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
        return false;
    }
};

export const fetchTotalExpenses = async (userId) => {
    let totalExpenses = 0; // Initialize total expenses to zero
    const expensesRef = collection(db, "expenses"); // Reference to the expenses collection
    const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId)) // Query to find all expenses for the given userId

    try {
        const querySnapshot = await getDocs(expensesQuery); // Execute the query
        querySnapshot.forEach((doc) => {
            const expenseAmount = parseFloat(doc.data().amount); // Parse the amount as a float
            if (!isNaN(expenseAmount)) { // Check if the parsed amount is a valid number
                totalExpenses += expenseAmount; // Add the amount to the total
            }
        });
        console.log(`Total expenses for user ${userId}: $${totalExpenses}`);
        return totalExpenses; // Return the computed total expenses
    } catch (error) {
        console.error("Error fetching total expenses:", error);
        throw error; // Throw an error if something goes wrong during the fetch
    }
};