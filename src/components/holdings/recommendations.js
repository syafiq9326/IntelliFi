import React, { useState, useEffect, useRef } from 'react';
import { GetRecommendations } from '../../firebase/stockapi';
import { GetStocks } from '../../firebase/stock';
import Chart from 'chart.js/auto';
// import DonutChart from 'chart.js/auto';

import { CompanyLogoComponent } from './modalStock';

//test method to get by specific symbol
export const Recommendations = ({ stockSymbol }) => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await GetRecommendations(stockSymbol);
                setRecommendations(data);
                console.log('Recommendations:', data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, [stockSymbol]); //run whenever value of stockSymbol changes

    return (
        <div>
            <h2>Recommendations</h2>
            <ul>
                (
                <li>Symbol: {recommendations.symbol}</li>
                <li> Period: {recommendations.period}</li>
                <li>Buy: {recommendations.buy}</li>
                <li>Hold: {recommendations.hold}</li>
                <li>Sell: {recommendations.sell}</li>
                )
            </ul>
        </div>
    );
}



//find which stock in my porfolio has the highest buy rating
export const TopBuySell = ({ stocks }) => {
    // Get all stocks' symbol in my portfolio
    const symbols = stocks.map(stock => stock.stockSymbol);

    // State variables to hold the highest buy recommendation and its symbol
    const [highestBuy, setHighestBuy] = useState(null);
    const [highestBuySymbol, setHighestBuySymbol] = useState(null);
    const [highestSell, setHighestSell] = useState(null);
    const [highestSellSymbol, setHighestSellSymbol] = useState(null);
    const [percentage, setPercentage] = useState(null);

    // Function to fetch recommendations for each symbol and find the highest buy recommendation
    const fetchRecommendationsForSymbols = async () => {
        try {
            let maxBuy = 0;
            let maxBuySymbol = '';
            let maxSell = 0;
            let maxSellSymbol = '';

            let sellQty = 0;
            let holdQty = 0;


            // Iterate over the symbol list
            for (const symbol of symbols) {
                // Call GetRecommendations function for each symbol
                const recommendations = await GetRecommendations(symbol);
                console.log(`Recommendations for buy  ${symbol}:`, recommendations.buy);
                const buyRecommendation = recommendations.buy ||0;
                const sellRecommendation = recommendations.sell || 0; // If no recommendation found, default to 0
                if (sellRecommendation > maxSell) {
                    maxSell = sellRecommendation;
                    maxSellSymbol = symbol;
                }
                if (buyRecommendation > maxBuy) {
                    maxBuy = buyRecommendation;
                    maxBuySymbol = symbol;
                }

                
                const sellQtyForChosenStock = await GetRecommendations(maxBuySymbol).buy || 0;
                const holdQtyForChosenStock = await GetRecommendations(maxBuySymbol).hold || 0;
                sellQty = sellQtyForChosenStock;
                holdQty = holdQtyForChosenStock;
                console.log(`Recommendations for selling best stock ${maxBuySymbol}, sellQty: ${sellQty}, buy, ${highestBuy}, holdQty ${holdQty}`);
            }

            // Update state with the highest buy recommendation and its symbol
            setHighestBuy(maxBuy);
            setHighestBuySymbol(maxBuySymbol);
            setHighestSell(maxSell);
            setHighestSellSymbol(maxSellSymbol);
            console.log('Highest Buy:', maxBuy, 'Symbol:', maxBuySymbol);
            console.log('Top Sell:', maxSell, 'Symbol:', maxSellSymbol);
            console.log('Hold:', maxSell, 'Symbol:', maxSellSymbol);


            const calculatedPercentage = ((maxBuy / (maxBuy + sellQty + holdQty)) * 100).toFixed(2);
            // Update state with the calculated percentage
            setPercentage(calculatedPercentage);

        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    // Fetch recommendations when component mounts or when symbols change
    useEffect(() => {
        fetchRecommendationsForSymbols();
    }, [symbols]);


    // Render the component content
    return (
        <div>
            <p className="text-lg font-bold text-green-600">Top Keep In My Portfolio</p><br />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CompanyLogoComponent stockSymbol={highestBuySymbol} /><br />
            </div>

            <br />  
            <li>
                <span>

                    <span className="text-green-600 font-bold text-3xl">
                        {percentage}%
                    </span>
                    { } of analysts recommend to increase your {highestBuySymbol} holdings
                </span>
            </li>

        </div>
    );
};

//find which stock in my porfolio has the highest buy rating
export const TopSell = ({ stocks }) => {
    // Get all stocks' symbol in my portfolio
    const symbols = stocks.map(stock => stock.stockSymbol);

    // State variables to hold the highest buy recommendation and its symbol
    const [highestBuy, setHighestBuy] = useState(null);
    const [highestBuySymbol, setHighestBuySymbol] = useState(null);
    const [highestSell, setHighestSell] = useState(null);
    const [highestSellSymbol, setHighestSellSymbol] = useState(null);
    const [percentage, setPercentage] = useState(null);

    // Function to fetch recommendations for each symbol and find the highest buy recommendation
    const fetchRecommendationsForSymbols = async () => {
        try {
            let maxBuy = 0;
            let maxBuySymbol = '';
            let maxSell = 0;
            let maxSellSymbol = '';
            let holdQty = 0;

            let buyQty = 0;
            // Iterate over the symbol list
            for (const symbol of symbols) {
                // Call GetRecommendations function for each symbol
                const recommendations = await GetRecommendations(symbol);
                console.log(`Recommendations for selling ${symbol}:`, recommendations.sell);
                const buyRecommendation = recommendations.buy || 0; // If no recommendation found, default to 0
                const sellRecommendation = recommendations.sell || 0; // If no recommendation found, default to 0
                if (sellRecommendation > maxSell) {
                    maxSell = sellRecommendation;
                    maxSellSymbol = symbol;
                }
                if (buyRecommendation > maxBuy) {
                    maxBuy = buyRecommendation;
                    maxBuySymbol = symbol;
                }

                const buyQtyForChosenStock = await GetRecommendations(maxSellSymbol).buy || 0;
                const holdQtyForChosenStock = await GetRecommendations(maxSellSymbol).hold || 0;
                buyQty = buyQtyForChosenStock;
                holdQty = holdQtyForChosenStock;
                console.log(`Recommendations for buy ${maxSellSymbol}, buyQty: ${buyQty}`);

            }

            // Update state with the highest buy recommendation and its symbol
            setHighestBuy(maxBuy);
            setHighestBuySymbol(maxBuySymbol);
            setHighestSell(maxSell);
            setHighestSellSymbol(maxSellSymbol);
            console.log('Highest Buy:', maxBuy, 'Symbol:', maxBuySymbol);
            console.log('Top Sell:', maxSell, 'Symbol:', maxSellSymbol);

            const calculatedPercentage = ((maxSell / (buyQty + maxSell + holdQty)) * 100).toFixed(2);
            // Update state with the calculated percentage
            setPercentage(calculatedPercentage);

        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    // Fetch recommendations when component mounts or when symbols change
    useEffect(() => {
        fetchRecommendationsForSymbols();
    }, [symbols]);


    // Render the component content
    return (
        <div>
            <p className="text-lg font-bold text-red-600">Top Sell In My Portfolio</p><br />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CompanyLogoComponent stockSymbol={highestSellSymbol} /><br />
            </div>

            <br />
            <li>
                <span>

                    <span className="text-red-600 font-bold text-3xl">
                        {percentage}%
                    </span>
                    { } of analysts recommend to sell your {highestSellSymbol} holdings
                </span>
            </li>

        </div>
    );
};



// //find which stock in my porfolio has the highest buy rating
// export const TopSell = ({ stocks }) => {
//     // Get all stocks' symbol in my portfolio
//     const symbols = stocks.map(stock => stock.stockSymbol);

//     // State variables to hold the highest buy recommendation and its symbol

//     const [highestSell, setHighestSell] = useState(null);
//     const [highestSellSymbol, setHighestSellSymbol] = useState(null);

//     // Function to fetch recommendations for each symbol and find the highest buy recommendation
//     const fetchRecommendationsForSymbols = async () => {
//         try {

//             let maxSell = 0;
//             let maxSellSymbol = '';

//             // Iterate over the symbol list
//             for (const symbol of symbols) {
//                 // Call GetRecommendations function for each symbol
//                 const recommendations = await GetRecommendations(symbol);
//                 console.log(`Recommendations for ${symbol}:`, recommendations.buy);
//                 const sellRecommendation = recommendations.sell || 0; // If no recommendation found, default to 0
//                 // const sellRecommendation = recommendations.sell || 0; // If no recommendation found, default to 0
//                 if (sellRecommendation > maxSell) {
//                     maxSell = sellRecommendation;
//                     maxSellSymbol = symbol;
//                 }
//                 // if (sellRecommendation > maxSell) {
//                 //     maxSell = sellRecommendation;
//                 //     maxSellSymbol = symbol;
//                 // }
//             }

//             // Update state with the highest buy recommendation and its symbol
//             setHighestSell(maxSell);
//             setHighestSellSymbol(maxSellSymbol);
//             console.log('Top Sell:', maxSell, 'Symbol:', maxSellSymbol);

//         } catch (error) {
//             console.error('Error fetching recommendations:', error);
//         }
//     };

//     // Fetch recommendations when component mounts or when symbols change
//     useEffect(() => {
//         fetchRecommendationsForSymbols();
//     }, [symbols]);

//     // Render the component content
//     return (
//         <div>
//             <p className="text-lg font-bold text-red-600">Top Sell In My Portfolio</p>
//             <ul>
//                 <li>Sell: {highestSellSymbol} - {highestSell} / 50 analysts </li><br />
//             </ul>
//             <div style={{ display: 'flex', justifyContent: 'center' }}>
//                 <CompanyLogoComponent stockSymbol={highestSellSymbol} /><br />
//             </div>

//         </div>
//     );
// };




export const TimeChart = ({ data }) => {
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
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
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
    }, []);

    return (
        <div>
            <h2>Chart.js Example</h2>
            <canvas ref={chartContainer} width="400" height="400"></canvas>
        </div>
    );
};



export const DonutChart = ({ data, width, height }) => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartContainer.current) {
            const ctx = chartContainer.current.getContext('2d');

            // Destroy existing chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Create the new chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Highest Buy', 'Remaining'],
                    datasets: [{
                        data: data,
                        backgroundColor: ['#006400', '#152238'],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        centerText: {
                            text: data[0],
                            color: 'black',
                            fontStyle: 'normal',
                            fontFamily: 'Arial',
                            minFontSize: 40,
                            maxFontSize: 80
                        }
                    }
                }
            });
        }
        // Cleanup function to destroy chart instance on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, width, height]);

    return (
        <div style={{ width: width, height: height }}>
            <canvas ref={chartContainer} />
        </div>
    );
}; 