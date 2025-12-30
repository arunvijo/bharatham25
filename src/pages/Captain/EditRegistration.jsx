import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { MdEdit, MdSave, MdArrowBack, MdPersonAdd, MdDelete } from "react-icons/md";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/Spinner";
import SearchableDropdown from "../../components/SearchableDropdown";

const CaptainEditRegistration = () => {
  const [event, setEvent] = useState(null);
  const [house, setHouse] = useState("");
  const [participantData, setParticipantData] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceType, setPerformanceType] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";
  const DEADLINE = new Date("2026-01-04T23:59:59");
  const isPastDeadline = new Date() > DEADLINE;

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
        navigate("/");
        return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Registration
        const regRes = await axios.get(`${apiUrl}/registration/${id}`);
        const regData = regRes.data;
        
        // 2. Security: Verify Captain's House matches Registration's House
        const houseRes = await axios.get(`${apiUrl}/house/by-captain/${user.nickname}`);
        const captainHouse = houseRes.data.find(h => h.name !== "Admin")?.name;

        if (regData.house !== captainHouse) {
            enqueueSnackbar("Unauthorized: You can only edit your own house registrations", { variant: "error" });
            navigate("/captain");
            return;
        }

        // 3. Fetch Event Rules
        const eventRes = await axios.get(`${apiUrl}/event/`);
        const eventInfo = eventRes.data.data.find(e => e.name === regData.event);

        // 4. Fetch House Participants
        const partRes = await axios.get(`${apiUrl}/participant/by-house/${captainHouse}`);

        setEvent(eventInfo);
        setHouse(regData.house);
        setParticipants(regData.participants);
        setParticipantList(partRes.data.data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error loading registration", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.nickname) fetchData();
  }, [id, isAuthenticated, isLoading, user, navigate, apiUrl, enqueueSnackbar]);

  const handleAddParticipants = () => {
    if (isPastDeadline) {
      enqueueSnackbar("Registration is closed", { variant: "error" });
      return;
    }

    const maxLimit = event?.maxTeamSize || event?.maxIndividualLimit || 1;
    if (participants.length >= maxLimit) {
        enqueueSnackbar(`Limit of ${maxLimit} reached`, { variant: "warning" });
        return;
    }

    const pObj = participantList.find((p) => p.uid === participantData);
    if (pObj && !participants.some(p => p.uid === pObj.uid)) {
        setParticipants(old => [...old, {
            ...pObj,
            language: selectedLanguage || null,
            performanceType: performanceType || null
        }]);
        setParticipantData("");
    }
  };

  const handleSave = () => {
    if (isPastDeadline) return;
    setLoading(true);
    axios.put(`${apiUrl}/registration/${id}`, { event: event.name, house, participants })
      .then(() => {
        enqueueSnackbar("Participants Updated", { variant: "success" });
        navigate("/captain");
      })
      .catch(() => enqueueSnackbar("Update failed", { variant: "error" }))
      .finally(() => setLoading(false));
  };

  if (loading || !event) return <div className="h-screen flex items-center justify-center bg-desi-cream"><Spinner /></div>;

  return (
    <DashboardLayout role="Captain" title="Edit Team" subtitle={event.name}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-desi-teal">
          <h3 className="text-lg font-bold mb-4">Manage Participants</h3>
          
          {!isPastDeadline ? (
            <div className="flex flex-col md:flex-row gap-4 items-end mb-6 bg-stone-50 p-4 rounded-lg">
                <div className="flex-1 w-full">
                    <SearchableDropdown 
                        options={participantList} 
                        label="Add Student" 
                        selectedVal={participantData} 
                        handleChange={setParticipantData} 
                    />
                </div>
                <button onClick={handleAddParticipants} className="px-6 py-2.5 bg-desi-teal text-white rounded-lg">Add</button>
            </div>
          ) : (
            <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-lg font-bold">Registration Closed</div>
          )}

          <div className="flex flex-wrap gap-3">
            {participants.map((p) => (
              <div key={p.uid} className="flex items-center gap-3 bg-stone-50 border px-4 py-2 rounded-full">
                <span className="text-sm font-bold">{p.fullName}</span>
                {!isPastDeadline && (
                    <button onClick={() => setParticipants(participants.filter(x => x.uid !== p.uid))} className="text-red-500">
                        <MdDelete />
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={() => navigate("/captain")} className="px-6 py-2 text-stone-500">Cancel</button>
          {!isPastDeadline && (
            <button onClick={handleSave} className="px-8 py-3 bg-desi-saffron text-white font-bold rounded-lg shadow-lg">
                <MdSave className="inline mr-2" /> Save Changes
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CaptainEditRegistration;