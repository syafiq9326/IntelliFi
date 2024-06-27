import React from "react";

const BudgetModal = ({ isOpen, onClose, newBudget, setNewBudget, updateBudget, currentUser, budgetType, setBudget }) => {
  if (!isOpen) return null;

  const handleUpdateBudget = async () => {
    await updateBudget(currentUser.uid, budgetType, newBudget, setBudget);
    setNewBudget(""); // Reset input field
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Set New Budget</h2>
        <input
          id="budgetInput"
          type="number" // Changed to number for better input control
          className="block w-full p-2 border-gray-300 rounded-md shadow-sm mb-4"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
          placeholder="Enter your new budget"
        />
        <div className="flex justify-between">
          <button
            className="text-white bg-black hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={async () => {
              await updateBudget(
                currentUser.uid,
                budgetType,
                newBudget,
                setBudget
              );
              setNewBudget(""); // Reset input field
              onClose(); // Close modal
            }}
          >
            Set Budget
          </button>
          <button
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;