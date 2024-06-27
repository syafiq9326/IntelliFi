import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { Navbar } from '../../components/navbar'; // Adjust the path based on the directory structure
import MonthlyExpense from './ExpenseChart'; // Adjust the path based on the directory structure
import AddExpense from './ExpenseForm'; // Adjust the path based on the directory structure
import { ExpensePieChart } from './ExpensePieChart';
import ExpenseTable from './ExpenseTable';

import { fetchExpenses, createExpense } from '../../firebase/expense'; // Adjust the path based on the directory structure
import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { set } from 'firebase/database';
import { collection, doc, addDoc, getDocs, updateDoc, query, where, onSnapshot } from 'firebase/firestore';

export const ExpenseFetcher = ({ db, currentUser, setExpense }) => {
    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const data = await fetchExpenses(db, currentUser.uid);
                console.log("Expenses fetched successfully:", data);
                setExpense(data);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };
        fetchExpense();
    }, [db, currentUser, setExpense]);
    return null;
}



export const Expenses = () => {
    //this is how you get currentUser
    const { currentUser } = useAuth();

    //insert your functions to interact with the expensesJS under firebase here.
    const [expenses, setExpenses] = useState([]);
    ExpenseFetcher({ db, currentUser, setExpense: setExpenses })

    useEffect(() => {
        const fetchData = async () => {
            const dataQuery = query(collection(db, "expenses"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(dataQuery);
            const expenseData = [];
            querySnapshot.forEach((doc) => {
                expenseData.push(doc.data());
            });
            setExpenses(expenseData);

            const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
                const expenseData = [];
                snapshot.forEach((doc) => {
                    expenseData.push(doc.data());
                });
                setExpenses(expenseData);
            });
            return () => unsubscribe();
        };
        fetchData();
    }, [currentUser.uid]);

    return (
        <div className="flex flex-col md:flex-row h-screen">
          <Navbar />
          <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-wrap gap-4 justify-center items-stretch w-full">
                <div className="flex-1 bg-white shadow-md rounded-lg p-5 text-center" style={{ maxWidth: '32%' }}>
                    <h2 style={{ fontSize: '28px' }}>Distribution Of Expenses</h2>
                    <ExpensePieChart data={expenses}/>
                </div>
                <div className="flex-1 bg-white shadow-md rounded-lg p-5 text-center" style={{ maxWidth: '32%' }}>
                    <h2 style={{ fontSize: '28px' }}>6 Month Expense</h2>
                    <MonthlyExpense data={expenses}/>
                </div>
                <div className="flex-1 bg-white shadow-md rounded-lg p-5 text-center" style={{ maxWidth: '32%' }}>
                    <h2 style={{ fontSize: '28px' }}>Add Expense</h2>
                    <AddExpense currentUser={currentUser}/>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-5 my-4 text-center" style={{ overflowY: 'auto' }}>
                <h2 style={{ fontSize: '28px' }}>Expenses</h2>
                <ExpenseTable data={expenses} currentUser={currentUser}/>
            </div>
          </div>
        </div>
    );
}