import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';
import { useColorScheme } from "../profile/useColorScheme"; // Import the color scheme hook


import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';
import { AddUserCash, EditUserCash, RetrieveUserCash } from '../../firebase/cash';

import { GetAllIncomeTxn } from '../../firebase/income';
import { CaptionsOff } from 'lucide-react';

export const UserCashTimeSeries = () => {
    const { currentUser } = useAuth();
    const [chartData, setChartData] = useState(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
    const currentYear = currentDate.getFullYear();
    const userId = currentUser.uid;
    const { isDark } = useColorScheme(); // Get the dark mode state

    const [sumUserCash, setUserCash] = useState(0);

    useEffect(() => {
        // Fetch income transactions
        GetAllIncomeTxn(db, userId)
            .then(incomeTxns => {
                // Calculate the sum of income transactions' amounts
                const sumUserCash = incomeTxns.reduce((sum, txn) => sum + txn.amount, 0);
                setUserCash(sumUserCash);
            })
            .catch(error => {
                // Handle errors
                console.error("Error fetching income transactions:", error);
            });
    }, [userId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if totalCash data exists for current month and year for specific user
                const existingCash = await RetrieveUserCash(db, userId, currentYear, currentMonth);

                if (existingCash === undefined || existingCash === null) {
                    // If balance data doesn't exist, create new balance data
                    const newBalanceData = {
                        userId: userId,
                        year: currentYear,
                        month: currentMonth,
                        totalcash: sumUserCash // Set initial cash balance here (retrieved from income side)
                    };
                    await AddUserCash(db, newBalanceData);
                } else {
                    // If balance data exists, update the existing balance
                    const updatedData = {
                        totalcash: sumUserCash
                    };
                    await EditUserCash(db, userId, currentYear, currentMonth, updatedData);
                }

                // Retrieve cash data for the last 6 months
                const chartData = await fetchChartData(db, userId, currentYear, currentMonth);
                setChartData(chartData);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error here, e.g., show an error message to the user
            }
        };

        fetchData();
    }, [db, userId, currentYear, currentMonth, sumUserCash]); // Dependency array to run effect when dependencies change

    const fetchChartData = async (db, userId, currentYear, currentMonth) => {
        const sixMonthsAgo = currentMonth - 5 <= 0 ? 12 + (currentMonth - 5) : currentMonth - 5;
        const yearOffset = currentMonth - 5 <= 0 ? currentYear - 1 : currentYear;

        const chartData = [];

        for (let i = 0; i < 6; i++) {
            const month = sixMonthsAgo + i > 12 ? sixMonthsAgo + i - 12 : sixMonthsAgo + i;
            const year = sixMonthsAgo + i > 12 ? yearOffset + 1 : yearOffset;

            const balance = await RetrieveUserCash(db, userId, year, month);
            chartData.push({
                time: `${year}-${month < 10 ? '0' + month : month}`,
                value: balance && balance.totalcash !== null ? balance.totalcash : 0
            });
        }

        return chartData;
    };

    if (!chartData) return <div>Loading...</div>;

    return (
        <div>
            <p className="text-2xl font-bold mr-2" style={{ color: isDark ? 'white' : 'black' }}>
                My Total Cash: ${Math.abs(sumUserCash).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p><br />
            <div>
                <Line
                    data={{
                        labels: chartData.map(entry => entry.time),
                        datasets: [
                            {
                                label: 'Total Cash Accumulated',
                                data: chartData.map(entry => entry.value),
                                fill: true, // Fill the area under the line
                                backgroundColor: isDark ? 'rgba(255, 0, 0, 0.2)' : 'rgba(128, 0, 128, 0.2)', // Red or purple theme with matching gradient covering at the bottom
                                borderColor: isDark ? 'rgb(255, 0, 0)' : 'rgb(128, 0, 128)', // Darker line color (red or purple)
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
                                    color: isDark ? 'white' : 'black', // Set x-axis label color based on dark mode
                                }
                            },
                            y: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Custom grid color based on dark mode
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Custom grid border color based on dark mode
                                    borderWidth: 1 // Set grid border width
                                },
                                ticks: {
                                    color: isDark ? 'white' : 'black', // Set y-axis label color based on dark mode
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
                                    color: isDark ? 'white' : 'black' // Set legend label color based on dark mode
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};