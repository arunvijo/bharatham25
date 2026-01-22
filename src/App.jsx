import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

// Critical UI components are kept as static imports for immediate visibility
import { SmoothCursor } from "./components/TextCursor.jsx";
import DesiBackground from "./components/DesiBackground";
import BackgroundMusic from "./components/BackgroundMusic";
import "./index.css";

// --- LAZY LOADED ROUTES ---
// Core Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const Scoreboard = lazy(() => import("./pages/Scoreboard.jsx"));
const Events = lazy(() => import("./pages/Events.jsx"));
const EventPage = lazy(() => import("./pages/EventPage.jsx"));
const Credits = lazy(() => import("./pages/Credits.jsx"));
const AdminEventView = lazy(() => import("./components/admin/AdminEventView.jsx"));
const SpecialEventPage = lazy(() => import("./pages/SpecialEventPage.jsx"));
const WinnersPage = lazy(() => import("./components/WinnersPage.jsx"));

// Participant Routes
const CreateParticipant = lazy(() => import("./pages/Participant/CreateParticipant.jsx"));
const EditParticipant = lazy(() => import("./pages/Participant/EditParticipant.jsx"));
const ShowParticipant = lazy(() => import("./pages/Participant/ShowParticipant.jsx"));
const DeleteParticipant = lazy(() => import("./pages/Participant/DeleteParticipant.jsx"));

// Event Routes
const CreateEvent = lazy(() => import("./pages/Event/CreateEvent.jsx"));
const EditEvent = lazy(() => import("./pages/Event/EditEvent.jsx"));
const ShowEvent = lazy(() => import("./pages/Event/ShowEvent.jsx"));
const DeleteEvent = lazy(() => import("./pages/Event/DeleteEvent.jsx"));

// Admin Registration Routes
const CreateRegistration = lazy(() => import("./pages/Registration/CreateRegistration.jsx"));
const EditRegistration = lazy(() => import("./pages/Registration/EditRegistration.jsx"));
const ShowRegistration = lazy(() => import("./pages/Registration/ShowRegistration.jsx"));
const DeleteRegistration = lazy(() => import("./pages/Registration/DeleteRegistration.jsx"));

// Score Routes
const CreateScore = lazy(() => import("./pages/Score/CreateScore.jsx"));
const EditScore = lazy(() => import("./pages/Score/EditScore.jsx"));
const ShowScore = lazy(() => import("./pages/Score/ShowScore.jsx"));
const DeleteScore = lazy(() => import("./pages/Score/DeleteScore.jsx"));

// Captain Routes
const CaptainDashboard = lazy(() => import("./pages/Captain/CaptainDashboard.jsx"));
const EventView = lazy(() => import("./pages/Captain/EventView.jsx"));
const CaptainCreateRegistration = lazy(() => import("./pages/Captain/CreateRegistration.jsx"));
const CaptainEditRegistration = lazy(() => import("./pages/Captain/EditRegistration.jsx"));

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

      <div className="relative z-10">
        {/* Suspense provides a loading state while the browser fetches the page chunk */}
        <Suspense 
          fallback={
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
              <div className="text-xl animate-pulse">Loading Bharatham 2025...</div>
            </div>
          }
        >
          <Routes>
            {/* Public & Admin Base Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/event/view/:id" element={<AdminEventView />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/special-event/group-dance" element={<SpecialEventPage />} /> 
            <Route path="/winners" element={<WinnersPage />} />
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
            <Route path="/captain/registration/edit/:id" element={<CaptainEditRegistration />} />
          </Routes>
        </Suspense>
      </div>
    </Auth0Provider>
  );
};

export default App;