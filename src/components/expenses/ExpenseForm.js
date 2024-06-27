import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { createExpense } from '../../firebase/expense';
import {UpdateBalancePlusMinus} from '../../firebase/income';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddExpense = ({currentUser}) => {

  const date1 = new Date(); 
  const formatDate = (date1) => {
    let d = new Date(date1),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  };

  const today = formatDate(new Date());

  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    // Logic to handle saving the expense

    //getting name of month to query db
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    // Assuming date is in 'YYYY-MM-DD' format
    const dateObject = new Date(date);
    // Extracting the month number and using it to get the month name
    const month = monthNames[dateObject.getMonth()];

    try {
      createExpense(db, {
        userId: currentUser.uid,
        expenseName,
        amount: parseFloat(amount),
        category,
        date,
        description
      });

      await UpdateBalancePlusMinus (currentUser.uid, month, parseFloat(amount), true);

      console.log('Expense added successfully');
      setExpenseName('');
      setAmount('');
      setCategory('Food');
      setDate('');
      setDescription('');
      toast.success('Expense added successfully!');

    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }
    
  //   .then(() => {
  //       console.log('Expense added successfully');
  //       setExpenseName('');
  //       setAmount('');
  //       setCategory('Food');
  //       setDate('');
  //       setDescription('');
  //       window.location.reload();
  //   }).catch((error) => {
  //       console.error('Error adding expense:', error);
  //   });
  // };

  const handleCancel = async (e) => {
    e.preventDefault();
    // Logic to handle cancel, typically resetting state or closing modal
    setExpenseName('');
    setAmount('');
    setCategory('Food');
    setDate('');
    setDescription('');
    console.log('Expense addition cancelled');
    toast.success('Expense addition cancelled');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6">
      <form className="space-y-4">
        <div>
          <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700">
            Expense Name
          </label>
          <input
            id="expenseName"
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Expense Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transport">Transport</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Expense Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Expense Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSave}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;