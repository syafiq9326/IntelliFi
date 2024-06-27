import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';

import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';
import { AddUserCash, EditUserCash, RetrieveUserCash } from '../../firebase/cash';

import { CaptionsOff } from 'lucide-react';
import { AddUserWorth, EditUserWorth, RetrieveUserWorth } from '../../firebase/networth';
import { useColorScheme } from "../profile/useColorScheme";

export const UserNetWorthTimeSeries = ({sumCurrentPrice}) => {
    const { currentUser } = useAuth();
    const [chartData, setChartData] = useState(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
    const currentYear = currentDate.getFullYear();
    const userId = currentUser.uid;

    const [sumUserCash, setUserCash] = useState(0);
    const { isDark } = useColorScheme();

    useEffect(() => {
        const fetchCashData = async () => {
            try {
                //fetch total cash from total cash firebase table based on the date to set total accumulated cash for the month
                const sumCash = await RetrieveUserCash(db, userId, currentYear, currentMonth);
                console.log("total cash for dmy for user worth: ", currentDate, currentMonth, currentYear, userId, sumCash);
                setUserCash(sumCash.totalcash);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error here, e.g., show an error message to the user
            }
        };

        const fetchData = async () => {
            try {
                // Check if net worth data exists for current month and year for specific user
                const existingBalance = await RetrieveUserWorth(db, userId, currentYear, currentMonth);
                console.log("hiii", currentDate, currentMonth, currentYear, userId, existingBalance);

                if (existingBalance === undefined || existingBalance === null) {
                    // If balance data doesn't exist, create new balance data
                    console.log("balance for month and year dont exist yet");
                    const newBalanceData = {
                        userId: userId,
                        year: currentYear,
                        month: currentMonth,
                        total: Number(sumUserCash) + Number(sumCurrentPrice) // Set initial price here
                    };
                    await AddUserWorth(db, newBalanceData);
                } else {
                    // If balance data exists, update the existing balance
                    console.log("balance for month and year exist already");
                    const updatedData = {
                        total: Number(sumUserCash) + Number(sumCurrentPrice) // Set initial price here

                    };
                    await EditUserWorth(db, userId, currentYear, currentMonth, updatedData);
                }

                // Retrieve balance data for the last 6 months
                const chartData = await fetchChartData(db, userId, currentYear, currentMonth);
                setChartData(chartData);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error here, e.g., show an error message to the user
            }
        };

        fetchCashData();
        fetchData();
    }, [db, userId, currentYear, currentMonth, sumUserCash, sumCurrentPrice]); // Dependency array to run effect when dependencies change

    const fetchChartData = async (db, userId, currentYear, currentMonth) => {
        const sixMonthsAgo = currentMonth - 5 <= 0 ? 12 + (currentMonth - 5) : currentMonth - 5;
        const yearOffset = currentMonth - 5 <= 0 ? currentYear - 1 : currentYear;

        const chartData = [];

        for (let i = 0; i < 6; i++) {
            const month = sixMonthsAgo + i > 12 ? sixMonthsAgo + i - 12 : sixMonthsAgo + i;
            const year = sixMonthsAgo + i > 12 ? yearOffset + 1 : yearOffset;

            const balance = await RetrieveUserWorth(db, userId, year, month);
            chartData.push({
                time: `${year}-${month < 10 ? '0' + month : month}`,
                value: balance && balance.total !== null ? balance.total : 0
            });
        }

        return chartData;
    };

    if (!chartData) return <div>Loading...</div>;

    return (
        <div>
            {/* <p className="text-2xl font-bold mr-2 text-gray-900">
                My Total Net Worth: ${Math.abs(80000).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p><br /> */}
            <div>
                <Line
                    data={{
                        labels: chartData.map(entry => entry.time),
                        datasets: [
                            {
                                label: 'Total Net Worth Accumulated',
                                data: chartData.map(entry => entry.value),
                                fill: true, // Fill the area under the line
                                backgroundColor: isDark ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 165, 0, 0.2)', // Dark mode and light mode background color
                                borderColor: isDark ? 'rgb(255, 165, 0)' : 'rgb(255, 165, 0)', // Dark mode and light mode border color
                                tension: 0.1
                            }
                        ]
                    }}
                    options={{
                        scales: {
                            x: {
                                grid: {
                                    display: false, // Remove x grid
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Color of the x-axis grid lines
                                },
                                ticks: {
                                    color: isDark ? 'white' : 'black' // Color of the x-axis labels
                                }
                            },
                            y: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Color of the y-axis grid lines
                                },
                                ticks: {
                                    color: isDark ? 'white' : 'black' // Color of the y-axis labels
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                bodyFont: {
                                    color: isDark ? 'white' : 'black'
                                }
                            },
                            legend: {
                                labels: {
                                    color: isDark ? 'white' : 'black' // Change legend label color here
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};