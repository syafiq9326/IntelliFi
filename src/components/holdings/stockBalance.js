import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';

import { CreateBalance, EditBalance, RetrieveBalance } from '../../firebase/stockportfolio';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';

import { FetchStockCurrentPrice } from '../../firebase/stockapi';

//update timseries chart for optimised api call
export const StockTimeSeriesChart = ({ sumCurrentPrice }) => {
    const { currentUser } = useAuth();
    const [chartData, setChartData] = useState(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
    const currentYear = currentDate.getFullYear();
    const userId = currentUser.uid;

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
            <div>
                <Line
                    data={{
                        labels: chartData.map(entry => entry.time),
                        datasets: [
                            {
                                label: 'Total Stock Holding Past 6 Months',
                                data: chartData.map(entry => entry.value),
                                fill: true, // Fill the area under the line
                                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Gradient covering at the bottom
                                borderColor: 'rgba(75, 192, 192, 1)', // Darker line color
                                tension: 0.1
                            }
                        ]
                    }}
                    options={{
                        scales: {
                            y: {
                                grid: {
                                    display: false // Remove y grid
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
    
};







export const StockTimeSeriesChart3 = ({ stocks }) => {
    const { currentUser } = useAuth();
    const [chartData, setChartData] = useState(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
    const currentYear = currentDate.getFullYear();
    const userId = currentUser.uid;

    const [sumCurrentPrice, setTotalPrice] = useState(0);

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
            {/* <h2>Time Series Chart</h2> */}
            <div>
                <Line
                    data={{
                        labels: chartData.map(entry => entry.time),
                        datasets: [
                            {
                                label: 'Total Stock Holding Past 6 Months',
                                data: chartData.map(entry => entry.value),
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }
                        ]
                    }}
                />
            </div>
        </div>
    );
};



//sample
export const StockTimeSeriesChart2 = () => {
    const timeSeriesData = [
        { time: '2023-11', value: 2500 },
        { time: '2023-12', value: 3000 },
        { time: '2024-01', value: 2000 },
        { time: '2024-02', value: 500 },
        { time: '2024-03', value: 2000 },
        { time: '2024-04', value: 2500 },

    ];

    const chartData = {
        labels: timeSeriesData.map(entry => entry.time),
        datasets: [
            {
                label: 'Time Series Data',
                data: timeSeriesData.map(entry => entry.value),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <div>
            <h2>Time Series Chart</h2>
            {/* <div style={{ width: '500px', height: '400px' }}> */}
            <div>
                <Line data={chartData} />
            </div>
        </div>
    );
};



export const StockBalanceChart = ({ initialInvestment, currentInvestment }) => {
    const chartContainer = useRef(null); // Reference to the chart container
    const [chartInstance, setChartInstance] = useState(null); // State to hold the chart instance

    useEffect(() => {
        if (chartContainer.current) {
            if (chartInstance) {
                // Destroy the existing chart instance before creating a new one
                chartInstance.destroy();
            }

            const ctx = chartContainer.current.getContext('2d');

            const newChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Initial Investment', 'Current Investment'],
                    datasets: [{
                        label: 'Initial Investment',
                        data: [initialInvestment, 0],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue color for initial investment bar
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Current Investment',
                        data: [0, currentInvestment],
                        backgroundColor: 'rgba(0, 100, 0, 0.2)', // Dark green color for current investment bar
                        borderColor: 'rgba(0, 100, 0, 1)',
                        borderWidth: 1
                    }, {
                        type: 'line',
                        label: 'Investment Value',
                        data: [initialInvestment, currentInvestment],
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)', // Green color for the line
                        tension: 0.1,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Set the chart instance in state
            setChartInstance(newChartInstance);
        }

        // Cleanup function to destroy the chart instance when component unmounts
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [initialInvestment, currentInvestment]);

    return (
        <div>
            {/* <h2>Investment Value Comparison</h2> */}
            {/* Set width and height using inline styles */}
            <canvas ref={chartContainer} style={{ width: '300px', height: '131px' }}></canvas>
        </div>
    );
};







