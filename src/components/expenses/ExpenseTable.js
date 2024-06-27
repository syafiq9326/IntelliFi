import React from 'react';
import { deleteExpense, updateExpense } from '../../firebase/expense';
import { db } from '../../firebase/firebase';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const UpdateExpenseModal = ({ isOpen, onClose, userId, expenseName, category, date, amount, description }) => {
    const [modalOpen, setModalOpen] = useState(isOpen);
    const [newCategory, setNewCategory] = useState(category);
    const [newDate, setNewDate] = useState(date);
    const [newDescription, setNewDescription] = useState(description);
    const [newAmount, setNewAmount] = useState(amount);
    const handleOpenModal = () => {
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        onClose();
    };
    const handleUpdate = async () => {
        try {
            await updateExpense(db, userId, expenseName, category, newDate, newAmount, newDescription);
            handleCloseModal();
            toast.success("Expense updated successfully!");
        } catch (error) {
            console.error("Error updating expense:", error);
        }
    };
    
    return (
        <>
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg">
                        <div>
                            <h2 className="mb-4 font-bold">Update Expense Details for {expenseName}</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        <option value="Food">Food</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Transport">Transport</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
                                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                    <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
                                    <input type="number" value={newAmount} onChange={(e) => setNewAmount(parseFloat(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                            </form>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleUpdate} className="text-white py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700">
                                Update
                            </button>
                            <button onClick={handleCloseModal} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const ExpenseTable = ({ data, currentUser }) => {
    const [expenses, setExpenses] = useState(data);
    const [editModal, setEditModal] = useState(false);
    const [selectedExpenseName, setSelectedExpenseName] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);

    useEffect(() => {
        console.log("Updating expenses with data:", data);
        setExpenses(data);
        console.log("Updated expenses:", expenses);
    }, [data]);

    useEffect(() => {
        console.log("Expenses after update:", expenses);
    }, [expenses]);

    const handleDelete = async (userId, expenseName, category, date, amount) => {
        try {
            await deleteExpense(db, userId, expenseName, category, date, amount);
            const updatedExpenses = expenses.filter(expense => {
                return !(expense.userId === userId && expense.expenseName === expenseName && expense.category === category && expense.date === date && expense.amount === amount);
            });
            setExpenses(updatedExpenses);
            console.log("Expense deleted successfully");
            toast.success("Expense deleted successfully!");
        } catch (error) {
            console.error("Error deleting expense:", error);
            throw error;
        }
    };

    const handleEdit = async (userId, expenseName, category, date, newAmount, description) => {
        setSelectedExpenseName(expenseName);
        setSelectedCategory(category);
        setSelectedDate(date);
        setSelectedAmount(newAmount);
        setSelectedDescription(description);
        setEditModal(true);
    }

    const rowStyle = "px-6 py-2 whitespace-nowrap text-sm text-gray-900";
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const pageCount = Math.ceil(data.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handleNext = () => {
        setCurrentPage(currentPage => currentPage < pageCount ? currentPage + 1 : currentPage);
    };

    const handlePrevious = () => {
        setCurrentPage(currentPage => currentPage > 1 ? currentPage - 1 : currentPage);
    };

    return (
        <div className="relative">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map(expense => (
                        <tr key={expense.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.expenseName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                            <td className={rowStyle}>
                                <button 
                                    onClick={() => handleDelete(currentUser.uid, expense.expenseName, expense.category, expense.date, expense.amount)} 
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                            <td className={rowStyle}>
                                <button 
                                    onClick={() => handleEdit(currentUser.uid, expense.expenseName, expense.category, expense.date, expense.amount, expense.description)} 
                                    className="text-black-600 hover:text-red-900"
                                >
                                    Edit <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {pageCount > 1 && (
                <div className="flex justify-center mt-4">
                    {currentPage > 1 &&
                        <button onClick={handlePrevious} className="text-white py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 mr-2">
                            Previous
                        </button>
                    }
                    {currentPage < pageCount &&
                        <button onClick={handleNext} className="text-white py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700">
                            Next
                        </button>
                    }
                </div>
            )}
            {editModal && (
                <UpdateExpenseModal 
                    isOpen={true} 
                    onClose={() => setEditModal(null)}
                    onSubmit={() => { }}
                    userId={currentUser.uid} 
                    expenseName={selectedExpenseName} 
                    category={selectedCategory} 
                    date={selectedDate} 
                    amount={selectedAmount} 
                    description={selectedDescription}
                />
            )}
        </div>
    );
}

export default ExpenseTable;