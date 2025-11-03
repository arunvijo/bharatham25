import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

const DeleteRegistration = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    setLoading(true);
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
  }, []);

  const handleDeleteRegistration = () => {
    setLoading(true);

    // First, get the registration data
    axios
      .get(`https://bharatham-backend-j9s1.onrender.com/registration/${id}/`)
      .then((response) => {
        const registration = response.data;
        if (!registration) {
          throw new Error("No registration data received");
        }

        const participants = registration.participants;
        const eventName = registration.event;

        if (!participants || !eventName) {
          throw new Error("Invalid registration data structure");
        }

        // Fetch event details
        return axios
          .get(`https://bharatham-backend-j9s1.onrender.com/event/`)
          .then((eventResponse) => {
            const event = eventResponse.data.data.find(
              (e) => e.name === eventName
            );
            if (!event) {
              throw new Error(`Event "${eventName}" not found`);
            }
            return { registration, event };
          });
      })
      .then(({ registration, event }) => {
        console.log("Registration data:", {
          event: event.name,
          category: event.category,
          participation: event.participation,
          participants: registration.participants.map((p) => p.fullName),
        });

        // Fetch latest participant data for all participants
        return Promise.all(
          registration.participants.map((participant) =>
            axios
              .get(
                `https://bharatham-backend-j9s1.onrender.com/participant/${participant._id}`
              )
              .then((response) => response.data)
          )
        ).then((latestParticipants) => {
          console.log(
            "Latest participant data:",
            latestParticipants.map((p) => ({
              name: p.fullName,
              individual: p.individual,
              group: p.group,
              literary: p.literary,
            }))
          );

          // Create a copy of participants with latest data to update their counts
          const updatedParticipants = latestParticipants.map((p) => ({
            ...p,
            individual: p.individual || 0,
            group: p.group || 0,
            literary: p.literary || 0,
          }));

          // Update participation counts
          updatedParticipants.forEach((p) => {
            console.log("Updating participant:", p.fullName);
            console.log("Current counts:", {
              individual: p.individual,
              group: p.group,
              literary: p.literary,
            });

            if (event.category !== "Non-Counting") {
              if (event.participation === "Individual") {
                if (
                  event.category === "Literary" &&
                  (event.date !== "21-03-2025" &&
                    event.date !== "22-03-2025" &&
                    event.date !== "20-03-2025")
                ) {
                  p.literary = Math.max(0, p.literary - 1);
                  console.log("Updated literary count:", p.literary);
                } else if (
                  event.category != "Deco" &&
                  event.category != "Open Stage" &&
                  event.category != "Media"
                ) {
                  p.individual = Math.max(0, p.individual - 1);
                  console.log("Updated individual count:", p.individual);
                }
              } else if (event.participation === "Group") {
                if (
                  event.category === "Literary" &&
                  (event.date !== "21-03-2025" &&
                    event.date !== "22-03-2025" &&
                    event.date !== "20-03-2025")
                ) {
                  p.literary = Math.max(0, p.literary - 1);
                  console.log("Updated literary count:", p.literary);
                } else if (
                  event.category != "Deco" &&
                  event.category != "Open Stage" &&
                  event.category != "Media"
                ) {
                  p.group = Math.max(0, p.group - 1);
                  console.log("Updated group count:", p.group);
                }
              }
            }
          });

          console.log(
            "Final updated participants:",
            updatedParticipants.map((p) => ({
              name: p.fullName,
              individual: p.individual,
              group: p.group,
              literary: p.literary,
            }))
          );

          // Update all participants with new counts
          return Promise.all(
            updatedParticipants.map((participant) =>
              axios
                .put(
                  `https://bharatham-backend-j9s1.onrender.com/participant/${participant._id}`,
                  participant
                )
                .then((response) => {
                  console.log("Updated participant in database:", {
                    name: response.data.fullName,
                    individual: response.data.individual,
                    group: response.data.group,
                    literary: response.data.literary,
                  });
                  return response;
                })
            )
          );
        });
      })
      .then(() => {
        // After participants are updated, delete the registration
        return axios.delete(
          `https://bharatham-backend-j9s1.onrender.com/registration/${id}/`
        );
      })
      .then(() => {
        enqueueSnackbar(
          "Registration deleted and participant data updated successfully!",
          {
            variant: "success",
          }
        );
        setLoading(false);
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Error in delete process:", error);
        setLoading(false);
        enqueueSnackbar(
          error.response?.data?.message || "Error processing deletion!",
          { variant: "error" }
        );
      });
  };

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Delete Registration</h1>
      {loading ? <Spinner /> : ""}
      <div>
        <h3>Are You Sure You want to delete this registration?</h3>
        <button onClick={handleDeleteRegistration}>Yes, Delete it</button>
      </div>
    </div>
  );
};

export default DeleteRegistration;
