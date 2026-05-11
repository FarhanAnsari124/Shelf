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
  Zap
} from "lucide-react";

export const CSS = `
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
*{box-sizing:border-box}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#ddd;border-radius:10px}
.chat-bubble-in{border-radius:18px 18px 18px 4px}
.chat-bubble-out{border-radius:18px 18px 4px 18px}
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
