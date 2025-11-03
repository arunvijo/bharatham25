import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import SearchableDropdown from "../../components/SearchableDropdown";

const CreateRegisration = () => {
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [house, setHouse] = useState("");
  const [houses, setHouses] = useState([]);
  const [participantData, setParticipantData] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    // console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");

    const fetchData = async () => {
      try {
        const houseResponse = await axios.get(
          `https://bharatham-1.onrender.com/house/`
        );
        const houses = houseResponse.data.data;

        const participantResponse = await axios.get(
          `https://bharatham-1.onrender.com/participant/`
        );
        const participantList = participantResponse.data.data;

        const eventResponse = await axios.get(
          `https://bharatham-1.onrender.com/event/`
        );
        const events = eventResponse.data.data;

        const registrationResponse = await axios.get(
          `https://bharatham-1.onrender.com/registration/`
        );
        const registrations = registrationResponse.data.data;

        setHouses(houses);
        setEvents(events);
        setParticipantList(participantList);
        setRegistrations(registrations);
        setLoading(false);
        // console.log(events.length, registrations.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleAddParticipants = () => {
    if (participantData) {
      let flag = false;
      participants.forEach((participant) => {
        if (participant.uid == participantData) flag = true;
      });

      if (flag == false) {
        const pObj = participantList.filter((p) => p.uid == participantData)[0];
        // console.log(participantData, pObj);
        setParticipants((old) => [...old, pObj]);
      }
      setParticipantData("");
    }
  };

  const handleDeleteParticipants = (e) => {
    const uid = e.target.id;
    setParticipants(
      participants.filter((participant) => {
        return participant.uid != uid;
      })
    );
  };

  const handleSaveRegistration = () => {
    const data = {
      event,
      house,
      participants,
    };

    if (participants.length === 0) {
      enqueueSnackbar("No participant selected", {
        variant: "error",
      });
      return;
    }

    // Get the selected event object
    const selectedEvent = events.find((e) => e.name === event);
    if (!selectedEvent) {
      enqueueSnackbar("Invalid event selected", { variant: "error" });
      return;
    }

    // Check minimum participant limit
    if (participants.length < selectedEvent.minIndividualLimit) {
      enqueueSnackbar(
        `Minimum ${selectedEvent.minIndividualLimit} participants required for this event`,
        {
          variant: "error",
        }
      );
      return;
    }

    // Check maximum participant limit
    if (participants.length > selectedEvent.maxIndividualLimit) {
      enqueueSnackbar(
        `Maximum ${selectedEvent.maxIndividualLimit} participants allowed for this event`,
        {
          variant: "error",
        }
      );
      return;
    }

    // Check team limit for the event
    const houseRegistrationsForEvent = registrations.filter(
      (reg) => reg.event === event && reg.house === house
    );
    if (houseRegistrationsForEvent.length >= selectedEvent.teamLimit) {
      enqueueSnackbar(
        `Maximum team limit of ${selectedEvent.teamLimit} reached for this event`,
        {
          variant: "error",
        }
      );
      return;
    }

    // Create a copy of participants to update their counts
    const updatedParticipants = participants.map((p) => ({
      ...p,
      individual: p.individual || 0,
      group: p.group || 0,
      literary: p.literary || 0,
    }));

    // Update participation counts
    // updatedParticipants.forEach((p) => {
    //   if (selectedEvent.category !== "Non-Counting") {
    //     if (selectedEvent.participation === "Individual") {
    //       if (
    //         selectedEvent.category === "Literary" &&
    //         selectedEvent.date !== "21-03-2025" &&
    //         selectedEvent.date !== "22-03-2025" &&
    //         selectedEvent.date !== "20-03-2025"
    //       ) {
    //         p.literary += 1;
    //       } else if (
    //         selectedEvent.category != "Deco" &&
    //         selectedEvent.category != "Open Stage" &&
    //         selectedEvent.category != "Media"
    //       ) {
    //         p.individual += 1;
    //       }
    //     } else if (selectedEvent.participation === "Group") {
    //       if (
    //         selectedEvent.category === "Literary" &&
    //         selectedEvent.date !== "21-03-2025" &&
    //         selectedEvent.date !== "22-03-2025" &&
    //         selectedEvent.date !== "20-03-2025"
    //       ) {
    //         p.literary += 1;
    //       } else if (
    //         selectedEvent.category != "Deco" &&
    //         selectedEvent.category != "Open Stage" &&
    //         selectedEvent.category != "Media"
    //       ) {
    //         p.group += 1;
    //       }
    //     }
    //   }
    // });

    // Check participation limits after updating counts
    let flag = true;
    const unlimitedGroupUids = [
      "U2101071",
      "U2101016",
      "U2101119",
      "U2105050",
      "U2102031",
      "U2104050",
      "U2107031",
      "U2101016",
      "U2101078",
      "U2103064",
    ];
    updatedParticipants.forEach((p) => {
      if (
        p.individual > 5 ||
        p.literary > 4 ||
        (p.group > 3 && !unlimitedGroupUids.includes(p.uid))
      ) {
        flag = false;
      }
    });

    if (!flag) {
      enqueueSnackbar("Participant has reached participation limit", {
        variant: "error",
      });
      setParticipantData("");
      setParticipants([]);
      return;
    }

    setLoading(true);
    axios
      .post("https://bharatham-1.onrender.com/registration/", data)
      .then((response) => {
        setLoading(false);
        setRegistrations((old) => [...old, response.data]);

        enqueueSnackbar("Registration Created successfully", {
          variant: "success",
        });

        // Update participants with new counts
        const updateParticipants = async () => {
          try {
            await Promise.all(
              updatedParticipants.map((participant) =>
                axios.put(
                  `https://bharatham-1.onrender.com/participant/${participant._id}`,
                  participant
                )
              )
            );
            enqueueSnackbar("Participant data updated successfully!", {
              variant: "success",
            });
          } catch (error) {
            console.error(error);
            enqueueSnackbar("Error updating participant data!", {
              variant: "error",
            });
          }
        };

        updateParticipants();
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating registration!", { variant: "error" });
      });
  };

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Create Registration</h1>

      <hr />

      <p>House : </p>
      <select
        name="house"
        id="house"
        value={house}
        onChange={(e) => setHouse(e.target.value)}
      >
        <option value="">{""}</option>
        {houses
          ?.filter((h) => h.name != "Admin")
          .map((h) => (
            <option value={h.name}>{h.name}</option>
          ))}
      </select>

      <p>Event : </p>
      <select
        name="event"
        id="event"
        value={event}
        onChange={(e) => setEvent(e.target.value)}
      >
        <option value="">{""}</option>
        {events?.map((e) => (
          <option value={e.name}>{e.name}</option>
        ))}
      </select>

      <p>Added Participants : </p>
      <div className="pill-container">
        {participants.map((participant) => (
          <button
            id={participant.uid}
            className="btn-pill"
            onClick={handleDeleteParticipants}
            key={`p${participant.uid}`}
          >
            {participant.uid} | {participant.fullName}
            <MdOutlineDelete />
          </button>
        ))}
      </div>
      <div className="sub-group">
        <div className="row" style={{ gap: "20px" }}>
          <SearchableDropdown
            options={participantList.filter((registration) =>
              registration.house.toLowerCase().includes(house.toLowerCase())
            )}
            label="Participant"
            id="participant"
            selectedVal={participantData}
            handleChange={(val) => setParticipantData(val)}
          />
          <button className="btn-outline" onClick={handleAddParticipants}>
            + Participant
          </button>
        </div>
      </div>

      <button onClick={handleSaveRegistration}>Create</button>
    </div>
  );
};
export default CreateRegisration;
