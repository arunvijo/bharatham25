import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components (Crucial for Chart.js to work)
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const HOUSE_COLORS = {
    Mughals: "rgba(205, 105, 50, 0.9)",
    Aryans: "rgba(215, 185, 75, 0.9)",
    Vikings: "rgba(90, 190, 105, 0.9)",
    Spartans: "rgba(200, 70, 65, 0.9)",
    Rajputs: "rgba(70, 140, 165, 0.9)",
};

const ScoreboardChart = ({ scores = [] }) => {
    
    if (!scores || !Array.isArray(scores) || scores.length === 0) {
        return (
            <div className="text-center p-4 text-stone-600 font-['Montserrat']">
                No score data available to display the leaderboard.
            </div>
        );
    }

    const sortedScores = [...scores].sort((a, b) => b.points - a.points);

    const labels = sortedScores.map((house) => house.name);
    const dataPoints = sortedScores.map((house) => house.points);
    const backgroundColors = sortedScores.map(house => HOUSE_COLORS[house.name] || 'rgba(128, 128, 128, 0.9)');

    // --- CRITICAL FIX: Calculate Dynamic Y-Axis Max ---
    const maxScore = Math.max(...dataPoints, 0); // Find the highest score
    // Set max to 10% more than the highest score, or a minimum of 100 if scores are very low/zero
    const yAxisMax = Math.max(100, maxScore * 1.1);
    const stepSize = yAxisMax > 500 ? Math.round(yAxisMax / 5) : 50;
    // --------------------------------------------------

    const data = {
        labels: labels,
        datasets: [
            {
                label: "House Points",
                data: dataPoints,
                backgroundColor: backgroundColors,
                borderColor: 'rgb(0, 0, 0)', 
                borderWidth: 2, 
                borderRadius: 6, 
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                titleColor: 'white',
                bodyColor: 'white',
                padding: 10,
            }
        },
        layout: {
            padding: { top: 20, bottom: 20, left: 10, right: 10 }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: yAxisMax, // <--- APPLIED THE DYNAMIC MAX
                
                border: { color: 'black', width: 3 }, 
                ticks: {
                    stepSize: stepSize, // <--- APPLIED THE DYNAMIC STEP SIZE
                    color: 'black',
                    font: { family: 'Montserrat', size: 14, weight: 'normal' },
                    padding: 10,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.15)', 
                }
            },
            x: {
                border: { color: 'black', width: 3 },
                ticks: {
                    color: 'black',
                    font: { family: 'Montserrat', size: 14, weight: 'normal' },
                    padding: 10,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="w-full h-full font-['Montserrat'] min-h-[400px]"> 
            <Bar options={options} data={data} />
        </div>
    );
};

export default ScoreboardChart;