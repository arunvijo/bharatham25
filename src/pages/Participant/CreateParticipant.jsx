import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";



const CreateParticipant = () => {
  const [fullName, setFullName] = useState("");
  const [uid, setUID] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [house, setHouse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    console.log(user, isAuthenticated, isLoading);
    if (!isAuthenticated && !isLoading) navigate("/");
  },[]);

  const handleSaveParticipant = () => {
    const data = {
      fullName,
      uid,
      branch,
      semester,
      house,
    };
    setLoading(true);
    console.log(data);
    axios
      .post("https://bharatham-backend-j9s1.onrender.com/participant/", data)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar("Participant Created successfully", {
          variant: "success",
        });
        navigate("/admin");
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please check console')
        enqueueSnackbar("Error!", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="main-container">
      <BackButton destination="/admin" />
      <h1>Create Participants </h1>
      {loading ? <Spinner /> : ""}
      <div>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label>UID</label>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUID(e.target.value)}
          />
        </div>
        <div>
          <label>Branch</label>
          <select
            name="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            id="branch"
          >
            <option value=""></option>
            <option value="CSE Alpha">CSE Alpha</option>
            <option value="CSE Beta">CSE Beta</option>
            <option value="CSE Gamma">CSE Gamma</option>
          </select>
        </div>
        <div>
          <label>Semester</label>
          <select
            name="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            id="semester"
          >
            <option value=""></option>
            <option value="S2">S2</option>
            <option value="S4">S4</option>
            <option value="S6">S6</option>
            <option value="S8">S8</option>
          </select>
        </div>
        <div>
          <label>House</label>
          <select
            name="house"
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            id="semester"
          >
            <option value=""></option>
            <option value="Rajputs">Rajputs</option>
            <option value="Mughals">Mughals</option>
            <option value="Vikings">Vikings</option>
            <option value="Spartans">Spartans</option>
            <option value="Aryans">Aryans</option>
          </select>
        </div>
        <button onClick={handleSaveParticipant}>Create</button>
      </div>
    </div>
  );
};

export default CreateParticipant;
