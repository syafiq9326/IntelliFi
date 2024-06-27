import React from "react";
import { useAuth } from "../../contexts/authContext";
import { Navbar } from "../../components/navbar"; // Adjust the path based on the directory structure
import IncomeForm from "./IncomeForm"; // Adjust the path based on the directory structure
import IncomePieChart from "./IncomePieChart"; // Adjust the path based on the directory structure
import IncomeChart from "./IncomeChart"; // Adjust the path based on the directory structure
import IncomeTable from "./IncomeTable"; // Adjust the path based on the directory structure

import { AddStock, GetStocks } from "../../firebase/stock";
import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { GetAllIncomeTxn } from "../../firebase/income";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export const IncomeFetcher = ({ db, currentUser, setIncome }) => {
  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const data = await GetAllIncomeTxn(db, currentUser.uid);
        console.log("Income fetched successfully:", data);
        setIncome(data);
      } catch (error) {
        console.error("Error fetching Incomes:", error);
      }
    };
    fetchIncome();
  }, [db, currentUser, setIncome]);
  return null;
};

export const Income = () => {
  //this is how you get currentUser
  const { currentUser } = useAuth();
  const [income, setIncome] = useState([]);
  IncomeFetcher({ db, currentUser, setIncome: setIncome });

  //insert your functions to interact with the expensesJS under firebase here.

  // remount component each time got update to db
  useEffect(() => {
    const fetchData = async () => {
      const dataQuery = query(
        collection(db, "income"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(dataQuery);
      const incomeData = [];
      querySnapshot.forEach((doc) => {
        incomeData.push(doc.data());
      });
      setIncome(incomeData);

      // Subscribe to changes in the Firestore collection
      const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
        const incomeData = [];
        snapshot.forEach((doc) => {
          incomeData.push(doc.data());
        });
        setIncome(incomeData);
      });

      // Clean up the subscription when the component unmounts
      return () => unsubscribe();
    };

    fetchData(); // Fetch income again when component mounts
  }, [currentUser.uid]); // Only re-run effect if currentUser.uid changes

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Navbar /> {/* Assume Navbar height is 50px */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-wrap gap-4 justify-center items-stretch w-full">
          <div
            className="flex-1 bg-white shadow-md rounded-lg p-5 text-center"
            style={{ maxWidth: "32%" }}
          >
            <h2 className="text-lg mb-2">Distribution Of Income</h2>
            <IncomePieChart data={income} />
          </div>
          <div
            className="flex-1 bg-white shadow-md rounded-lg p-5 text-center"
            style={{ maxWidth: "32%" }}
          >
            <h2 className="text-lg mb-2">Total 6 months Income</h2>
            <IncomeChart data={income} />
          </div>  
          <div
            className="flex-1 bg-white shadow-md rounded-lg p-5 text-center"
            style={{ maxWidth: "32%" }}
          >
            <h2 className="text-lg mb-2">Add Income</h2>
            <IncomeForm currentUser={currentUser} />
          </div>
          
        </div>
        
        <div
          className="bg-white shadow-md rounded-lg p-5 my-4 text-center"
          style={{ overflowY: "auto" }}
        >
          <h2 className="text-lg mb-2">Income History</h2>
          <IncomeTable data={income} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};
