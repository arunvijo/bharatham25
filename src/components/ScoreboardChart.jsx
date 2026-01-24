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
    // --- 1. DEFINE HOOKS ---
    const chartRef = React.useRef(null);
    const patternImage = React.useRef(null);
    const mascotImages = React.useRef({});
    const [assetsLoaded, setAssetsLoaded] = React.useState(false);
    const [isFirstLoad, setIsFirstLoad] = React.useState(true);
    const previousScoresRef = React.useRef(null);

    // --- 2. DATA PROCESSING & LIVE REF ---
    // SORTING: Largest on Left (Descending: b - a)
    const sortedScores = React.useMemo(() => {
        if (!scores || !Array.isArray(scores)) return [];
        return [...scores].sort((a, b) => b.points - a.points);
    }, [scores]);

    // FIX: Create a Ref to hold the latest sorted scores
    // This allows the plugin to always access "fresh" data without stale closures
    const liveScoresRef = React.useRef(sortedScores);

    // Update the Ref whenever sortedScores changes
    React.useEffect(() => {
        liveScoresRef.current = sortedScores;
    }, [sortedScores]);

    // CRITICAL FIX: Force animation on FIRST load only
    // This prevents constant re-animations from polling updates
    React.useEffect(() => {
        if (assetsLoaded && chartRef.current && isFirstLoad && sortedScores.length > 0) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                if (chartRef.current) {
                    // Reset the chart to trigger fresh animation
                    chartRef.current.update('none'); // Update without animation first
                    requestAnimationFrame(() => {
                        if (chartRef.current) {
                            chartRef.current.update('show'); // Then animate
                            setIsFirstLoad(false);
                        }
                    });
                }
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [assetsLoaded, isFirstLoad, sortedScores.length]);

    // Handle subsequent updates WITHOUT animation (for polling updates)
    React.useEffect(() => {
        if (!isFirstLoad && chartRef.current && assetsLoaded) {
            // Check if data actually changed
            const prev = previousScoresRef.current;
            const current = sortedScores;
            
            if (prev && JSON.stringify(prev) !== JSON.stringify(current)) {
                // Data changed from polling - update without animation
                chartRef.current.update('none');
            }
            
            previousScoresRef.current = current;
        }
    }, [sortedScores, isFirstLoad, assetsLoaded]);

    // --- 3. IMAGE LOADING EFFECTS ---
    React.useEffect(() => {
        let loadedCount = 0;
        const totalImages = 6; 

        const checkDone = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                setAssetsLoaded(true);
            }
        };

        const pImg = new Image();
        pImg.onload = () => { patternImage.current = pImg; checkDone(); };
        pImg.onerror = () => { checkDone(); }; 
        pImg.src = '/images/pattern.png';

        const houses = ['Mughals', 'Aryans', 'Vikings', 'Spartans', 'Rajputs'];
        houses.forEach(house => {
            const mImg = new Image();
            mImg.onload = () => { mascotImages.current[house] = mImg; checkDone(); };
            mImg.onerror = () => { checkDone(); };
            mImg.src = `/images/${house.toLowerCase()}_mascot.png`;
        });
    }, []);

    // --- 4. CONDITIONAL RETURN ---
    // Don't render chart until assets are loaded to prevent animation timing issues
    if (!assetsLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-stone-600 font-['Mont']">
                <div className="text-center">
                    <div className="animate-pulse text-lg">Loading leaderboard...</div>
                </div>
            </div>
        );
    }
    
    if (!scores || !Array.isArray(scores) || scores.length === 0) {
        return (
            <div className="text-center p-4 text-stone-600 font-['Mont']">
                No score data available to display the leaderboard.
            </div>
        );
    }

    const labels = sortedScores.map((house) => house.name);
    const dataPoints = sortedScores.map((house) => house.points);

    const maxScore = Math.max(...dataPoints, 0);
    const yAxisMax = Math.max(100, maxScore * 1.15); 
    const stepSize = yAxisMax > 500 ? Math.round(yAxisMax / 5) : 50;

    // --- 5. ANIMATION & DRAWING PLUGIN ---
    const patternOverlayPlugin = {
        id: 'patternOverlay',
        afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            
            // FIX: Access the FRESH data from the Ref
            const currentData = liveScoresRef.current;

            meta.data.forEach((bar, index) => {
                // Smooth Animation values
                const { x, y, width, height, base } = bar.getProps(['x', 'y', 'width', 'height', 'base'], false);
                
                const barWidth = width * 0.7;
                const barX = x - barWidth / 2;
                const barHeight = base - y;
                
                // Get data for this specific bar index from our Live Ref
                const scoreItem = currentData[index];
                if (!scoreItem) return; // Safety check

                const houseName = scoreItem.name;
                const housePoints = scoreItem.points;
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
                if (patternImage.current && barHeight > 0) {
                    ctx.save();
                    const patternAspectRatio = patternImage.current.width / patternImage.current.height;
                    let patternWidth = patternImage.current.width;
                    let patternHeight = patternImage.current.height;
                    
                    if (patternHeight > barHeight) {
                        patternHeight = barHeight;
                        patternWidth = patternHeight * patternAspectRatio;
                    }
                    
                    // Ensure canvas has valid dimensions
                    if (patternWidth > 0 && patternHeight > 0) {
                        const patternX = barX + (barWidth - patternWidth) / 2;
                        const patternY = y + (barHeight - patternHeight) / 2;
                        
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = Math.max(1, Math.floor(patternWidth));
                        tempCanvas.height = Math.max(1, Math.floor(patternHeight));
                        const tempCtx = tempCanvas.getContext('2d');
                        
                        tempCtx.drawImage(patternImage.current, 0, 0, tempCanvas.width, tempCanvas.height);
                        const tintColor = HOUSE_PATTERN_TINTS[houseName] || 'rgba(255, 255, 255, 0.3)';
                        tempCtx.globalCompositeOperation = 'source-atop';
                        tempCtx.fillStyle = tintColor;
                        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                        
                        ctx.globalAlpha = 0.5;
                        ctx.beginPath();
                        ctx.rect(barX, y, barWidth, barHeight);
                        ctx.clip();
                        
                        ctx.drawImage(tempCanvas, patternX, patternY);
                    }
                    ctx.restore();
                }

                // D. Draw Mascot
                const mascotImg = mascotImages.current[houseName];
                if (mascotImg) {
                    const maxMascotWidth = barWidth * 1.4;
                    const mascotAspectRatio = mascotImg.width / mascotImg.height;
                    let mascotWidth = maxMascotWidth;
                    let mascotHeight = mascotWidth / mascotAspectRatio;
                    
                    const mascotGap = 5; 
                    const mascotOffsetX = 12; // Offset to the right
                    const mascotX = x - (mascotWidth / 2) + mascotOffsetX; 
                    const mascotY = y - mascotHeight - mascotGap; 
                    
                    ctx.save();
                    ctx.shadowColor = "rgba(0,0,0,0.3)";
                    ctx.shadowBlur = 8;
                    ctx.shadowOffsetY = 4;
                    ctx.drawImage(mascotImg, mascotX, mascotY, mascotWidth, mascotHeight);
                    ctx.restore();
                }

                // E. Draw Points Text (Inside or Above Bar)
                ctx.save();
                ctx.font = 'bold 15px Mont'; 
                ctx.textAlign = 'center';
                
                if (barHeight > 35) {
                    // Inside the rectangle (Black with shadow)
                    ctx.fillStyle = '#000000'; 
                    ctx.textBaseline = 'top';
                    ctx.shadowColor = "rgb(255, 255, 255)"; 
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.fillText(`${housePoints} pts`, x, y + 10); 
                } else {
                    // Above the bar (Black)
                    ctx.fillStyle = '#1c1917'; 
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(`${housePoints} pts`, x, y - 5);
                }
                ctx.restore();
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
        // --- ANIMATION SETTINGS ---
        animation: {
            duration: 2500, // 2.5s Smooth Animation
            easing: 'easeInOutCubic',
            // Delay bars based on their position (ascending order - lowest first)
            delay: (context) => {
                if (context.type === 'data' && context.mode === 'default') {
                    // Since bars are sorted descending (highest on left),
                    // we reverse the index so lowest score animates first
                    const totalBars = context.chart.data.labels.length;
                    const reversedIndex = totalBars - 1 - context.dataIndex;
                    return reversedIndex * 300; // 300ms delay between each bar
                }
                return 0;
            }
        },
        transitions: {
            active: {
                animation: { duration: 800 }
            }
        },
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: { enabled: false }
        },
        layout: {
            padding: { top: 140, bottom: 20, left: 10, right: 10 }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: yAxisMax,
                border: { color: 'black', width: 3 },
                ticks: {
                    stepSize: stepSize,
                    color: 'black',
                    font: { family: 'Mont', size: 12, weight: '600' },
                    padding: 10,
                },
                grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 }
            },
            x: {
                border: { color: 'black', width: 3 },
                ticks: {
                    color: 'black',
                    font: { family: 'Mont', size: 13, weight: 'bold' },
                    padding: 10,
                },
                grid: { display: false },
            },
        },
    };

    return (
        <div className="w-full h-full font-['Mont'] min-h-[400px]"> 
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