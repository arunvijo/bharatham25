import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdOutlineDelete } from "react-icons/md";
import SearchableDropdown from "../../components/SearchableDropdown";

const CreateRegistration = () => {
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [house, setHouse] = useState("");
  const [participantData, setParticipantData] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Get captain's house
        const houseResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/house/by-captain/${user.nickname}`
        );
        const captainHouse = houseResponse.data.filter(
          (d) => d.name !== "Admin"
        )[0];
        if (!captainHouse) {
          enqueueSnackbar("Invalid User", { variant: "error" });
          navigate("/");
          return;
        }
        setHouse(captainHouse.name);

        // Get participants for captain's house
        const participantResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/participant/by-house/${captainHouse.name}`
        );
        setParticipantList(participantResponse.data.data);

        // Get all events
        const eventResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/event/`
        );
        setEvents(eventResponse.data.data);

        // Get existing registrations
        const registrationResponse = await axios.get(
          `https://bharatham-backend-j9s1.onrender.com/registration/by-house/${captainHouse.name}`
        );
        setRegistrations(registrationResponse.data.data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, isLoading, navigate, user?.nickname, enqueueSnackbar]);

  const handleAddParticipants = () => {
    if (participantData) {
      // Check if event is selected
      if (!event) {
        enqueueSnackbar("Please select an event first", { variant: "error" });
        return;
      }

      // Get the selected event object
      const selectedEvent = events.find((e) => e.name === event);
      if (!selectedEvent) {
        enqueueSnackbar("Invalid event selected", { variant: "error" });
        return;
      }

      // Check if registration is enabled for this event
      if (!selectedEvent.registrationEnabled) {
        enqueueSnackbar("Registration is currently closed for this event", { variant: "error" });
        return;
      }

      // Check if we've reached the maximum limit
      if (participants.length >= selectedEvent.maxIndividualLimit) {
        enqueueSnackbar(
          `Maximum limit of ${selectedEvent.maxIndividualLimit} participants reached for this event`,
          {
            variant: "error",
          }
        );
        return;
      }

      let flag = false;
      participants.forEach((participant) => {
        if (participant.uid === participantData) flag = true;
      });

      if (!flag) {
        const pObj = participantList.find((p) => p.uid === participantData);
        if (pObj) {
          setParticipants((old) => [...old, pObj]);
        }
      }
      setParticipantData("");
    }
  };

  const handleDeleteParticipants = (e) => {
    const uid = e.target.id;
    setParticipants(
      participants.filter((participant) => participant.uid !== uid)
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

    // Check if registration is enabled for this event
    if (!selectedEvent.registrationEnabled) {
      enqueueSnackbar("Registration is currently closed for this event", { variant: "error" });
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
    updatedParticipants.forEach((p) => {
      if (selectedEvent.category !== "Non-Counting") {
        if (selectedEvent.participation === "Individual") {
          if (
            selectedEvent.category === "Literary" &&
            (selectedEvent.date !== "21-03-2025" &&
              selectedEvent.date !== "22-03-2025" &&
              selectedEvent.date !== "20-03-2025")
          ) {
            p.literary += 1;
          } else if (
            selectedEvent.category != "Deco" &&
            selectedEvent.category != "Open Stage" &&
            selectedEvent.category != "Media"
          ) {
            p.individual += 1;
          }
        } else if (selectedEvent.participation === "Group") {
          if (
            selectedEvent.category === "Literary" &&
            (selectedEvent.date !== "21-03-2025" &&
              selectedEvent.date !== "22-03-2025" &&
              selectedEvent.date !== "20-03-2025")
          ) {
            p.literary += 1;
          } else if (
            selectedEvent.category != "Deco" &&
            selectedEvent.category != "Open Stage" &&
            selectedEvent.category != "Media"
          ) {
            p.group += 1;
          }
        }
      }
    });

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
      .post("https://bharatham-backend-j9s1.onrender.com/registration/", data)
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
                  `https://bharatham-backend-j9s1.onrender.com/participant/${participant._id}`,
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
        navigate("/captain");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating registration!", { variant: "error" });
      });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="main-container">
      <BackButton destination="/captain" />
      <h1>Create Registration</h1>

      <hr />

      <p>Event : </p>
      <select
        name="event"
        id="event"
        value={event}
        onChange={(e) => setEvent(e.target.value)}
      >
        <option value="">{""}</option>
        {events?.map((e) => (
          <option key={e._id} value={e.name}>
            {e.name}
          </option>
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
            options={participantList}
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

export default CreateRegistration;
