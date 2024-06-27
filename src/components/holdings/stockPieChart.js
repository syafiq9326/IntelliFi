import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';


// export const StockPieChart = ({ data }) => {
//     const chartRef = useRef(null);

//     useEffect(() => {
//         const ctx = chartRef.current.getContext('2d');

//         const colorPalette = [
//             '#152238', // Dark Blue
//             '#204060', // Deep Blue
//             '#2B496C', // Midnight Blue
//             '#375885', // Navy Blue
//             '#42609F', // Royal Blue
//             '#4D6AA9', // Sapphire Blue
//             '#5873B3', // Cobalt Blue
//         ];

//         const chart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: data.map(stock => stock.stockSymbol),
//                 datasets: [{
//                     label: 'Stock Distribution',
//                     data: data.map(stock => stock.stockQuantity),
//                     backgroundColor: colorPalette, // Using the first color from the palette for all bars
//                 }],
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });

//         return () => {
//             chart.destroy();
//         };
//     }, [data]);

//     return <canvas ref={chartRef} style={{ width: '200px', height: '200px' }} />;
// };


export const StockPieChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const colorPalette = [
            '#152238', // Dark Blue
            '#1E3A5C', // Deep Blue
            '#29547F', // Midnight Blue
        ];

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(stock => stock.stockSymbol),
                datasets: [{
                    data: data.map(stock => stock.stockQuantity),
                    backgroundColor: colorPalette,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right', // Position legend to the left
                    },
                    title: {
                        display: true,
                        text: 'Distribution Of Stocks', // Your desired title text here
                        font: {
                            size: 20, // Adjust the font size as needed
                            weight: 'bold' // Set font weight if desired
                        },
                        color: 'black' , // Set title color if desired
                        align: 'center' , // Center the title
                        padding: 20 // Adjust the padding as needed
                    },
                },
            }
        });

        return () => {
            chart.destroy();
        };
    }, [data]);

    return (
        <div>
            {/* Set width and height using inline styles */}
            <canvas ref={chartRef} ></canvas>

        </div>
    );
};
