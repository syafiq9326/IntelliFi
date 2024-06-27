// Modal.js
import React, { useState } from "react";

const Modal = ({ isOpen, onClose, onSubmit, selectedMonth }) => {
  const [month, setMonth] = useState(selectedMonth);
  const [balance, setBalance] = useState("");


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(month, balance);
          }}
        >
          <div className="mb-4">
          </div>
          <div className="mb-6">
            <label
              htmlFor="balance"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Balance:
            </label>
            <input
              type="number"
              id="balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-black text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Set Balance
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;