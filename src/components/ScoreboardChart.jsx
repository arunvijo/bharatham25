import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

const ScoreboardChart = () => {
  const [ranking, setRanking] = useState({
    labels: ["Spartans", "Mughals", "Vikings", "Rajputs", "Aryans"],
    datasets: [
      {
        label: "Scoreboard",
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(236,129,121,0.8)",
          "rgba(252,155,9,0.8)",
          "rgba(95,213,170,0.8)",
          "rgba(83,199,223,0.8)",
          "rgba(255,216,76,0.8)",
        ],
        borderColor: [
          "rgba(236,129,121,1)",
          "rgba(252,155,9,1)",
          "rgba(95,213,170,1)",
          "rgba(83,199,223,1)",
          "rgba(255,216,76,1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scoreResponse = await axios.get(
          `https://bharatham-1.onrender.com/score/`
        );
        const scores = scoreResponse.data.data;

        const newRanking = { ...ranking };
        scores.forEach((score) => {
          if (score.house === "Mughals")
            newRanking.datasets[0].data[1] += score.points;
          else if (score.house === "Spartans")
            newRanking.datasets[0].data[0] += score.points;
          else if (score.house === "Vikings")
            newRanking.datasets[0].data[2] += score.points;
          else if (score.house === "Rajputs")
            newRanking.datasets[0].data[3] += score.points;
          else if (score.house === "Aryans")
            newRanking.datasets[0].data[4] += score.points;
        });

        setRanking(newRanking);

        const ctx = document
          .getElementById("scoreboard-chart")
          .getContext("2d");

        Chart.defaults.color = "#FFF";
        Chart.register(ChartDataLabels);
        new Chart(ctx, {
          type: "bar",
          data: newRanking,
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            plugins: {
              legend: {
                display: false,
              },
              datalabels: {
                anchor: "center",
                align: "end",
                color: "white",
                font: {
                  weight: "bold",
                },
                formatter: function (value) {
                  return value;
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <canvas id="scoreboard-chart" />;
};

export default ScoreboardChart; 