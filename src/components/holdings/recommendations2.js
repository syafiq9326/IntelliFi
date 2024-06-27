import React, { useState, useEffect, useRef } from 'react';
import { GetRecommendations2 } from '../../firebase/stockapi';
import { GetStocks } from '../../firebase/stock';

import { CompanyLogoComponent } from './modalStock';
import { Chart, registerables } from 'chart.js';


import { Bar } from 'react-chartjs-2';

const RecommendationChart2 = ({ recommendations }) => {

    const defaultData = [0, 0, 0, 0]; // Default data for missing or improperly structured recommendations

    // Ensure recommendations array is not null or undefined
    if (!recommendations || !Array.isArray(recommendations)) {
        console.log('Invalid recommendations data received.');
        return null; // Return null if recommendations data is invalid
    }

    // Extract data for each recommendation type for each period
    const data = {
        labels: recommendations.map(recommendation => recommendation.period),
        datasets: [
            {
                label: 'Strong Buy',
                data: recommendations.map(recommendation => recommendation.strongBuy || 0),
                backgroundColor: 'rgba(33, 150, 83, 1)',
            },
            {
                label: 'Buy',
                data: recommendations.map(recommendation => recommendation.buy || 0),
                backgroundColor: 'rgba(33, 206, 153, 1)',
            },
            {
                label: 'Hold',
                data: recommendations.map(recommendation => recommendation.hold || 0),
                backgroundColor: 'rgba(255, 193, 7, 1)',
            },
            {
                label: 'Sell',
                data: recommendations.map(recommendation => recommendation.sell || 0),
                backgroundColor: 'rgba(255, 87, 34, 1)',
            },
            {
                label: 'Strong Sell',
                data: recommendations.map(recommendation => recommendation.strongSell || 0),
                backgroundColor: 'rgba(244, 67, 54, 1)',
            },
        ],
    };


    const options = {
        plugins: {
            title: {
                display: true,
                color: 'black',
                font: {
                    size: 5,
                },
            },
            legend: {
                labels: {
                    color: 'black', // Use your theme color here
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: 'black', // Use your theme color here
                },
            },
            y: {
                stacked: true,
                grid: {
                    display: false,
                    drawBorder: false,
                    color: 'gray', // Use a color that makes sense with your theme
                },
                ticks: {
                    color: 'white', // Use your theme color here
                },
            },
        },
    };

    return (
        <div >
            <Bar data={data} options={options} />
        </div>
    );


};

export const StockAnalysis = ({ stockSymbol }) => {
    // const [stockSymbol, setStockSymbol] = useState('AAPL');
    const [recommendations, setRecommendations] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                console.log("analysing", stockSymbol)
                const data = await GetRecommendations2(stockSymbol);
                setRecommendations(data);
                console.log('Recommendations hihi:', data);
            } catch (error) {
                console.error('Error fetching recommendations hi:', error);
            }
        };

        fetchRecommendations();
    }, [stockSymbol]); // Run whenever value of stockSymbol changes

    return (
        <div>
            {/* Render RecommendationChart with fetched data */}
            <div className="flex items-center justify-center">
                <p className="text-lg font-bold text-center" style={{ color: "black" }}>{stockSymbol} Analyst Recommendations</p>
            </div>

            {<RecommendationChart2 recommendations={recommendations} />}
        </div>
    );
};



export const GetStockAnalysisModal = ({ stocks }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrev = () => {
        setCurrentIndex(prev => prev === 0 ? stocks.length - 1 : prev - 1);
    };

    const goToNext = () => {
        setCurrentIndex(prev => prev === stocks.length - 1 ? 0 : prev + 1);
    };

    return (
        <div className="flex flex-col items-center" >
            <div className="relative w-full flex items-center" >
                <button
                    onClick={goToPrev}
                    className="absolute left-0 z-10 hover:bg-opacity-75 rounded-full p-4 cursor-pointer text-5xl"
                    aria-label="Previous"
                >
                    ‹
                </button>
                <div key={stocks[currentIndex]?.stockSymbol} className="w-full justify-center" >
                    <div >
                        {/* Render StockAnalysis component with stockSymbol */}
                        <StockAnalysis stockSymbol={stocks[currentIndex]?.stockSymbol} />
                        {/* <StockAnalysis stockSymbol='AAPL' /> */}

                    </div>
                </div>
                <button
                    onClick={goToNext}
                    className="absolute right-0 z-10 hover:bg-opacity-75 rounded-full p-4 cursor-pointer text-5xl"
                    aria-label="Next"
                >
                    ›
                </button>
            </div>
        </div>
    );
};
