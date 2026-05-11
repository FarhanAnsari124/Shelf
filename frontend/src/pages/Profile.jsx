import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  Bell,
  User,
  Settings,
  Eye,
  CheckCircle,
  Lock,
  AlertTriangle,
  Edit,
  ChevronDown,
  Phone,
  Camera,
  X,
} from "lucide-react";
import Avatar from "../components/Avatar";
import TrustBadge from "../components/TrustBadge";
import RatingStars from "../components/RatingStars";
import ListingCard from "../components/ListingCard";
import { CATEGORIES, fmtPrice, timeAgo, API_URL } from "../data";

export default function Profile({ setView, user, setUser, initialTab = "listings" }) {
  const [tab, setTab] = useState(initialTab);
  const [myListings, setMyListings] = useState([]);
  const [activeSetting, setActiveSetting] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    yearOfStudy: user?.yearOfStudy || "",
    hostel: user?.hostel || "",
    whatsapp: user?.whatsapp || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/listings`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const fetched = data.data
              .map((item) => ({
                id: item._id,
                title: item.title,
                price: item.price,
                condition: item.condition,
                description: item.description,
                category: item.category,
                tags: item.tags || [],
                createdAt: item.createdAt,
                images: item.images || [],
                seller: {
                  name: item.sellerId?.name || "Unknown User",
                  avatarUrl: item.sellerId?.avatarUrl,
                  trustScore: item.sellerId?.trustScore || 0,
                  role: item.sellerId?.role || "student",
                  avgRating: item.sellerId?.avgRating || 0,
                },
              }))
              .filter((l) => l.seller.name === user.name);
            setMyListings(fetched);
          }
        });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("department", editData.department);
    formData.append("yearOfStudy", editData.yearOfStudy);
    formData.append("hostel", editData.hostel);
    formData.append("whatsapp", editData.whatsapp);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("shelf_token")}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowEdit(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAF8", paddingTop: 80 }}>
        <div className="text-center">
          <p className="pp font-bold text-gray-500 mb-4">Sign in to view your profile</p>
          <button onClick={() => setView("auth")} className="btnr pp font-bold text-white px-8 py-3.5 rounded-xl" style={{ background: "#FF3300", border: "none", cursor: "pointer" }}>
            Sign In
          </button>
        </div>
      </div>
    );

  return (
    <div className="pt-24 pb-20 px-10" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="rounded-full object-cover" style={{ width: 80, height: 80 }} />
              ) : (
                <Avatar name={user.name} size={80} fontSize={32} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="pp font-extrabold text-2xl" style={{ color: "#111" }}>{user.name}</h1>
                {user.isVerified && (
                  <span className="pp flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#16a34a" }}>
                    <CheckCircle size={11} /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-1">{user.rollNumber}</p>
              <p className="text-sm text-gray-400">
                {user.department || "No Dept"} · {user.yearOfStudy ? `Year ${user.yearOfStudy}` : "No Year"} · {user.hostel || "No Hostel"}
              </p>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="pp flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl"
              style={{ border: "2px solid #E8E6E3", background: "transparent", color: "#555", cursor: "pointer" }}
            >
              <Edit size={13} /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-50">
            {[
              ["Trust Score", (user.trustScore || 0) + "/100"],
              ["Avg Rating", (user.avgRating || 0).toFixed(1) + " ★"],
              ["Reviews", user.ratingCount || 0],
              ["Listings", myListings.length],
            ].map(([k, v]) => (
              <div key={k} className="text-center p-4 rounded-2xl" style={{ background: "#F8F7F5" }}>
                <p className="pp font-extrabold text-xl mb-0.5" style={{ color: "#111" }}>{v}</p>
                <p className="pp text-xs text-gray-400">{k}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            ["listings", "Active Listings"],
            ["reviews", "Reviews"],
            ["settings", "Settings"],
          ].map(([t, l]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pp text-sm font-semibold px-5 py-2.5 rounded-xl"
              style={{
                background: tab === t ? "#111" : "#fff",
                color: tab === t ? "#fff" : "#666",
                border: tab === t ? "2px solid #111" : "1.5px solid #E0DDD9",
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {tab === "listings" && (
          <div className="grid grid-cols-3 gap-5">
            {myListings.map((item) => (
              <ListingCard key={item.id} item={item} onClick={() => {}} savedIds={[]} onToggleSave={() => {}} />
            ))}
            {myListings.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="pp text-sm text-gray-400 font-medium">No active listings yet.</p>
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            {[
              {
                id: "notif",
                label: "Notification Preferences",
                icon: Bell,
                content: (
                  <div className="p-5 border-t border-gray-50 flex flex-col gap-4 bg-gray-50/50">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">Push Notifications</span>
                      <input type="checkbox" defaultChecked className="accent-[#FF3300]" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">Email Alerts</span>
                      <input type="checkbox" defaultChecked className="accent-[#FF3300]" />
                    </label>
                    <button onClick={() => alert("Preferences saved!")} className="btnr mt-2 pp font-semibold text-white px-5 py-2.5 rounded-xl text-sm" style={{ background: "#111", alignSelf: "flex-start" }}>Save Preferences</button>
                  </div>
                ),
              },
              {
                id: "password",
                label: "Change Password",
                icon: Lock,
                content: (
                  <div className="p-5 border-t border-gray-50 flex flex-col gap-4 bg-gray-50/50">
                    <input type="password" placeholder="Current Password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <button onClick={() => alert("Password updated successfully!")} className="btnr mt-2 pp font-semibold text-white px-5 py-2.5 rounded-xl text-sm" style={{ background: "#111", alignSelf: "flex-start" }}>Change Password</button>
                  </div>
                ),
              },
              {
                id: "deactivate",
                label: "Deactivate Account",
                icon: AlertTriangle,
                content: (
                  <div className="p-5 border-t border-gray-50 flex flex-col gap-4 bg-red-50/30">
                    <p className="text-sm text-red-600 font-medium">Warning: This action cannot be undone.</p>
                    <button onClick={() => { if(window.confirm('Sure?')) { setUser(null); setView('landing'); } }} className="btnr mt-2 pp font-semibold text-white px-5 py-2.5 rounded-xl text-sm" style={{ background: "#dc2626", alignSelf: "flex-start" }}>Deactivate</button>
                  </div>
                ),
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSetting === item.id;
              return (
                <div key={item.id} className="border-b border-gray-50 last:border-0">
                  <button onClick={() => setActiveSetting(isActive ? null : item.id)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors" style={{ border: "none", cursor: "pointer", background: isActive ? "#fafafa" : "transparent" }}>
                    <div className="flex items-center gap-3">
                      <Icon size={16} color={item.id === "deactivate" ? "#dc2626" : "#888"} />
                      <span className="pp text-sm font-medium" style={{ color: item.id === "deactivate" ? "#dc2626" : "#333" }}>{item.label}</span>
                    </div>
                    <ChevronDown size={14} color="#bbb" style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </button>
                  {isActive && item.content}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEdit(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="pp font-extrabold text-xl">Edit Profile</h2>
              <button onClick={() => setShowEdit(false)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={20} color="#999" /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 flex flex-col gap-5 overflow-y-auto" style={{ maxHeight: "70vh" }}>
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="relative">
                  <div className="rounded-full overflow-hidden border-4 border-gray-50" style={{ width: 100, height: 100 }}>
                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <Avatar name={user.name} size={100} fontSize={40} />}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera size={16} color="#FF3300" />
                    <input type="file" className="hidden" accept="image/*" onChange={onAvatarChange} />
                  </label>
                </div>
                <p className="pp text-xs text-gray-400 font-semibold uppercase tracking-wider">Change Photo</p>
              </div>

              <div>
                <label className="pp text-xs font-semibold text-gray-500 mb-1.5 block">Display Name</label>
                <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#FF3300] outline-none text-sm transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="pp text-xs font-semibold text-gray-500 mb-1.5 block">Department</label>
                  <input value={editData.department} onChange={(e) => setEditData({...editData, department: e.target.value})} placeholder="e.g. CSE, ME" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm" />
                </div>
                <div>
                  <label className="pp text-xs font-semibold text-gray-500 mb-1.5 block">Year of Study</label>
                  <select value={editData.yearOfStudy} onChange={(e) => setEditData({...editData, yearOfStudy: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm">
                    <option value="">Select Year</option>
                    {[1,2,3,4,5,6].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="pp text-xs font-semibold text-gray-500 mb-1.5 block">Hostel Name</label>
                <input value={editData.hostel} onChange={(e) => setEditData({...editData, hostel: e.target.value})} placeholder="e.g. Ganga, Yamuna" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm" />
              </div>

              <div>
                <label className="pp text-xs font-semibold text-gray-500 mb-1.5 block">WhatsApp Number</label>
                <input value={editData.whatsapp} onChange={(e) => setEditData({...editData, whatsapp: e.target.value})} placeholder="+91 XXXXXXXXXX" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm" />
              </div>

              <button disabled={saving} className="btnr mt-4 pp font-bold text-white rounded-xl py-4 flex items-center justify-center gap-2" style={{ background: "#FF3300", border: "none", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
