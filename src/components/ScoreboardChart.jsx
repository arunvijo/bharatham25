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

// Default scores to an empty array to prevent crashes
const ScoreboardChart = ({ scores = [] }) => {
  // Safety check: If scores is still null/undefined or not an array, show a fallback
  if (!scores || !Array.isArray(scores)) {
    return (
      <div className="text-center p-4 text-gray-500">
        Loading Scoreboard...
      </div>
    );
  }

  // Sort scores to show leader first
  const sortedScores = [...scores].sort((a, b) => b.points - a.points);

  const data = {
    labels: sortedScores.map((house) => house.name),
    datasets: [
      {
        label: "House Points",
        data: sortedScores.map((house) => house.points),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)", // Red
          "rgba(54, 162, 235, 0.7)", // Blue
          "rgba(255, 206, 86, 0.7)", // Yellow
          "rgba(75, 192, 192, 0.7)", // Green
          "rgba(153, 102, 255, 0.7)", // Purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "House Leaderboard",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default ScoreboardChart;

// import React, { useEffect, useState } from 'react';
// import Chart from 'chart.js/auto';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import axios from 'axios';

// const ScoreboardChart = () => {
//   const [ranking, setRanking] = useState({
//     labels: ["Spartans", "Mughals", "Vikings", "Rajputs", "Aryans"],
//     datasets: [
//       {
//         label: "Scoreboard",
//         data: [0, 0, 0, 0, 0],
//         backgroundColor: [
//           "rgba(236,129,121,0.8)",
//           "rgba(252,155,9,0.8)",
//           "rgba(95,213,170,0.8)",
//           "rgba(83,199,223,0.8)",
//           "rgba(255,216,76,0.8)",
//         ],
//         borderColor: [
//           "rgba(236,129,121,1)",
//           "rgba(252,155,9,1)",
//           "rgba(95,213,170,1)",
//           "rgba(83,199,223,1)",
//           "rgba(255,216,76,1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const scoreResponse = await axios.get(
//           `https://bharatham-backend-j9s1.onrender.com/score/`
//         );
//         const scores = scoreResponse.data.data;

//         const newRanking = { ...ranking };
//         scores.forEach((score) => {
//           if (score.house === "Mughals")
//             newRanking.datasets[0].data[1] += score.points;
//           else if (score.house === "Spartans")
//             newRanking.datasets[0].data[0] += score.points;
//           else if (score.house === "Vikings")
//             newRanking.datasets[0].data[2] += score.points;
//           else if (score.house === "Rajputs")
//             newRanking.datasets[0].data[3] += score.points;
//           else if (score.house === "Aryans")
//             newRanking.datasets[0].data[4] += score.points;
//         });

//         setRanking(newRanking);

//         const ctx = document
//           .getElementById("scoreboard-chart")
//           .getContext("2d");

//         Chart.defaults.color = "#FFF";
//         Chart.register(ChartDataLabels);
//         new Chart(ctx, {
//           type: "bar",
//           data: newRanking,
//           options: {
//             scales: {
//               yAxes: [
//                 {
//                   ticks: {
//                     beginAtZero: true,
//                   },
//                 },
//               ],
//             },
//             plugins: {
//               legend: {
//                 display: false,
//               },
//               datalabels: {
//                 anchor: "center",
//                 align: "end",
//                 color: "white",
//                 font: {
//                   weight: "bold",
//                 },
//                 formatter: function (value) {
//                   return value;
//                 },
//               },
//             },
//           },
//         });
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

//   return <canvas id="scoreboard-chart" />;
// };

// export default ScoreboardChart; 