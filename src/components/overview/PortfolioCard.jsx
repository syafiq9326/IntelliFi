// PortfolioCard.jsx
import React from 'react';

const PortfolioCard = ({ portfolioValue, profitLossAmount, profitLossPercentage, handleClick }) => {
  // Determine the class for the profit/loss text based on its value
  const profitLossClass = profitLossAmount >= 0 ? 'text-green-600' : 'text-red-600';
  
  // Format the profit/loss string
  const profitLossString = profitLossAmount >= 0 
    ? `+${profitLossAmount} (${profitLossPercentage}%)` 
    : `-${profitLossAmount} (${profitLossPercentage}%)`;

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-md h-full">
      <div className="text-lg font-bold text-black">My portfolio</div>
      <div className="flex items-end mt-1">
        <div className="text-3xl text-black font-medium">
          {portfolioValue}
        </div>
        <div className="text-xs text-gray-900 ml-2 mb-1">SGD</div>
      </div>
      <div className={`text-xs ${profitLossClass} mt-1`}>
        {profitLossString}
      </div>
      <div className="border-t border-gray-500 my-4"></div>
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          className="flex justify-center items-center bg-black text-white py-2 px-4 rounded"
        >
          View portfolio
        </button>
      </div>
    </div>
  );
};

export default PortfolioCard;