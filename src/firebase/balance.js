// balance.js
import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

import { db } from "./firebase"; // Adjust the import path as needed

export async function fetchBalance(userId, month, setBalance) {
  const balancesRef = collection(db, "balances");
  const q = query(
    balancesRef,
    where("userId", "==", userId),
    where("month", "==", month)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0].data();
    setBalance(docData.balance);
    return docData.balance;
  } else {
    console.log(`No existing balance for ${month}, initializing.`);
    await createBalance(userId, month, 0.0, setBalance);
    return 0;
  }

}

export async function createBalance(userId, month, initialValue, setBalance) {
  const balancesRef = collection(db, "balances");

  try {
    await addDoc(balancesRef, { userId, month, balance: initialValue });
    console.log(`Balance for ${month} initialized to $${initialValue}.`);
    setBalance(initialValue);
  } catch (error) {
    console.error("Error creating balance:", error);
  }
}

export async function updateBalance(userId, month, balanceValue, setBalance) {
  // Reference to the balances collection
  const balancesRef = collection(db, "balances");
  // Create a query against the collection
  const balanceQuery = query(
    balancesRef,
    where("userId", "==", userId),
    where("month", "==", month)
  );

  try {
    // Execute the query
    const querySnapshot = await getDocs(balanceQuery);
    if (!querySnapshot.empty) {
      // Assuming the first document in the query results is the one you want
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { balance: parseFloat(balanceValue) });
      console.log("Balance updated successfully.");
      setBalance(parseFloat(balanceValue)); // Update local state
    } else {
      console.log(
        `No balance found for user ID: ${userId} and month: ${month}, creating one.`
      );
      await createBalance(userId, month, parseFloat(balanceValue), setBalance); // You may need to adjust this function
    }
  } catch (error) {
    console.error("Error updating balance:", error);
  }
}