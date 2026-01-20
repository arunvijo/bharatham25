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

const HOUSE_GRADIENTS = {
    Mughals: { start: "rgba(188, 80, 18, 1)", end: "rgba(114, 39, 14, 0.9)" },
    Aryans: { start: "rgba(195, 173, 46, 1)", end: "rgba(186, 161, 42, 0.9)" },
    Vikings: { start: "rgba(73, 168, 86, 1)", end: "rgba(12, 81, 24, 0.9)" },
    Spartans: { start: "rgba(186, 48, 44, 1)", end: "rgba(84, 22, 20, 0.9)" },
    Rajputs: { start: "rgba(53, 126, 152, 1)", end: "rgba(32, 80, 105, 0.9)" },
};

const HOUSE_PATTERN_TINTS = {
    Mughals: "rgba(211, 168, 79, 1)",
    Aryans: "rgba(221, 214, 97, 1)",
    Vikings: "rgba(79, 158, 93, 1)",
    Spartans: "rgba(201, 111, 69, 1)",
    Rajputs: "rgba(90, 170, 186, 1)",
};

const ScoreboardChart = ({ scores = [] }) => {
    const chartRef = React.useRef(null);
    const patternImage = React.useRef(null);
    const mascotImages = React.useRef({});
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [mascotsLoaded, setMascotsLoaded] = React.useState(false);
    
    if (!scores || !Array.isArray(scores) || scores.length === 0) {
        return (
            <div className="text-center p-4 text-stone-600 font-['Montserrat']">
                No score data available to display the leaderboard.
            </div>
        );
    }
    
    const sortedScores = [...scores].sort((a, b) => b.points - a.points);

    // Load pattern image
    React.useEffect(() => {
        const img = new Image();
        img.onload = () => {
            patternImage.current = img;
            setImageLoaded(true);
        };
        img.onerror = () => {
            console.error('Failed to load pattern.png');
            setImageLoaded(true); // Continue without pattern
        };
        img.src = '/images/pattern.png';
    }, []);

    // Load mascot images for each house
    React.useEffect(() => {
        const houses = ['Mughals', 'Aryans', 'Vikings', 'Spartans', 'Rajputs'];
        let loadedCount = 0;
        
        houses.forEach(house => {
            const img = new Image();
            img.onload = () => {
                mascotImages.current[house] = img;
                loadedCount++;
                if (loadedCount === houses.length) {
                    setMascotsLoaded(true);
                }
            };
            img.onerror = () => {
                console.error(`Failed to load ${house.toLowerCase()}_mascot.png`);
                loadedCount++;
                if (loadedCount === houses.length) {
                    setMascotsLoaded(true);
                }
            };
            img.src = `/images/${house.toLowerCase()}_mascot.png`;
        });
    }, []);

    const labels = sortedScores.map((house) => house.name);
    const dataPoints = sortedScores.map((house) => house.points);

    const maxScore = Math.max(...dataPoints, 0);
    const yAxisMax = Math.max(100, maxScore * 1.1);
    const stepSize = yAxisMax > 500 ? Math.round(yAxisMax / 5) : 50;

    // Custom plugin to draw pattern overlay on bars
    const patternOverlayPlugin = {
        id: 'patternOverlay',
        beforeDatasetsDraw: (chart) => {
            // Draw mascots before bars so we can calculate needed space
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            
            meta.data.forEach((bar, index) => {
                const { x, y, width } = bar.getProps(['x', 'y', 'width'], true);
                const barWidth = width * 0.7;
                
                const houseName = sortedScores[index].name;
                const mascotImg = mascotImages.current[houseName];
                
                if (mascotImg) {
                    const maxMascotWidth = barWidth * 1.1;
                    const mascotAspectRatio = mascotImg.width / mascotImg.height;
                    let mascotWidth = maxMascotWidth;
                    let mascotHeight = mascotWidth / mascotAspectRatio;
                    
                    const mascotGap = 10;
                    const offsetRight = 15; // Offset to the right
                    const mascotX = (x - barWidth / 2) + (barWidth - mascotWidth) / 2 + offsetRight;
                    const mascotY = y - mascotHeight - mascotGap;
                    
                    ctx.save();
                    ctx.drawImage(mascotImg, mascotX, mascotY, mascotWidth, mascotHeight);
                    ctx.restore();
                }
            });
        },
        afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            
            meta.data.forEach((bar, index) => {
                const { x, y, width, height, base } = bar.getProps(['x', 'y', 'width', 'height', 'base'], true);
                
                // Reduce bar width by 30%
                const barWidth = width * 0.7;
                const barX = x - barWidth / 2;
                const barHeight = base - y;
                
                // Get house name for this bar
                const houseName = sortedScores[index].name;
                const gradientColors = HOUSE_GRADIENTS[houseName] || { 
                    start: 'rgba(128, 128, 128, 1)', 
                    end: 'rgba(100, 100, 100, 0.9)' 
                };
                
                // Create radial gradient background (from center to edges)
                const centerX = x; // Center of the bar
                const centerY = y + barHeight / 2; // Middle height of the bar
                const radius = Math.max(barWidth, barHeight) / 1.5; // Gradient radius
                
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, 0,           // Inner circle (center point, radius 0)
                    centerX, centerY, radius       // Outer circle (center point, calculated radius)
                );
                gradient.addColorStop(0, gradientColors.start);    // Center color (lighter)
                gradient.addColorStop(1, gradientColors.end);      // Edge color (darker)
                
                // Draw gradient background
                ctx.fillStyle = gradient;
                ctx.fillRect(barX, y, barWidth, barHeight);
                
                // Draw border first (below pattern)
                ctx.strokeStyle = 'rgb(0, 0, 0)';
                ctx.lineWidth = 2;
                ctx.strokeRect(barX, y, barWidth, barHeight);
                
                // Draw pattern overlay on top of everything
                if (patternImage.current) {
                    ctx.save();
                    
                    // Calculate pattern dimensions to maintain aspect ratio
                    const patternAspectRatio = patternImage.current.width / patternImage.current.height;
                    let patternWidth = patternImage.current.width;
                    let patternHeight = patternImage.current.height;
                    
                    // Scale pattern to fit bar height while maintaining aspect ratio
                    if (patternHeight > barHeight) {
                        patternHeight = barHeight;
                        patternWidth = patternHeight * patternAspectRatio;
                    }
                    
                    // Center the pattern horizontally and vertically
                    const patternX = barX + (barWidth - patternWidth) / 2;
                    const patternY = y + (barHeight - patternHeight) / 2;
                    
                    // Create a temporary canvas to tint the pattern
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = patternWidth;
                    tempCanvas.height = patternHeight;
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    // Draw the pattern on temp canvas at original quality
                    tempCtx.drawImage(
                        patternImage.current,
                        0, 0,
                        patternWidth,
                        patternHeight
                    );
                    
                    // Apply tint color using globalCompositeOperation
                    const tintColor = HOUSE_PATTERN_TINTS[houseName] || 'rgba(255, 255, 255, 0.3)';
                    tempCtx.globalCompositeOperation = 'source-atop';
                    tempCtx.fillStyle = tintColor;
                    tempCtx.fillRect(0, 0, patternWidth, patternHeight);
                    
                    // Draw the tinted pattern onto the main canvas (centered)
                    ctx.globalAlpha = 0.6; // Pattern opacity
                    ctx.drawImage(tempCanvas, patternX, patternY);
                    
                    ctx.restore();
                }
            });
        }
    };

    const data = {
        labels: labels,
        datasets: [
            {
                label: "House Points",
                data: dataPoints,
                backgroundColor: 'transparent', // We draw colors in the plugin
                borderColor: 'transparent',
                borderWidth: 0,
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
            padding: { top: 120, bottom: 20, left: 10, right: 10 } // Increased top padding significantly for mascots
        },
        scales: {
            y: {
                beginAtZero: true,
                max: yAxisMax,
                border: { color: 'black', width: 3 },
                ticks: {
                    stepSize: stepSize,
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
            <Bar 
                ref={chartRef} 
                options={options} 
                data={data}
                plugins={[patternOverlayPlugin]}
            />
        </div>
    );
};

export default ScoreboardChart;