import React from "react";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import { MdInfo, MdMenu } from "react-icons/md";

import ScoreTable from "../components/score/ScoreTable";

import ChartDataLabels from "chartjs-plugin-datalabels";
import NegativeScoreTable from "../components/score/NegativeScoreTable";
import Navigation from "../components/Navigation";

const Scoreboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const navigate = useNavigate();

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
    // console.log(user, isAuthenticated, isLoading);

    const fetchData = async () => {
      try {
        const scoreResponse = await axios.get(
          `https://bharatham-1.onrender.com/score/`
        );
        const scores = scoreResponse.data.data;

        setScores(scores);
        console.log(scores);

        scores.forEach((score) => {
          if (score.house == "Mughals")
            ranking.datasets[0].data[1] += score.points;
          else if (score.house == "Spartans")
            ranking.datasets[0].data[0] += score.points;
          else if (score.house == "Vikings")
            ranking.datasets[0].data[2] += score.points;
          else if (score.house == "Rajputs")
            ranking.datasets[0].data[3] += score.points;
          else if (score.house == "Aryans")
            ranking.datasets[0].data[4] += score.points;
        });

        const ctx = document
          .getElementById("scoreboard-chart")
          .getContext("2d");

        Chart.defaults.color = "#FFF";

        Chart.register(ChartDataLabels);
        const scoreboardChart = new Chart(ctx, {
          type: "bar",
          data: ranking,
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
                // Position of the labels
                // (start, end, center, etc.)
                anchor: "center",
                // Alignment of the labels
                // (start, end, center, etc.)
                align: "end",
                // Color of the labels
                color: "white",
                font: {
                  weight: "bold",
                },
                formatter: function (value, context) {
                  // Display the actual data value
                  return value;
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenu = () => {
    console.log("Menu clicked", showMenu);
    setShowMenu((old) => !old);
  };

  return (
    <div className="scoreboard_page">
      {window.innerWidth < 750 && (
        <motion.button
          className="btn-burger"
          onClick={handleMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MdMenu size={20} />
        </motion.button>
      )}
      {!(window.innerWidth < 750 && showMenu) && (
        <Navigation showMenu={showMenu} />
      )}

      <section id="home">
        <h1>scoreboard</h1>
        <div className="scoreboard">
          <canvas id="scoreboard-chart"></canvas>
        </div>

        <ScoreTable scores={scores} />
        <NegativeScoreTable scores={scores} />
      </section>
    </div>
  );
};

export default Scoreboard;
