import React, { useState } from "react";
import { Search, MessageCircle, CheckCircle, Users, FileText, AlertTriangle, TrendingUp, Award } from "lucide-react";
import { API_URL } from "../data";

export default function AdminPanel({ setView, user }) {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState({ listings: 0, users: 0, reports: 0, colleges: 0 });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  React.useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
      });
  }, []);

  React.useEffect(() => {
    if (tab === "users") {
      setLoadingUsers(true);
      fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` }
      })
        .then(res => res.json())
        .then(res => {
          setLoadingUsers(false);
          if (res.success) setUsers(res.data);
        });
    }
  }, [tab]);

  const stats = [
    ["Active Listings", data.listings.toString(), TrendingUp, "#FF3300"],
    ["Verified Students", data.users.toString(), Users, "#4F46E5"],
    ["Reports Pending", data.reports.toString(), AlertTriangle, "#b45309"],
    ["Colleges", data.colleges.toString(), Award, "#16a34a"],
  ];

  return (
    <div className="pt-24 pb-20 px-4 md:px-10" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <p className="pp text-xs font-bold text-[#FF3300] uppercase tracking-widest mb-1">College Admin</p>
            <h1 className="pp font-extrabold text-3xl">Admin Panel</h1>
          </div>
          <span className="pp text-xs font-semibold px-3 py-1.5 bg-[#DCFCE7] text-[#16a34a] rounded-full flex items-center gap-1.5 self-start sm:self-auto"><span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" /> All Systems Operational</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
          {stats.map(([label, val, Icon, color]) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl mb-4" style={{ background: `${color}18` }}><Icon size={20} color={color} /></div>
              <p className="pp font-extrabold text-2xl md:text-3xl text-[#111]">{val}</p>
              <p className="pp text-xs md:text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {[["dashboard", "Moderation"], ["users", "Users"], ["analytics", "Analytics"]].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} className="pp text-sm font-semibold px-5 py-2.5 rounded-xl border-1.5 whitespace-nowrap" style={{ background: tab === t ? "#111" : "#fff", color: tab === t ? "#fff" : "#666", borderColor: tab === t ? "#111" : "#E0DDD9" }}>{l}</button>
          ))}
        </div>

        {tab === "dashboard" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-white rounded-3xl border border-gray-100"><CheckCircle size={40} color="#16a34a" className="mb-4" /><p className="pp font-semibold">Moderation queue is empty!</p></div>
        ) : tab === "users" ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
              <Search size={15} color="#bbb" />
              <input placeholder="Search users by name or roll number..." className="flex-1 text-sm bg-transparent border-none outline-none" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Roll Number</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FF330010] text-[#FF3300] flex items-center justify-center font-bold text-[10px]">{u.name?.charAt(0)}</div>
                          <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.rollNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.department || "N/A"}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-[#FF3300] bg-transparent border-none cursor-pointer">Manage</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loadingUsers && (
                    <tr><td colSpan="4" className="py-20 text-center text-gray-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100"><p className="pp font-bold mb-5">Platform Activity</p>
              <div className="flex flex-col gap-4">
                {[["Today's Listings", data.listings, TrendingUp, "#16a34a"], ["Today's Signups", data.users, Users, "#4F46E5"], ["Messages Sent", "0", MessageCircle, "#FF3300"]].map(([l, v, Icon, c]) => (
                  <div key={l} className="flex justify-between p-3 bg-[#F8F7F5] rounded-xl"><div className="flex items-center gap-3"><Icon size={15} color={c} /><span className="text-sm text-gray-600">{l}</span></div><span className="pp font-bold text-sm">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
