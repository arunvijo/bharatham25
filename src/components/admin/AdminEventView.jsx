import React, { useState, useEffect } from "react";
import RegistrationTable from "../registration/RegistrationTable";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { MdOutlineDelete } from "react-icons/md";
import BackButton from "../BackButton";
import CaptainRegistrationTable from "../registration/CaptainRegistrationTable";
import SearchableDropdown from "../SearchableDropdown";

const AdminEventView = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [event, setEvent] = useState();
  const [participantData, setParticipantData] = useState("");
  const [participantList, setParticipantList] = useState([]);
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participantResponse = await axios.get(
          `https://bharatham-1.onrender.com/participant/`
        );
        const participantList = participantResponse.data.data;

        const eventResponse = await axios.get(
          `https://bharatham-1.onrender.com/event/${id}`
        );
        const event = eventResponse.data;

        const registrationResponse = await axios.get(
          `https://bharatham-1.onrender.com/registration/by-event/${id}`
        );
        const registrations = registrationResponse.data.data;

        setEvent(event);
        setParticipantList(participantList);
        setRegistrations(registrations);
        console.log(event?.teamLimit, registrations.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

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

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>{event ? event.name : "View Event"}</h1>
      <p>
        {event?.participation} | {event?.type} | {event?.category}
      </p>
      <p>Max Team Registration : {event?.teamLimit}</p>
      <p>Min Members per Team : {event?.minIndividualLimit}</p>
      <p>Max Members per Team : {event?.maxIndividualLimit}</p>
      <CaptainRegistrationTable
        registrations={registrations}
        handleDeleteRegistration={handleDeleteRegistration}
      />
    </div>
  );
};

export default AdminEventView;
