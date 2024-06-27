import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const ExpensePieChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        // Use a refined color palette
        const colorPalette = [
            '#0D1F2D', // Very dark navy, almost black
            '#003366', // Dark blue
            '#336699', // Bluish
            '#6699CC', // Soft blue
            '#99CCFF', // Light blue
            '#FFCC00', // Gold for high contrast
            '#FF9900', // Bright orange
            '#FF6600', // Deep orange
            '#CC3300',
            // Add more colors as needed
        ];

        // Check if there's data
        const hasData = Array.isArray(data) && data.length > 0;
        const aggregatedData = hasData ? data.reduce((acc, { category, amount }) => {
            acc[category] = (acc[category] || 0) + amount;
            return acc;
        }, {}) : {'No Data': 1}; // Default object for no data

        // Convert aggregated data to chart data arrays
        const categories = Object.keys(aggregatedData);
        const amounts = Object.values(aggregatedData);

        const chartConfig = {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: colorPalette,
                    borderColor: '#FFFFFF',
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Add this to make the chart responsive
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'bottom', // Place legend at the bottom
                        labels: {
                            boxWidth: 20,
                            padding: 20,
                            font: {
                                size: 14, // Adjust font size
                                family: 'Arial', // Use a font family if desired
                            },
                        },
                    },
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        // Initialize the chart
        const chart = new Chart(ctx, chartConfig);

        // Cleanup on unmount
        return () => chart.destroy();
    }, [data]); // Reacts to changes in `data`

    return (
        <div className="w-full aspect-w-1 aspect-h-1"> {/* Adjust the aspect ratio as needed */}
            <canvas ref={chartRef}></canvas>
        </div>
    );
};