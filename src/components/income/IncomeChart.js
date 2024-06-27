import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

  const calculateLastSixMonths = () => {
    const months = [];
    for (let i = 5; i >= 0; i --) {
      let d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); // Format as YYYY-MM
    }
    return months;
  };

  const defaultCategories = ['Job', 'Dividends', 'Misc'];

  const MonthlyIncome = ({data}) => {
    const lastSixMonthsLabels = calculateLastSixMonths().map(month => {
      const date = new Date(month + '-01');
      return date.toLocaleString('default', { month: 'short' });
    });
  
    const [chartData, setChartData] = useState({
      labels: lastSixMonthsLabels,
      datasets: [],
    });

    const [totalIncome, setTotalIncome] = useState(0);

    // console.log("data");
    // console.log(data);

    useEffect(() => {
      const fetchIncome = async () => {
        let total = 0.0;
        const lastSixMonths = calculateLastSixMonths(); // YYYY-MM format for comparison

        const incomeData = data;
  
        const monthlyIncome = {
          Job: new Array(6).fill(0),
          Dividends: new Array(6).fill(0),
          Misc: new Array(6).fill(0),
        };
  
        
  
        if (Array.isArray(data) && data.length > 0) {
          incomeData.forEach(({ incomeCategory, amount, incomeDate }) => {
            console.log({ incomeCategory, amount, incomeDate }); // Log each processed item
            if (!isNaN(parseFloat(amount)) && isFinite(amount)) {
              // Assuming 'date' is stored in Firestore as YYYY-MM-DD format
              const incomeYearMonth = incomeDate.slice(0, 7); // Extract YYYY-MM part
              const monthIndex = lastSixMonths.indexOf(incomeYearMonth);
              if (monthIndex !== -1 && monthlyIncome[incomeCategory]) {
                monthlyIncome[incomeCategory][monthIndex] += parseFloat(amount);
                total += parseFloat(amount);
              }
            } else {
              console.warn("Invalid amount detected", { incomeCategory, amount, incomeDate });
            }
          });
        } else {
          console.warn("No income data found");
        }
  
        const datasets = Object.keys(monthlyIncome).map((incomeCategory, index) => {
            // Cycle through the colors array based on the category index
            const color = colors[index % colors.length];
            return {
              label: incomeCategory,
              data: monthlyIncome[incomeCategory],
              borderColor: color,
              backgroundColor: `${color}80`, // Add transparency to the fill color
              borderWidth: 2,
              tension: 0.4, // Smoothen the line
            };
          });
  
        setChartData(prevData => ({
          ...prevData,
          datasets,
        }));
  
        setTotalIncome(total);
      };
  
      fetchIncome();
    }, [data]);

    return (
      <div className="flex flex-col items-center bg-white rounded-lg p-5 gap-3">
      <div className="text-center">
          <p className="text-3xl text-blue-900">${totalIncome.toFixed(2)}</p>
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
    '#E63946', // Bright red
    '#F4A261', // Sandy brown, replaces very light blue
    '#006D77', // Darker teal, replaces light teal
    '#457B9D', // Dull blue
    '#1D3557', // Dark blue
    '#F4A261', // Sandy brown
    '#2A9D8F', // Teal
    '#E9C46A', // Yellow
    '#264653', // Dark cyan
  ];
  


export default MonthlyIncome;