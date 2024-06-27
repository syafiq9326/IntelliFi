import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import {
  createTarget,
  setNewTarget,
  fetchOrCreateTarget,
} from "../../firebase/target";
import Switcher4 from "./switch";
//for messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useColorScheme } from "../profile/useColorScheme"; // Import the color scheme hook

// Props could include current value, goal, and a function for setting the target
export const NetWorthGoal = ({ totalNetWorth }) => {
  const [target, setTarget] = useState(0);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [isModalOpen, setModalOpen] = useState(false);
  const { isDark } = useColorScheme(); // Get the dark mode state

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (event) => {
    setTarget(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await setNewTarget(db, userId, { targetValue: target });
      toast.success(`edited target successfully!`);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating target:", error);
      alert("Failed to update target.");
    }
  };

  useEffect(() => {
    const loadTarget = async () => {
      try {
        const targetData = await fetchOrCreateTarget(db, userId);
        if (targetData && targetData.targetValue !== undefined) {
          setTarget(targetData.targetValue);
        }
      } catch (error) {
        console.error("Failed to fetch or create target:", error);
        // Optionally handle the error by showing user feedback
      }
    };

    if (userId) {
      loadTarget();
    }
  }, [userId]);

  // Calculate the percentage of the goal reached
  const percentage = Math.min((totalNetWorth / target) * 100, 100).toFixed(2);

  // Calculate strokeDashoffset for SVG circle progress
  const circumference = 2 * Math.PI * 70; // 70 is the radius of the circle
  const offset = ((100 - percentage) / 100) * circumference;

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="relative flex flex-col items-center w-full">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Net Worth Goal
          </h2>
        </div>

        <br>
        </br>

        <div className="relative">
          {/* SVG Circle for the background track */}
          <svg className="transform -rotate-90" width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={isDark ? '#4f4f4f' : '#e6e6e6'}
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
              stroke="#4ade80"
              strokeWidth="15"
              fill="transparent"
              strokeDasharray={circumference} // Approximately the circumference of the circle
              strokeDashoffset={offset} // Adjust this value to set the progress (50% progress here)
            />
          </svg>

          {/* Text content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Target:</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>${target}</p>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {isNaN(percentage) ? '0' : Math.round(percentage)}%
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-500 my-6"></div>

      <div className="flex justify-center">
        <button
          className={`bg-black text-white py-2 px-4 rounded ${isDark ? 'hover:bg-gray-800' : 'hover:bg-blue-700'}`}
          onClick={handleOpenModal}
        >
          Set Target
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
            <div className={`bg-white p-5 rounded-lg ${isDark ? 'text-gray-900' : 'text-gray-800'}`}>
              <h2 className={`text-gray-700 text-l font-bold mb-2`}>
                Set Your New Target
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <input
                    type="number"
                    value={target}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${isDark ? 'text-gray-700' : 'text-gray-700'} mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className={`bg-black ${isDark ? 'hover:bg-gray-800' : 'hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  >
                    Set Target
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className={`bg-red-500 ${isDark ? 'hover:bg-red-700' : 'hover:bg-red-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
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

export default NetWorthGoal;