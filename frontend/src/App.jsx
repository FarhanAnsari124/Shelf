import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Laptop,
  Bike,
  Sofa,
  Utensils,
  Wrench,
  Ticket,
  Home,
  Box,
  MapPin,
  Zap,
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
.pp{font-family:'Poppins',sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.a1{animation:fadeUp .65s ease both}
.a2{animation:fadeUp .65s .12s ease both}
.a3{animation:fadeUp .65s .24s ease both}
.a4{animation:fadeUp .65s .36s ease both}
.a5{animation:fadeUp .65s .48s ease both}
.lift{transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease}
.lift:hover{transform:translateY(-5px);box-shadow:0 20px 48px rgba(0,0,0,.12)}
.btnr{transition:all .18s ease}
.btnr:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,51,0,.38)}
.nl{position:relative;text-decoration:none}
.nl::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#FF3300;transition:width .25s ease}
.nl:hover::after{width:100%}
.tk{animation:ticker 34s linear infinite}
.blink{animation:pulse 2s ease infinite}
input,textarea,select{outline:none}
input[type="password"]::-ms-reveal,input[type="password"]::-ms-clear{display:none}
input[type="password"]::-webkit-credentials-auto-fill-button,input[type="password"]::-webkit-strong-password-auto-fill-button{display:none !important}
input[type="password"]::-webkit-contacts-auto-fill-button{display:none !important}
*{box-sizing:border-box}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#ddd;border-radius:10px}
.chat-bubble-in{border-radius:18px 18px 18px 4px}
.chat-bubble-out{border-radius:18px 18px 4px 18px}
@media (max-width: 768px) {
  .px-10 { padding-left: 20px !important; padding-right: 20px !important; }
  .pt-24 { padding-top: 80px !important; }
  .grid-cols-3, .grid-cols-4 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
  .grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
  h1 { font-size: 32px !important; letter-spacing: -1px !important; }
  .text-lg { font-size: 16px !important; }
  .max-w-4xl, .max-w-6xl { width: 100% !important; margin: 0 !important; }
}
`;

export const CATEGORIES = [
  { label: "Books", icon: BookOpen, sub: "Textbooks, Notes, Solved Papers" },
  { label: "Electronics", icon: Laptop, sub: "Laptops, Phones, Gadgets" },
  { label: "Vehicles", icon: Bike, sub: "Cycles, Scooters" },
  { label: "Furniture", icon: Sofa, sub: "Desks, Chairs, Fans" },
  { label: "Food & Kitchen", icon: Utensils, sub: "Kettle, Utensils" },
  { label: "Services", icon: Wrench, sub: "Tutoring, Design" },
  { label: "Events", icon: Ticket, sub: "Fest, Concert Passes" },
  { label: "Room & PG", icon: Home, sub: "Sublet, Roommates" },
  { label: "Rides", icon: Zap, sub: "Carpool, Airport Drops" },
  { label: "Lost & Found", icon: MapPin, sub: "Lost/Found on Campus" },
  { label: "Miscellaneous", icon: Box, sub: "Everything else" },
];

export const CONDITIONS = ["New", "Like New", "Good", "Used", "For Parts"];

export function validateRoll(rn) {
  return /^\d{13}$/.test(rn);
}

export function decodeRoll(rn) {
  if (!validateRoll(rn)) return null;
  return {
    year: "20" + rn.slice(0, 2),
    college: rn.slice(2, 6),
    studentId: rn.slice(6),
  };
}

export function fmtPrice(p) {
  return p === 0 ? "Free" : "₹" + p.toLocaleString("en-IN");
}

export function timeAgo(d) {
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Browse from "./pages/Browse";
import ListingDetail from "./pages/ListingDetail";
import PostAd from "./pages/PostAd";
import Conversations from "./pages/Conversations";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      import("./socket").then(({ socket }) => {
        socket.connect();
        socket.emit("join", user.id || user._id);
      });
    }
  }, [user]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);
  const [authMode, setAuthMode] = useState("register");
  const [savedIds, setSavedIds] = useState([]);
  const [history, setHistory] = useState([]);

  const goView = (v) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setHistory((prev) => [...prev, view]);
    setView(v);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView(prev);
  };

  return (
    <div
      style={{
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        background: "#FAFAF8",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      <style>{CSS}</style>
      <Navbar
        view={view}
        setView={goView}
        user={user}
        setUser={setUser}
        setAuthMode={setAuthMode}
        goBack={history.length > 0 ? goBack : null}
      />
      {view === "landing" && (
        <Landing
          setView={goView}
          setAuthMode={setAuthMode}
          savedIds={savedIds}
          setSavedIds={setSavedIds}
          setSelected={setSelectedListing}
          user={user}
        />
      )}
      {view === "auth" && (
        <AuthPage
          mode={authMode}
          setView={goView}
          setUser={setUser}
          onModeChange={setAuthMode}
        />
      )}
      {view.startsWith("browse") && (
        <Browse
          setView={goView}
          setSelected={setSelectedListing}
          user={user}
          savedIds={savedIds}
          setSavedIds={setSavedIds}
          initialFilter={view.includes("saved") ? "saved" : "all"}
          initialSearch={view.split(":")[2] || ""}
        />
      )}
      {view === "listing" && selectedListing && (
        <ListingDetail
          listing={selectedListing}
          setView={goView}
          user={user}
          savedIds={savedIds}
          setSavedIds={setSavedIds}
        />
      )}
      {view === "post" && <PostAd setView={goView} user={user} />}
      {view === "conversations" && (
        <Conversations
          setView={goView}
          setSelectedConv={setSelectedConv}
          user={user}
        />
      )}
      {view === "chat" && selectedConv && (
        <Chat conversation={selectedConv} setView={goView} user={user} />
      )}
      {view.startsWith("profile") && (
        <Profile
          setView={goView}
          user={user}
          setUser={setUser}
          initialTab={view.split(":")[1] || "listings"}
        />
      )}
      {view === "admin" && <AdminPanel setView={goView} user={user} />}
    </div>
  );
}
