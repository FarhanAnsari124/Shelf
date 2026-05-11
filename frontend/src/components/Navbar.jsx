import React, { useState, useEffect } from "react";
import {
  Bell,
  MessageCircle,
  Plus,
  User,
  LogOut,
  Settings,
  BarChart2,
  Bookmark,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import Avatar from "./Avatar";

export default function Navbar({ view, setView, user, setUser, setAuthMode, goBack }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);

    const fetchUnread = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:5000/api/conversations", {
          headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` },
        });
        const data = await res.json();
        if (data.success) {
          const total = data.data.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
          setUnreadCount(total);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnread();

    let sock;
    if (user) {
      import("../socket").then(({ socket }) => {
        sock = socket;
        socket.on("unread_update", fetchUnread);
      });
    }

    return () => {
      window.removeEventListener("scroll", h);
      if (sock) sock.off("unread_update", fetchUnread);
    };
  }, [user]);

  const isLanding = view === "landing";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10"
      style={{
        height: 64,
        background: scrolled || !isLanding ? "rgba(250,250,248,.94)" : "transparent",
        backdropFilter: scrolled || !isLanding ? "blur(16px)" : "none",
        borderBottom: scrolled || !isLanding ? "1px solid #EEECE9" : "1px solid transparent",
        transition: "all .3s ease",
      }}
    >
      <div className="flex items-center gap-3">
        {goBack && !isLanding && (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 pp text-sm font-semibold"
            style={{
              color: "#555",
              border: "none",
              background: "none",
              cursor: "pointer",
              transition: "color .15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3300")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            <ArrowLeft size={15} />
            Back
          </button>
        )}
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-2.5"
          style={{ border: "none", background: "none", cursor: "pointer" }}
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 34, height: 34, background: "#111" }}
          >
            <span className="pp font-black text-sm" style={{ color: "#FF3300" }}>
              S
            </span>
          </div>
          <span
            className="pp font-extrabold text-lg tracking-tight"
            style={{ color: "#111" }}
          >
            SHELF
          </span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {[
          ["browse", "Browse"],
          ["browse", "Categories"],
          ["landing", "How It Works"],
        ].map(([v, l]) => (
          <button
            key={l}
            onClick={() => setView(v)}
            className="nl pp text-sm font-medium"
            style={{
              color: "#555",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={() => setView("post")}
              className="btnr pp hidden md:flex items-center gap-1.5 text-sm font-semibold text-white rounded-xl px-4 py-2"
              style={{
                background: "#FF3300",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> Post Ad
            </button>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((p) => !p)}
                className="relative flex items-center justify-center rounded-xl"
                style={{
                  width: 38,
                  height: 38,
                  background: "#F5F3F0",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Bell size={16} color="#555" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
                  <p className="pp font-bold text-sm text-gray-900 mb-3">
                    Notifications
                  </p>
                  <p className="text-xs text-gray-500 text-center py-4">
                    No new notifications
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setView("conversations")}
              className="relative flex items-center justify-center rounded-xl"
              style={{
                width: 38,
                height: 38,
                background: "#F5F3F0",
                border: "none",
                cursor: "pointer",
              }}
            >
              <MessageCircle size={16} color="#555" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: "#FF3300",
                    border: "1.5px solid #F5F3F0",
                  }}
                />
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  background: "#F5F3F0",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Avatar name={user.name} src={user.avatarUrl} size={26} />
                <ChevronDown size={13} color="#555" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="pp font-semibold text-sm text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.rollNumber}</p>
                  </div>
                  {[
                    ["profile", <User size={14} />, "My Profile"],
                    ["browse:saved", <Bookmark size={14} />, "Saved Listings"],
                    ...(user.role === "college_admin"
                      ? [["admin", <BarChart2 size={14} />, "Admin Panel"]]
                      : []),
                    ["profile:settings", <Settings size={14} />, "Settings"],
                  ].map(([v, icon, label]) => (
                    <button
                      key={label}
                      onClick={() => {
                        setView(v);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      {icon} {label}
                    </button>
                  ))}
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        setUser(null);
                        setView("landing");
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm"
                      style={{
                        color: "#FF3300",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setAuthMode("login");
                setView("auth");
              }}
              className="pp text-sm font-medium px-4 py-2 rounded-xl"
              style={{
                color: "#111",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setView("auth");
              }}
              className="btnr pp text-sm font-semibold text-white rounded-xl px-5 py-2.5"
              style={{
                background: "#FF3300",
                border: "none",
                cursor: "pointer",
              }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
