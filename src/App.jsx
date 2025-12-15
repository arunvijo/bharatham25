import React from "react";
import { Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import Home from "./pages/Home.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Participant Routes
import CreateParticipant from "./pages/Participant/CreateParticipant.jsx";
import EditParticipant from "./pages/Participant/EditParticipant.jsx";
import ShowParticipant from "./pages/Participant/ShowParticipant.jsx";
import DeleteParticipant from "./pages/Participant/DeleteParticipant.jsx";

// Event Routes
import CreateEvent from "./pages/Event/CreateEvent.jsx";
import EditEvent from "./pages/Event/EditEvent.jsx";
import ShowEvent from "./pages/Event/ShowEvent.jsx";
import DeleteEvent from "./pages/Event/DeleteEvent.jsx";

// Admin Registration Routes
import CreateRegistration from "./pages/Registration/CreateRegistration.jsx";
import EditRegistration from "./pages/Registration/EditRegistration.jsx";
import ShowRegistration from "./pages/Registration/ShowRegistration.jsx";
import DeleteRegistration from "./pages/Registration/DeleteRegistration.jsx";

// Score Routes
import CreateScore from "./pages/Score/CreateScore.jsx";
import EditScore from "./pages/Score/EditScore.jsx";
import ShowScore from "./pages/Score/ShowScore.jsx";
import DeleteScore from "./pages/Score/DeleteScore.jsx";

// Captain Routes
import CaptainDashboard from "./pages/Captain/CaptainDashboard.jsx";
import EventView from "./pages/Captain/EventView.jsx";
import CaptainCreateRegistration from "./pages/Captain/CreateRegistration.jsx"; 

import "./index.css";
import Scoreboard from "./pages/Scoreboard.jsx";
import AdminEventView from "./components/admin/AdminEventView.jsx";
import Events from "./pages/Events.jsx";
import EventPage from "./pages/EventPage.jsx";
import Credits from "./pages/Credits.jsx";

// 👇 NEW IMPORTS
import DesiBackground from "./components/DesiBackground";
// import DesiCursor from "./components/DesiCursor";
// import TextCursor from './components/TextCursor.jsx';
import { SmoothCursor } from "./components/TextCursor.jsx";
import BackgroundMusic from "./components/BackgroundMusic";

const App = () => {
  return (
    <Auth0Provider
      domain="dev-c7fiqa1rj3dt5eb0.us.auth0.com"
      clientId="i9L3qP0AKqqPEufUmyjUlm8xMLAxaE7r"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >

      <SmoothCursor />
      <DesiBackground />
      <BackgroundMusic />
      
      {/* <TextCursor /> */}
      

      <div className="relative z-10"> {/* Ensure content sits above background */}
        <Routes>
          {/* Public & Admin Base Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/event/view/:id" element={<AdminEventView />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/credits" element={<Credits />} />

          {/* Participant CRUD */}
          <Route path="/participant/create" element={<CreateParticipant />} />
          <Route path="/participant/details/:id" element={<ShowParticipant />} />
          <Route path="/participant/edit/:id" element={<EditParticipant />} />
          <Route path="/participant/delete/:id" element={<DeleteParticipant />} />

          {/* Event CRUD */}
          <Route path="/event/create" element={<CreateEvent />} />
          <Route path="/event/details/:id" element={<ShowEvent />} />
          <Route path="/event/edit/:id" element={<EditEvent />} />
          <Route path="/event/delete/:id" element={<DeleteEvent />} />

          {/* Admin Registration CRUD */}
          <Route path="/registration/create" element={<CreateRegistration />} />
          <Route path="/registration/details/:id" element={<ShowRegistration />} />
          <Route path="/registration/edit/:id" element={<EditRegistration />} />
          <Route path="/registration/delete/:id" element={<DeleteRegistration />} />

          {/* Score CRUD */}
          <Route path="/score/create" element={<CreateScore />} />
          <Route path="/score/details/:id" element={<ShowScore />} />
          <Route path="/score/edit/:id" element={<EditScore />} />
          <Route path="/score/delete/:id" element={<DeleteScore />} />

          {/* Captain Routes */}
          <Route path="/captain" element={<CaptainDashboard />} />
          <Route path="/captain/event/view/:id" element={<EventView />} />
          <Route path="/captain/registration/create" element={<CaptainCreateRegistration />} />
        </Routes>
      </div>
    </Auth0Provider>
  );
};

export default App;

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { Auth0Provider } from "@auth0/auth0-react";

// import Home from "./pages/Home.jsx";
// import AdminDashboard from "./pages/AdminDashboard.jsx";

// import CreateParticipant from "./pages/Participant/CreateParticipant.jsx";
// import EditParticipant from "./pages/Participant/EditParticipant.jsx";
// import ShowParticipant from "./pages/Participant/ShowParticipant.jsx";
// import DeleteParticipant from "./pages/Participant/DeleteParticipant.jsx";

// import CreateEvent from "./pages/Event/CreateEvent.jsx";
// import EditEvent from "./pages/Event/EditEvent.jsx";
// import ShowEvent from "./pages/Event/ShowEvent.jsx";
// import DeleteEvent from "./pages/Event/DeleteEvent.jsx";

// import CreateRegistration from "./pages/Registration/CreateRegistration.jsx";
// import EditRegistration from "./pages/Registration/EditRegistration.jsx";
// import ShowRegistration from "./pages/Registration/ShowRegistration.jsx";
// import DeleteRegistration from "./pages/Registration/DeleteRegistration.jsx";

// import CreateScore from "./pages/Score/CreateScore.jsx";
// import EditScore from "./pages/Score/EditScore.jsx";
// import ShowScore from "./pages/Score/ShowScore.jsx";
// import DeleteScore from "./pages/Score/DeleteScore.jsx";

// import CaptainDashboard from "./pages/Captain/CaptainDashboard.jsx";
// import EventView from "./pages/Captain/EventView.jsx";

// import "./index.css";
// import Scoreboard from "./pages/Scoreboard.jsx";
// import AdminEventView from "./components/admin/AdminEventView.jsx";
// import Events from "./pages/Events.jsx";
// import EventPage from "./pages/EventPage.jsx";

// const App = () => { // Changed component name from Participant to App
//   return (
//     <Auth0Provider
//       domain="dev-c7fiqa1rj3dt5eb0.us.auth0.com" // <-- PASTE YOUR NEW DOMAIN
//       clientId="i9L3qP0AKqqPEufUmyjUlm8xMLAxaE7r" // <-- PASTE YOUR NEW CLIENT ID
//       authorizationParams={{
//         redirect_uri: window.location.origin,
//       }}
//     >
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/admin/event/view/:id" element={<AdminEventView />} />
//         <Route path="/scoreboard" element={<Scoreboard />} />
//         <Route path="/events" element={<Events />} />
//         <Route path="/event/:id" element={<EventPage />} />

//         <Route path="/participant/create" element={<CreateParticipant />} />
//         <Route path="/participant/details/:id" element={<ShowParticipant />} />
//         <Route path="/participant/edit/:id" element={<EditParticipant />} />
//         <Route path="/participant/delete/:id" element={<DeleteParticipant />} />

//         <Route path="/event/create" element={<CreateEvent />} />
//         <Route path="/event/details/:id" element={<ShowEvent />} />
//         <Route path="/event/edit/:id" element={<EditEvent />} />
//         <Route path="/event/delete/:id" element={<DeleteEvent />} />

//         <Route path="/registration/create" element={<CreateRegistration />} />
//         <Route path="/registration/details/:id" element={<ShowRegistration />} />
//         <Route path="/registration/edit/:id" element={<EditRegistration />} />
//         <Route path="/registration/delete/:id" element={<DeleteRegistration />} />

//         <Route path="/score/create" element={<CreateScore />} />
//         <Route path="/score/details/:id" element={<ShowScore />} />
//         <Route path="/score/edit/:id" element={<EditScore />} />
//         <Route path="/score/delete/:id" element={<DeleteScore />} />

//         <Route path="/captain" element={<CaptainDashboard />} />
//         <Route path="/captain/event/view/:id" element={<EventView />} />
//       </Routes>
//     </Auth0Provider>
//   );
// };

// export default App; // Changed default export

