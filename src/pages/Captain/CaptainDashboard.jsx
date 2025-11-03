import React, { useState, useEffect } from "react";
import ParticipantTable from "../../components/participant/ParticipantTable";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import LogoutButton from "../LogoutButton";
import Spinner from "../../components/Spinner";
import EventCardList from "./EventCardList";
import RegistrationTable from "../../components/registration/RegistrationTable";
import CaptainRegistrationTable from "../../components/registration/CaptainRegistrationTable";

const CaptainDashboard = () => {
  const [house, setHouse] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState("table");
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleDeleteRegistration = (e) => {
    const id = e.target.id;
    setLoading(true);

    // First, get the registration data
    axios
      .get(`https://bharatham-1.onrender.com/registration/${id}`)
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
          .get(`https://bharatham-1.onrender.com/event/`)
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
                `https://bharatham-1.onrender.com/participant/${participant._id}`
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
                  `https://bharatham-1.onrender.com/participant/${participant._id}`,
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
          `https://bharatham-1.onrender.com/registration/${id}`
        );
      })
      .then(() => {
        setRegistrations((old) => old.filter((r) => r._id !== id));
        enqueueSnackbar(
          "Registration deleted and participant data updated successfully!",
          {
            variant: "success",
          }
        );
        setLoading(false);
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

  useEffect(() => {
    const fetchData = async () => {
      let house = "";
      try {
        console.log("Starting data fetch...");
        console.log("Auth state:", {
          isAuthenticated,
          isLoading,
          user: user?.nickname,
        });

        if (!isAuthenticated && !isLoading) {
          console.log("Not authenticated, redirecting to home...");
          navigate("/");
          return;
        }

        console.log("Fetching house data for captain:", user.nickname);
        const houseResponse = await axios.get(
          `https://bharatham-1.onrender.com/house/by-captain/${user.nickname}`
        );
        console.log("House response:", houseResponse.data);

        if (houseResponse.data) {
          const filteredHouses = houseResponse.data.filter(
            (d) => d.name != "Admin"
          );
          console.log("Filtered houses:", filteredHouses);

          if (filteredHouses.length > 0) {
            house = filteredHouses[0].name;
            console.log("Selected house:", house);
          } else {
            console.log("No valid house found for captain");
            enqueueSnackbar("Invalid User", {
              variant: "error",
            });
            navigate("/");
            return;
          }
        } else {
          console.log("No house data received");
          enqueueSnackbar("Invalid User", {
            variant: "error",
          });
          navigate("/");
          return;
        }

        console.log("Fetching participant data for house:", house);
        const participantResponse = await axios.get(
          `https://bharatham-1.onrender.com/participant/by-house/${house}`
        );
        console.log(
          "Participant data received:",
          participantResponse.data.data.length,
          "participants"
        );
        const participants = participantResponse.data.data;

        console.log("Fetching all events...");
        const eventResponse = await axios.get(
          `https://bharatham-1.onrender.com/event/`
        );
        console.log(
          "Events data received:",
          eventResponse.data.data.length,
          "events"
        );
        const events = eventResponse.data.data;

        console.log("Fetching registrations for house:", house);
        const registrationResponse = await axios.get(
          `https://bharatham-1.onrender.com/registration/by-house/${house}`
        );
        console.log(
          "Registrations data received:",
          registrationResponse.data.data.length,
          "registrations"
        );
        const registrations = registrationResponse.data.data;

        console.log("Setting state with fetched data...");
        setHouse(house);
        setParticipants(participants);
        setEvents(events);
        setRegistrations(registrations);
        console.log("Data fetch completed successfully");
      } catch (error) {
        console.error("Error in fetchData:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        enqueueSnackbar("Error loading data", { variant: "error" });
      } finally {
        console.log("Setting loading state to false");
        setLoading(false);
      }
    };

    if (user) {
      console.log("User detected, initiating data fetch...");
      fetchData();
    } else {
      console.log("No user detected, skipping data fetch");
    }
  }, [user]);

  return (
    <div className="main-container">
      <div>
        <h1>Captain Dashboard</h1>
        <p>{user?.name}</p>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <LogoutButton />
          <h3>Events</h3>
          <EventCardList house={house} events={events} />
          <CaptainRegistrationTable
            registrations={registrations}
            handleDeleteRegistration={handleDeleteRegistration}
          />
          <ParticipantTable participants={participants} />
        </>
      )}
    </div>
  );
};

export default CaptainDashboard;
