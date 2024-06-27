import React from "react";
import Modal from "./modal"; // Adjust the path based on your file structure

const CashBalance = ({
  month,
  setMonth,
  months,
  balance,
  handleModalOpen,
  isModalOpen,
  handleModalClose,
  handleModalSubmit,
}) => {
  return (
    <div className="bg-white p-5 rounded-lg border-2 shadow-md flex-col h-full w-full items-end justify-center flex-1">
      <div className="flex mb-4 items-end">
        <div className="text-l text-gray-700 dark:text-black font-bold">Cash</div>
        <div className="">
          <label className="inline-block ml-2">
            <div className="flex items-center bg-gray-200 text-gray-700 font-semibold rounded">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-transparent focus:outline-none text-sm py-0.5" // Adjust text size and padding here
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <svg
                className="fill-current w-1 h-4" // Adjust the SVG size here if needed
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" // This viewBox ensures that the SVG scales correctly
              >
                {/* Insert SVG path data for a dropdown icon */}
              </svg>
            </div>
          </label>
        </div>
      </div>
      <div className="flex items-end mt-1">
        <div className="text-3xl text-black font-medium">
          {new Intl.NumberFormat("en-SG", {
            style: "currency",
            currency: "SGD",
          }).format(balance)}
        </div>

        <div className="text-xs text-gray-900 ml-2 mb-1">SGD</div>
      </div>
      <div class="border-t border-gray-500 my-4 w-full"></div>
      <div className="flex justify-center">
        <button
          className="bg-black text-white py-2 px-4 rounded flex"
          onClick={handleModalOpen}
        >
          Set balance
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          selectedMonth={month}
        />
      </div>
    </div>
  );
};

export default CashBalance;