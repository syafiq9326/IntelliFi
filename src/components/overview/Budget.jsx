import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import {
  setNewBudget,
  fetchOrCreateBudget,
} from "../../firebase/budget";
import Switcher4 from "./switch";
//for messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Props could include current value, goal, and a function for setting the budget
export const Budget = ({ totalExpenses }) => {
  const [budget, setbudget] = useState(0);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (event) => {
    setbudget(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await setNewBudget(db, userId, { budgetValue: budget });
      toast.success(`edited budget successfully!`);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget.");
    }
  };

  useEffect(() => {
    const loadbudget = async () => {
      try {
        const budgetData = await fetchOrCreateBudget(db, userId);
        if (budgetData && budgetData.budgetValue !== undefined) {
          setbudget(budgetData.budgetValue);
        }
      } catch (error) {
        console.error("Failed to fetch or create budget:", error);
        // Optionally handle the error by showing user feedback
      }
    };

    if (userId) {
      loadbudget();
    }


  }, [userId]);

  // Calculate the percentage of the goal reached
  const percentage = Math.min((totalExpenses / budget) * 100, 100).toFixed(2);

  // Calculate strokeDashoffset for SVG circle progress
  const circumference = 2 * Math.PI * 70; // 70 is the radius of the circle
  const offset = ((100 - percentage) / 100) * circumference;

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="relative flex flex-col items-center w-full">
          <h2 className="text-lg font-semibold text-gray-700">
            Budget Goal
          </h2>
          <div className="absolute right-0">
          </div>
        </div>

        <div className="relative">
          {/* SVG Circle for the background track */}
          <svg className="transform -rotate-90" width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e6e6e6"
              strokeWidth="15"
              fill="transparent"
            />
          </svg>

          {/* SVG Circle for the progress */}
          <svg
            className="transform -rotate-90 absolute top-0 left-0"
            width="160"
            height="160"
          >
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#cc0000"
              strokeWidth="15"
              fill="transparent"
              strokeDasharray={circumference} // Approximately the circumference of the circle
              strokeDashoffset={offset} // Adjust this value to set the progress (50% progress here)
            />
          </svg>

          {/* Text content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-sm text-gray-500">Budget:</p>
            <p className="text-lg font-semibold text-gray-700">${budget}</p>
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(percentage)}%
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold my-4 text-center" style={{ color: "black" }}>Total Spent: ${totalExpenses}</h2>


      <div className="flex justify-center mt-5">
        <button
          class="bg-black text-white py-2 px-4 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleOpenModal}
        >
          Set Budget
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-white p-5 rounded-lg">
              <h2 className="text-gray-700 text-l font-bold mb-2">
                Set Your New budget
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <input
                    type="number"
                    value={budget}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Set budget
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
