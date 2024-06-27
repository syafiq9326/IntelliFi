
import React, { useState } from 'react';
import Switcher4 from "./switch";
import Budget from './Budget';
import NetWorthGoal from './NetWorthGoal';

export const BudgetNetWorth = ({ totalExpenses, totalNetWorth }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <Switcher4
        isChecked={isChecked}
        handleCheckboxChange={handleCheckboxChange}
        className="absolute-right-0"
      />
      {isChecked ? (
        <Budget totalExpenses={totalExpenses} />
      ) : (
        <NetWorthGoal totalNetWorth={totalNetWorth} />
      )}
    </div>
  );
};

