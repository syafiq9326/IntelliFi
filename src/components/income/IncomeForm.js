import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import {UpdateBalancePlusMinus, createIncome} from '../../firebase/income';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { maxHeight } from '@mui/system';


const AddIncome = ({currentUser}) => {
  
  const date = new Date(); 
  const formatDate = (date) => {
    let d = new Date(date),
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

  const [incomeName, setIncomeName] = useState('');
  const [amount, setAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('Job');
  // const [incomePeriod, setIncomePeriod] = useState('Yearly');
  const [incomeDate, setIncomeDate] = useState(today);
  const [description, setDescription] = useState('');

  const handleSave = async (e) => {
    // Add validation and logic to handle the save operation
    // Here you would typically send this data to a backend server or store it in your state management system
    //run AddIncomeTxn() and UpdateBalancePlusMinus to save changes to DB  
    e.preventDefault();

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    // Assuming incomeDate is in 'YYYY-MM-DD' format
    const dateObject = new Date(incomeDate);
    // Extracting the month number and using it to get the month name
    const month = monthNames[dateObject.getMonth()];

    console.log('Expense saved', { incomeName, amount, incomeCategory, date: incomeDate, month, description });

    try {
      createIncome(db, {
        userId: currentUser.uid,
        incomeName,
        amount: parseFloat(amount),
        incomeCategory,
        incomeDate,
        description
      });

      await UpdateBalancePlusMinus (currentUser.uid, month, parseFloat(amount));
  
      console.log("Income added to balance");
      // Resetting form fields
      setIncomeName('');
      setAmount('');
      setIncomeCategory('Job'); // Reset to default category or leave empty as preferred
      setIncomeDate(today); // Reset to today's date or leave empty
      setDescription('');
      //DONT USE RELOAD
      // window.location.reload();
      toast.success(`Income added successfully!`);

    } catch (error) {
      console.error("Error adding income to balance: ", error);
    }
  };

  const handleCancel = async(e) => {
    e.preventDefault();
    // Logic to handle cancel, typically resetting state or closing modal
    setIncomeName('');
    setAmount('');
    setIncomeCategory('Job'); // Reset to default category or leave empty as preferred
    setIncomeDate(today); // Reset to today's date or leave empty
    setDescription('');
    // window.location.reload();
    console.log('Income addition cancelled');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="incomeName">Income Name</label>
        <input style={styles.input} id="incomeName" value={incomeName} onChange={(e) => setIncomeName(e.target.value)} />
      </div>

      
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="amount">Amount ($)</label>
        <input style={styles.input} id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="incomeCategory">Income Category</label>
        <select style={styles.input} id="incomeCategory" value={incomeCategory} onChange={(e) => setIncomeCategory(e.target.value)}>
          <option value="Job">Job</option>
          <option value="Dividends">Dividends</option>
          <option value="Misc">Misc</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="date">Income Date</label>
        <input style={styles.input} id="date" type="date" 
          value={incomeDate}
          onChange={(e) => setIncomeDate(e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="description">Income Description</label>
        <textarea style={styles.textarea} id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div style={styles.actions}>
        <button style={styles.saveButton} onClick={handleSave}>Save</button>
        <button style={styles.cancelButton} onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"DM Sans", sans-serif',
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    width: '100%', // maintains width responsiveness
    maxHeight: '80vh', // adjusts based on the viewport height
    overflowY: 'auto', // adds scrolling within the form if content exceeds the height
    boxSizing: 'border-box',
    margin: '0 auto'
  },
  header: {
    color: '#232360',
    fontSize: '34px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#232360'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #CBD5E0',
    // Remove fixed heights if set, allow content to determine height
    color: '#768396'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #CBD5E0',
    minHeight: '80px', // Use minHeight to allow expansion
    overflow: 'auto' // Allows scrolling inside textarea if content overflows
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px'
  },
  cancelButton: {
    marginRight: '10px',
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid #E2E8F0',
    background: 'white',
    color: '#333',
    cursor: 'pointer'
  },
  saveButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    background: '#6366F1',
    color: 'white',
    cursor: 'pointer'
  }
};

export default AddIncome;
