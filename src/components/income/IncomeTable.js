import React from 'react';
import { deleteIncome, updateIncome } from '../../firebase/income';
import { db } from '../../firebase/firebase';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

//for messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateIncomeModal = ({ isOpen, onClose, userId, incomeName, incomeCategory, incomeDate, amount, description }) => {
    const [modalOpen, setModalOpen] = useState(isOpen);
    const [newCategory, setNewCategory] = useState(incomeCategory);
    const [newDate, setNewDate] = useState(incomeDate);
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
            await updateIncome(db, userId, incomeName, newCategory, newDate, newAmount, newDescription);
            handleCloseModal();
            toast.success(`Income updated successfully!`);
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
                            <h2 className="mb-4 font-bold">Update Income Details for {incomeName}</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        <option value="Job">Job</option>
                                        <option value="Dividends">Dividends</option>
                                        <option value="Misc">Misc</option>
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
                            <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Update
                            </button>
                            <button onClick={handleCloseModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const IncomeTable = ({ data, currentUser }) => {
    const [income, setIncome] = useState(data);
    const [editModal, setEditModal] = useState(false);
    const [selectedIncomeName, setSelectedIncomeName] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);

    useEffect(() => {
        console.log("Updating income with data:", data);
        setIncome(data);
        console.log("Updated income:", income);
    }, [data]);

    useEffect(() => {
        console.log("Income after update:", income);
    }, [income]);

    const handleDelete = async (userId, incomeName, category, date, amount) => {
        try {
            await deleteIncome(db, userId, incomeName, category, date, amount);
            const updatedIncome = income.filter(income => {
                return !(income.userId === userId && income.incomeName === incomeName && income.incomeCategory === category && income.incomeDate === date && income.amount === amount);
            });
            setIncome(updatedIncome);
            console.log("Income deleted successfully");
            toast.success(`Income deleted successfully!`);
        } catch (error) {
            console.error("Error deleting income:", error);
            throw error;
        }
    };

    const handleEdit = async (userId, incomeName, category, date, newAmount, description) => {
        setSelectedIncomeName(incomeName);
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
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map(income => (
                        <tr key={income.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{income.incomeName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{income.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{income.incomeDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{income.incomeCategory}</td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"> </td> */}
                            <td className={rowStyle}>   
                                <button 
                                    onClick={() => handleDelete(currentUser.uid, income.incomeName, income.incomeCategory, income.incomeDate, income.amount)} 
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete <FontAwesomeIcon icon={faTrash} />
                                </button>
                           </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"> */}
                            <td className={rowStyle}>
                                <button 
                                    onClick={() => handleEdit(currentUser.uid, income.incomeName, income.incomeCategory, income.incomeDate, income.amount, income.description)} 
                                    
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
                <UpdateIncomeModal 
                    isOpen={true} 
                    onClose={() => setEditModal(null)}
                    onSubmit={() => { }}
                    userId={currentUser.uid} 
                    incomeName={selectedIncomeName} 
                    incomeCategory={selectedCategory} 
                    incomeDate={selectedDate} 
                    amount={selectedAmount} 
                    description={selectedDescription}
                />
            )}
        </div>
    );
}

export default IncomeTable;