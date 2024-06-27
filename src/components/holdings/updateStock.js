import React, { useState, useEffect, useRef } from 'react';
import { EditStock } from '../../firebase/stock';
import { db } from '../../firebase/firebase';


//for messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UpdateStockModal = ({ isOpen, onClose, stockSymbol, userId }) => {
    const [modalOpen, setModalOpen] = useState(isOpen);
    const [newAveragePrice, setNewAveragePrice] = useState(0);
    const [newQuantity, setNewQuantity] = useState(0);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        onClose();
    };

    const handleUpdateStock = async () => {
        try {
            const updatedData = {
                buyPrice: newAveragePrice,
                stockQuantity: newQuantity
            };

            // Call EditStock function to update the specific stock
            await EditStock(db, stockSymbol, userId, updatedData);
            toast.success(`${stockSymbol} updated successfully!`, {});

            // Close the modal after updating
            handleCloseModal();
        } catch (error) {
            console.error("Error updating stock:", error);
            // Handle error here
        }
    };

    return (
        <>
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">

                    <div className="bg-white p-5 rounded-lg">
                        <div>
                            <h2 className="mb-4 font-bold">Update Stock Details for {stockSymbol}</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Average Price:</label>
                                    <input type="number" value={newAveragePrice} onChange={(e) => setNewAveragePrice(parseFloat(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
                                    <input type="number" value={newQuantity} onChange={(e) => setNewQuantity(parseFloat(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />


                                </div>
                            </form>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleUpdateStock} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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
