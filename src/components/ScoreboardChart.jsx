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

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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
    // --- 1. DEFINE ALL HOOKS FIRST (Prevents Render Error) ---
    const chartRef = React.useRef(null);
    const patternImage = React.useRef(null);
    const mascotImages = React.useRef({});
    
    // Track loading state to trigger re-renders once images are ready
    const [assetsLoaded, setAssetsLoaded] = React.useState(false);

    // --- 2. DATA PROCESSING ---
    // SORTING: Largest on Left (Descending: b - a)
    const sortedScores = React.useMemo(() => {
        if (!scores || !Array.isArray(scores)) return [];
        return [...scores].sort((a, b) => b.points - a.points);
    }, [scores]);

    // --- 3. IMAGE LOADING EFFECTS ---
    React.useEffect(() => {
        let loadedCount = 0;
        const totalImages = 6; // 1 pattern + 5 mascots

        const checkDone = () => {
            loadedCount++;
            if (loadedCount === totalImages) setAssetsLoaded(true);
        };

        // Load Pattern
        const pImg = new Image();
        pImg.onload = () => { patternImage.current = pImg; checkDone(); };
        pImg.onerror = () => { checkDone(); }; // Proceed even if error
        pImg.src = '/images/pattern.png';

        // Load Mascots
        const houses = ['Mughals', 'Aryans', 'Vikings', 'Spartans', 'Rajputs'];
        houses.forEach(house => {
            const mImg = new Image();
            mImg.onload = () => { 
                mascotImages.current[house] = mImg; 
                checkDone(); 
            };
            mImg.onerror = () => { checkDone(); };
            mImg.src = `/images/${house.toLowerCase()}_mascot.png`;
        });
    }, []);

    // --- 4. CONDITIONAL RETURN (After Hooks) ---
    if (!scores || !Array.isArray(scores) || scores.length === 0) {
        return (
            <div className="text-center p-4 font-mont_light">
                No score data available to display the leaderboard.
            </div>
        );
    }

    const labels = sortedScores.map((house) => house.name);
    const dataPoints = sortedScores.map((house) => house.points);

    const maxScore = Math.max(...dataPoints, 0);
    const yAxisMax = Math.max(100, maxScore * 1.15); // Headroom for mascots
    const stepSize = yAxisMax > 500 ? Math.round(yAxisMax / 5) : 50;

    // --- 5. ANIMATION PLUGIN ---
    const patternOverlayPlugin = {
        id: 'patternOverlay',
        afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            
            meta.data.forEach((bar, index) => {
                // KEY FIX FOR SMOOTH ANIMATION:
                // Use getProps(..., false) to get the INTERMEDIATE values during animation frames.
                // This makes the pattern/mascot grow WITH the bar.
                const { x, y, width, height, base } = bar.getProps(['x', 'y', 'width', 'height', 'base'], false);
                
                const barWidth = width * 0.7;
                const barX = x - barWidth / 2;
                const barHeight = base - y;
                
                const houseName = sortedScores[index].name;
                const gradientColors = HOUSE_GRADIENTS[houseName] || { start: '#888', end: '#666' };
                
                // A. Draw Gradient Background
                const centerX = x; 
                const centerY = y + barHeight / 2; 
                const radius = Math.max(barWidth, barHeight) / 1.5; 
                
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                gradient.addColorStop(0, gradientColors.start);    
                gradient.addColorStop(1, gradientColors.end);      
                
                ctx.fillStyle = gradient;
                ctx.fillRect(barX, y, barWidth, barHeight);
                
                // B. Draw Border
                ctx.strokeStyle = 'rgb(0, 0, 0)';
                ctx.lineWidth = 2;
                ctx.strokeRect(barX, y, barWidth, barHeight);
                
                // C. Draw Pattern Overlay
                if (patternImage.current) {
                    ctx.save();
                    // Scale pattern to fit bar
                    const patternAspectRatio = patternImage.current.width / patternImage.current.height;
                    let patternWidth = patternImage.current.width;
                    let patternHeight = patternImage.current.height;
                    
                    if (patternHeight > barHeight) {
                        patternHeight = barHeight;
                        patternWidth = patternHeight * patternAspectRatio;
                    }
                    
                    const patternX = barX + (barWidth - patternWidth) / 2;
                    const patternY = y + (barHeight - patternHeight) / 2;
                    
                    // Create temp canvas for tinting
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = patternWidth;
                    tempCanvas.height = patternHeight;
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    tempCtx.drawImage(patternImage.current, 0, 0, patternWidth, patternHeight);
                    const tintColor = HOUSE_PATTERN_TINTS[houseName] || 'rgba(255, 255, 255, 0.3)';
                    tempCtx.globalCompositeOperation = 'source-atop';
                    tempCtx.fillStyle = tintColor;
                    tempCtx.fillRect(0, 0, patternWidth, patternHeight);
                    
                    // Clip to bar area so pattern doesn't bleed
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.rect(barX, y, barWidth, barHeight);
                    ctx.clip();
                    
                    ctx.drawImage(tempCanvas, patternX, patternY);
                    ctx.restore();
                }

                // D. Draw Mascot (Floating on Top)
                const mascotImg = mascotImages.current[houseName];
                if (mascotImg) {
                    const maxMascotWidth = barWidth * 1.4;
                    const mascotAspectRatio = mascotImg.width / mascotImg.height;
                    let mascotWidth = maxMascotWidth;
                    let mascotHeight = mascotWidth / mascotAspectRatio;
                    
                    const mascotGap = 5;
                    const mascotX = x - (mascotWidth / 2); 
                    const mascotY = y - mascotHeight - mascotGap; 
                    
                    ctx.save();
                    // Add subtle shadow to pop mascot from background
                    ctx.shadowColor = "rgba(0,0,0,0.3)";
                    ctx.shadowBlur = 8;
                    ctx.shadowOffsetY = 4;
                    
                    ctx.drawImage(mascotImg, mascotX, mascotY, mascotWidth, mascotHeight);
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
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        // SMOOTH REORDERING ANIMATION CONFIG
        animation: {
            duration: 1000, 
            easing: 'easeInOutQuart', 
        },
        transitions: {
            active: {
                animation: {
                    duration: 500
                }
            }
        },
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#FEE89B',
                bodyColor: 'white',
                padding: 12,
                titleFont: { family: 'Montserrat', size: 14, weight: 'bold' },
                bodyFont: { family: 'Montserrat', size: 13 },
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y} Points`;
                    }
                }
            }
        },
        layout: {
            padding: { top: 120, bottom: 20, left: 10, right: 10 }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: yAxisMax,
                border: { color: 'black', width: 3 },
                ticks: {
                    stepSize: stepSize,
                    color: 'black',
                    font: { family: 'Mont', size: 14, weight: 'normal' },
                    padding: 10,
                },
                grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 }
            },
            x: {
                border: { color: 'black', width: 3 },
                ticks: {
                    color: 'black',
                    font: { family: 'Mont', size: 14, weight: 'normal' },
                    padding: 10,
                },
                grid: { display: false },
            },
        },
    };

    return (
        <div className="w-full h-full font-mont min-h-[400px]"> 
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