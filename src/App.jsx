import React from "react";
import { Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

import CreateParticipant from "./pages/Participant/CreateParticipant";
import EditParticipant from "./pages/Participant/EditParticipant";
import ShowParticipant from "./pages/Participant/ShowParticipant";
import DeleteParticipant from "./pages/Participant/DeleteParticipant";

import CreateEvent from "./pages/Event/CreateEvent";
import EditEvent from "./pages/Event/EditEvent";
import ShowEvent from "./pages/Event/ShowEvent";
import DeleteEvent from "./pages/Event/DeleteEvent";

import AdminCreateRegistration from "./pages/Registration/CreateRegistration";
import EditRegistration from "./pages/Registration/EditRegistration";
import ShowRegistration from "./pages/Registration/ShowRegistration";
import DeleteRegistration from "./pages/Registration/DeleteRegistration";

import CreateScore from "./pages/Score/CreateScore";
import EditScore from "./pages/Score/EditScore";
import ShowScore from "./pages/Score/ShowScore";
import DeleteScore from "./pages/Score/DeleteScore";

import CaptainDashboard from "./pages/Captain/CaptainDashboard";
import EventView from "./pages/Captain/EventView";
import CreateRegistration from "./pages/Captain/CreateRegistration";

import "./index.css"
import Scoreboard from "./pages/Scoreboard";
import AdminEventView from "./components/admin/AdminEventView";
import Events from "./pages/Events";
import EventPage from "./pages/EventPage";

const Participant = () => {
  return (
    <Auth0Provider
      domain="dev-6edntfe6rlcf5tb7.us.auth0.com"
      clientId="PVkwq4rtF10qzeLYudDPQnISZycU7kRS"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/event/view/:id" element={<AdminEventView />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventPage />} />

        <Route path="/participant/create" element={<CreateParticipant />} />
        <Route path="/participant/details/:id" element={<ShowParticipant />} />
        <Route path="/participant/edit/:id" element={<EditParticipant />} />
        <Route path="/participant/delete/:id" element={<DeleteParticipant />} />
        
        <Route path="/event/create" element={<CreateEvent />} />
        <Route path="/event/details/:id" element={<ShowEvent />} />
        <Route path="/event/edit/:id" element={<EditEvent />} />
        <Route path="/event/delete/:id" element={<DeleteEvent />} />
        
        <Route path="/registration/create" element={<AdminCreateRegistration />} />
        <Route path="/registration/details/:id" element={<ShowRegistration />} />
        <Route path="/registration/edit/:id" element={<EditRegistration />} />
        <Route path="/registration/delete/:id" element={<DeleteRegistration />} />
        
        <Route path="/score/create" element={<CreateScore />} />
        <Route path="/score/details/:id" element={<ShowScore />} />
        <Route path="/score/edit/:id" element={<EditScore />} />
        <Route path="/score/delete/:id" element={<DeleteScore />} />
        
        <Route path="/captain" element={<CaptainDashboard />} />
        <Route path="/captain/event/view/:id" element={<EventView />} />
        <Route path="/captain/registration/create" element={<CreateRegistration />} />
      </Routes>
    </Auth0Provider>
  );
};

export default Participant;
