import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const calculateLastSixMonths = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    let d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
};

const defaultCategories = ['Food', 'Travel', 'Misc'];

const MonthlyExpense = ({ data }) => {
  const lastSixMonthsLabels = calculateLastSixMonths().map(month => {
    const date = new Date(month + '-01');
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  });

  const [chartData, setChartData] = useState({
    labels: lastSixMonthsLabels,
    datasets: [],
  });
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const lastSixMonths = calculateLastSixMonths();

    // Initialize monthly expenses based on dynamic categories from data
    const categories = new Set(data.map(item => item.category));
    const monthlyExpenses = {};
    categories.forEach(category => {
      monthlyExpenses[category] = new Array(6).fill(0);
    });

    let total = 0.0;

    // Aggregate expenses into monthly categories
    data.forEach(({ category, amount, date }) => {
      if (categories.has(category)) {
        const expenseYearMonth = date.slice(0, 7);
        const monthIndex = lastSixMonths.indexOf(expenseYearMonth);
        if (monthIndex !== -1) {
          const parsedAmount = parseFloat(amount);
          monthlyExpenses[category][monthIndex] += parsedAmount;
          total += parsedAmount;
        }
      }
    });

    // Create datasets for the chart
    const datasets = Object.entries(monthlyExpenses).map(([category, amounts], index) => {
      const color = colors[index % colors.length];
      return {
        label: category,
        data: amounts,
        borderColor: color,
        backgroundColor: `${color}80`, // Add transparency to the fill color
        borderWidth: 2,
        tension: 0.4, // Smoothen the line
      };
    });

    setChartData({ labels: lastSixMonthsLabels, datasets });
    setTotalExpense(total);
  }, [data]);

  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-5 gap-3">
      <div className="text-center">
        <h3 className="text-lg">Total 6 Month Expenditure</h3>
        <p className="text-3xl text-blue-900">${totalExpense.toFixed(2)}</p>
      </div>
      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Amount ($)'
            }
          }
        }
      }} />
    </div>
  );
};

const colors = [
  '#0D1F2D', // Very dark navy, almost black
  '#003366', // Dark blue
  '#336699', // Bluish
  '#6699CC', // Soft blue
  '#99CCFF', // Light blue
  '#FFCC00', // Gold for high contrast
  '#FF9900', // Bright orange
  '#FF6600', // Deep orange
  '#CC3300',
];

export default MonthlyExpense;