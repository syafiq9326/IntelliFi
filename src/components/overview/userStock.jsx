import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';

import { CreateBalance, EditBalance, RetrieveBalance } from '../../firebase/stockportfolio';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';

import { FetchStockCurrentPrice } from '../../firebase/stockapi';
import { useColorScheme } from "../profile/useColorScheme"; // Import the color scheme hook

export const UserStockTimeSeriesChart = ({ stocks }) => {
    const { currentUser } = useAuth();
    const [chartData, setChartData] = useState(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
    const currentYear = currentDate.getFullYear();
    const userId = currentUser.uid;

    const [sumCurrentPrice, setTotalPrice] = useState(0);

    const { isDark } = useColorScheme(); // Get the dark mode state

    useEffect(() => {
        let sum = 0;
        const fetchStockPrices = async () => {
            for (const stock of stocks) {
                try {
                    const priceData = await FetchStockCurrentPrice(stock.stockSymbol);
                    const currentPrice = priceData.c;
                    sum += currentPrice * stock.stockQuantity;
                    console.log("total current price:", sum);

                } catch (error) {
                    console.error('Error fetching price for', stock.symbol, ':', error);
                }
            }
            setTotalPrice(sum.toFixed(2)); // Fixing to 2 decimal places
        };

        fetchStockPrices();
    }, [stocks]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if balance data exists for current month and year for specific user
                const existingBalance = await RetrieveBalance(db, userId, currentYear, currentMonth);
                console.log("hiii", currentDate, currentMonth, currentYear, userId, existingBalance);

                if (existingBalance === undefined || existingBalance === null) {
                    // If balance data doesn't exist, create new balance data
                    console.log("balance for month and year dont exist yet");
                    const newBalanceData = {
                        userId: userId,
                        year: currentYear,
                        month: currentMonth,
                        price: sumCurrentPrice // Set initial price here
                    };
                    await CreateBalance(db, newBalanceData);
                } else {
                    // If balance data exists, update the existing balance
                    console.log("balance for month and year exist already");
                    const updatedData = {
                        price: sumCurrentPrice
                    };
                    await EditBalance(db, userId, currentYear, currentMonth, updatedData);
                }

                // Retrieve balance data for the last 6 months
                const chartData = await fetchChartData(db, userId, currentYear, currentMonth);
                setChartData(chartData);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error here, e.g., show an error message to the user
            }
        };

        fetchData();
    }, [db, userId, currentYear, currentMonth, sumCurrentPrice]); // Dependency array to run effect when dependencies change


    const fetchChartData = async (db, userId, currentYear, currentMonth) => {
        const sixMonthsAgo = currentMonth - 5 <= 0 ? 12 + (currentMonth - 5) : currentMonth - 5;
        const yearOffset = currentMonth - 5 <= 0 ? currentYear - 1 : currentYear;

        const chartData = [];

        for (let i = 0; i < 6; i++) {
            const month = sixMonthsAgo + i > 12 ? sixMonthsAgo + i - 12 : sixMonthsAgo + i;
            const year = sixMonthsAgo + i > 12 ? yearOffset + 1 : yearOffset;

            const balance = await RetrieveBalance(db, userId, year, month);
            // console.log("balance", balance.price);
            chartData.push({
                time: `${year}-${month < 10 ? '0' + month : month}`,
                value: balance && balance.price !== null ? balance.price : 0
            });
        }

        return chartData;
    };

    if (!chartData) return <div>Loading...</div>;

     return (
        <div>
            <p className="text-2xl font-bold mr-2" style={{ color: isDark ? 'white' : 'black' }}>
                My Total Stocks: ${Math.abs(sumCurrentPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p><br />
            <div>
                <Line
                    data={{
                        labels: chartData.map(entry => entry.time),
                        datasets: [
                            {
                                label: 'Total Stock Holding Past 6 Months',
                                data: chartData.map(entry => entry.value),
                                fill: true, // Fill the area under the line
                                backgroundColor: isDark ? 'rgba(75, 192, 192, 0.2)' : 'rgba(75, 192, 192, 0.2)', // Gradient covering at the bottom
                                borderColor: isDark ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 1)', // Darker line color
                                tension: 0.1
                            }
                        ]
                    }}
                    options={{
                        scales: {
                            x: {
                                grid: {
                                    display: false // Remove x grid
                                },
                                ticks: {
                                    color: isDark ? 'white' : 'black' // Customize x-axis label color based on dark mode
                                }
                            },
                            y: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Custom grid color based on dark mode
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Custom grid border color based on dark mode
                                    borderWidth: 1 // Set grid border width
                                },
                                ticks: {
                                    color: isDark ? 'white' : 'black', // Customize y-axis label color based on dark mode
                                    callback: function (value, index, values) {
                                        return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 0 }); // Format y-axis labels as currency
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: isDark ? 'white' : 'black' // Customize legend label color based on dark mode
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};






