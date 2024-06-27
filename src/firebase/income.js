import { collection, doc, addDoc, getDocs, updateDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the import path as needed
import { fetchBalance } from "./balance";

//crud for income form
//this adds a transaction recepit within the income db
export const createIncome = async (db, incomeData) => {
    try {
        const docRef = await addDoc(collection(db, "income"), incomeData);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding income: ", error);
        throw error;
    }
};

//idea of this is to call update Balance to update current user balance with respect to the current month
export const UpdateBalancePlusMinus = async (userId, month, incomeTxn, isExpense) => {
    console.log("Test");
    console.log(db);
    const balancesRef = collection(db, "balances");
    const q = query(
        balancesRef,
        where("userId", "==", userId),
        where("month", "==", month)
    );

    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0]; // This is the document snapshot
            const docRef = docSnapshot.ref; // This is the reference to the document
            const docData = docSnapshot.data(); // This is how you access the document's data

            const initialBal = docData.balance; // Assuming 'balance' is the field name in your document

            var newBal = 0;
            if (isExpense) {
                //is an expense
                newBal = initialBal - incomeTxn; // Correctly adding the transaction to the initial balance
            } else {
                newBal = initialBal + incomeTxn; // Correctly adding the transaction to the initial balance
            }
            

            console.log("Old Balance: " + initialBal);


            await updateDoc(docRef, {balance: parseFloat(newBal)});
            console.log("New balance after adding/subtraction: " + newBal);

            //need to update local view page here
        }
    } catch (error) {
        console.error("Error adding income: ", error);
        throw error;
    }
}

export const GetAllIncomeTxn = async (db, userId) => {
    const incomeTxns = [];
    const querySnapshot = await getDocs(query(collection(db, "income"),
        where("userId", "==" , userId)));

    querySnapshot.forEach((doc) => {
        incomeTxns.push(doc.data());
        console.log("getting all income txn");
    });
    return incomeTxns;
}

export const updateIncome = async (db, userId, incomeName, category, date, newAmount, description) => {
    try {
        console.log("Received date object/type:", date, typeof date);
        const dateString = date instanceof Date ? 
                           `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` : 
                           date;
        // Query the expenses collection to find documents with matching user ID and category
        const incomeQuery = query(collection(db, "income"),
            where("userId", "==", userId),
            where("incomeName", "==", incomeName));
        const querySnapshot = await getDocs(incomeQuery);
        if (!querySnapshot.empty) {
            // Update the amount and description of the first matching document
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
                amount: parseFloat(newAmount),
                description: description,
                incomeCategory: category, //removed this to prevent changing of category
                incomeDate: dateString
            });
            console.log("Income updated successfully");
        } else {
            console.log("No matching income found");
        }
    } catch (error) {
        console.error("Error querying income:", error);
        throw error;
    }
};

export const deleteIncome = async (db, userId, incomeName, category, date, amount) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "income"), where("userId", "==", userId), where("incomeName", "==", incomeName), where("incomeCategory", "==", category), where("incomeDate", "==", date), where("amount", "==", amount)));
        if (!querySnapshot.empty) {
            await deleteDoc(querySnapshot.docs[0].ref);
            console.log("Income deleted successfully");
        } else {
            console.log("No matching income found");
        }
    } catch (error) {
        console.error("Error deleting income:", error);
        return false;
    }
};