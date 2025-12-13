import React, { useEffect, useRef, useState } from "react";
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

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- IMAGE MAPPING ---
// NOTE: Replace these placeholder paths with the actual paths to your 5 SVG images.
const HOUSE_IMAGE_PATHS = {
    Mughals: "/images/house_textures/mughals_texture.svg",
    Aryans: "/images/house_textures/aryans_texture.svg",
    Vikings: "/images/house_textures/vikings_texture.svg",
    Spartans: "/images/house_textures/spartans_texture.svg",
    Rajputs: "/images/house_textures/rajputs_texture.svg",
};

// --- DEMO DATA ---
const DEMO_SCORES = [
    { name: "Spartans", points: 3950 },
    { name: "Mughals", points: 3000 },
    { name: "Vikings", points: 4200 },
    { name: "Rajputs", points: 2800 },
    { name: "Aryans", points: 3600 },
];

// Stores the loaded texture patterns
let housePatterns = {}; 

/**
 * Custom Chart.js Plugin to create Image Patterns for bars.
 * This function loads the images and generates a pattern object compatible with Chart.js.
 */
const patternPlugin = {
    id: 'housePatternPlugin',
    beforeDatasetDraw: (chart, args, options) => {
        const { ctx, chartArea, data } = chart;
        const dataset = data.datasets[0];
        
        // Ensure patterns are ready
        if (Object.keys(housePatterns).length === 0 || !dataset.barBackgrounds) {
            return;
        }

        // Apply the generated patterns to the background colors
        dataset.backgroundColor = dataset.barBackgrounds.map(houseName => housePatterns[houseName] || 'gray');
    },
};

const ScoreboardChart = ({ scores = [] }) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const chartRef = useRef(null);

    // --- Image Loading and Pattern Generation ---
    useEffect(() => {
        // Function to load images and create patterns
        const loadImages = async () => {
             // Check if chart context is available
            if (!chartRef.current || !chartRef.current.ctx) {
                // If context is not ready, exit and wait for next render cycle
                return; 
            }

            const patternPromises = Object.keys(HOUSE_IMAGE_PATHS).map(houseName => {
                return new Promise(resolve => {
                    const img = new Image();
                    img.onload = () => {
                        // Create a pattern using the image
                        const pattern = chartRef.current.ctx.createPattern(img, 'repeat');
                        housePatterns[houseName] = pattern;
                        resolve(true);
                    };
                    img.onerror = () => {
                        // Use a fallback color if the image fails to load
                        housePatterns[houseName] = 'rgba(128, 128, 128, 0.9)'; 
                        resolve(false);
                    };
                    img.src = HOUSE_IMAGE_PATHS[houseName];
                });
            });

            await Promise.all(patternPromises);
            setImagesLoaded(true);
            
            // Force chart update after patterns are loaded
            if (chartRef.current) {
                chartRef.current.update();
            }
        };

        // Trigger loading only once after the component mounts and chartRef is set
        if (chartRef.current && !imagesLoaded) {
            loadImages();
        }
    }, [imagesLoaded]); 


    // Determine the source of scores: Use live data if available, otherwise use demo data.
    const chartScores = (scores && Array.isArray(scores) && scores.length > 0) ? scores : DEMO_SCORES;
    
    // Sort scores to show leader first
    const sortedScores = [...chartScores].sort((a, b) => b.points - a.points);
    
    const labels = sortedScores.map((house) => house.name);
    const dataPoints = sortedScores.map((house) => house.points);
    // Create a list of house names for the plugin to reference
    const barBackgrounds = sortedScores.map(house => house.name); 

    const data = {
        labels: labels,
        datasets: [
            {
                label: "House Points",
                data: dataPoints,
                // barBackgrounds is a custom property for our plugin to use
                barBackgrounds: barBackgrounds, 
                // Initial backgroundColor is a neutral fallback until images load
                backgroundColor: 'rgba(128, 128, 128, 0.9)', 
                borderColor: 'rgb(0, 0, 0)', 
                borderWidth: 3, 
                borderRadius: 0, 
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
            },
            // The custom plugin is referenced here
            housePatternPlugin: {}, 
        },
        layout: {
            padding: { top: 20, bottom: 20, left: 10, right: 10 }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 4500,
                border: { color: 'black', width: 3 },
                ticks: { stepSize: 500, color: 'black', font: { family: 'Montserrat', size: 14, weight: 'normal' }, padding: 10 },
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
            x: {
                border: { color: 'black', width: 3 },
                ticks: { color: 'black', font: { family: 'Montserrat', size: 14, weight: 'normal' }, padding: 10 },
                grid: { display: false },
            },
        },
    };

    // ALWAYS RENDER: The component renders immediately with fallback color (grey) 
    // and updates once the SVGs load and the plugin applies the patterns.

    return (
        <div className="w-full h-full font-['Montserrat'] min-h-[400px]"> 
            <Bar 
                ref={chartRef} 
                options={options} 
                data={data} 
                // Pass the custom plugin to the Bar component
                plugins={[patternPlugin]} 
            />
        </div>
    );
};

export default ScoreboardChart;