import React, { useState } from "react";
import { Heart, MessageCircle, Box, Tag, Eye, Flag, CheckCircle, Lock, Bookmark, Shield, Phone } from "lucide-react";
import Avatar from "../components/Avatar";
import Chat from "./Chat";
import TrustBadge from "../components/TrustBadge";
import RatingStars from "../components/RatingStars";
import ConditionBadge from "../components/ConditionBadge";
import { CATEGORIES, fmtPrice, timeAgo } from "../data";

export default function ListingDetail({ listing: item, setView, user, savedIds, setSavedIds }) {
  const [reported, setReported] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const CatIcon = CATEGORIES.find(c => c.label === item.category)?.icon || Box;
  const saved = savedIds?.includes(item.id);

  if (chatOpen) return (
    <Chat conversation={{ otherUser: item.seller, listing: item, messages: [], lastAt: new Date().toISOString() }}
      setView={v => v === "conversations" ? setChatOpen(false) : setView(v)} user={user} />
  );

  return (
    <div className="pt-24 pb-20 px-4 md:px-10" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
            <div className="relative h-[340px] bg-[#F8F7F5] flex items-center justify-center overflow-hidden">
              {item.images?.length > 0 ? <img src={item.images[0]} className="w-full h-full object-contain" /> : <CatIcon size={80} color="#ccc" />}
              <div className="absolute top-4 left-4"><ConditionBadge c={item.condition} /></div>
              <div className="absolute top-4 right-4">
                <button onClick={() => setSavedIds(p => p?.includes(item.id) ? p.filter(x => x !== item.id) : [...(p || []), item.id])} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow text-xs border-none cursor-pointer">
                  <Heart size={14} fill={saved ? "#FF3300" : "none"} color={saved ? "#FF3300" : "#ccc"} />
                  <span className="pp font-semibold" style={{ color: saved ? "#FF3300" : "#999" }}>{saved ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="pp text-xs font-bold text-[#FF3300] uppercase tracking-widest mb-2">{item.category}</p>
                  <h1 className="pp font-extrabold text-2xl">{item.title}</h1>
                </div>
                <div className="text-right">
                  <div className="pp font-extrabold text-3xl text-[#FF3300]">{fmtPrice(item.price)}</div>
                  {item.mrp > 0 && <div className="text-sm text-gray-400 line-through">{fmtPrice(item.mrp)}</div>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags?.map(t => <span key={t} className="flex items-center gap-1 text-xs px-3 py-1 bg-[#F5F3F0] text-[#777] rounded-full"><Tag size={9} /> {t}</span>)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-[#F8F7F5] rounded-2xl">
                {[["Condition", item.condition], ["Location", item.location || "Campus"], ["Posted", timeAgo(item.createdAt)]].map(([k, v]) => (
                  <div key={k}><p className="pp text-xs font-semibold text-gray-400 mb-0.5">{k}</p><p className="pp text-sm font-bold text-gray-800">{v}</p></div>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mb-6">{item.description}</p>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50 text-[#bbb]">
                <div className="flex items-center gap-1"><Eye size={13} /> <span className="text-xs">{item.viewCount || 0} views</span></div>
                <button onClick={() => setShowReport(!showReport)} className="text-xs ml-auto flex items-center gap-1 border-none bg-none cursor-pointer"><Flag size={11} /> Report</button>
              </div>
              {showReport && !reported && (
                <div className="mt-4 p-4 bg-[#FFF5F5] border border-[#FFE0E0] rounded-xl">
                  <p className="pp text-sm font-semibold mb-3">Report listing</p>
                  <div className="flex flex-col gap-2 mb-3">
                    {["Fake / Scam", "Inappropriate", "Already sold", "Spam"].map(r => (
                      <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="radio" name="reason" value={r} onChange={e => setReportReason(e.target.value)} /> {r}
                      </label>
                    ))}
                  </div>
                  <button onClick={() => setReported(true)} disabled={!reportReason} className="pp text-xs font-bold text-white px-4 py-2 bg-[#dc2626] rounded-xl border-none opacity-80">Submit</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={item.seller.name} src={item.seller.avatarUrl} size={52} fontSize={20} />
              <div><p className="pp font-bold text-base">{item.seller.name}</p><p className="text-xs text-gray-400">{item.seller.dept} · Year {item.seller.year}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[["Trust", <TrustBadge score={item.seller.trustScore} />], ["Rating", <RatingStars rating={item.seller.avgRating} />], ["Reviews", <span className="pp text-xs font-bold">{item.seller.ratingCount}</span>]].map(([k, v]) => (
                <div key={k} className="text-center p-3 bg-[#F8F7F5] rounded-xl"><p className="pp text-xs text-gray-400 mb-1">{k}</p><div className="flex justify-center">{v}</div></div>
              ))}
            </div>
            {user && (user.id || user._id) === (item.seller.id || item.seller._id) ? (
              <div className="w-full py-3 bg-[#F5F3F0] text-[#999] text-center rounded-xl text-sm font-semibold">Your listing</div>
            ) : user ? (
              <button onClick={() => setChatOpen(true)} className="btnr w-full pp font-bold text-sm text-white py-4 bg-[#FF3300] rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer"><MessageCircle size={15} /> Chat with Seller</button>
            ) : (
              <button onClick={() => setView("auth")} className="btnr w-full pp font-bold text-sm text-white py-4 bg-[#FF3300] rounded-xl border-none cursor-pointer">Sign In to Chat</button>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="pp text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Safety Tips</p>
            {["Meet in public", "Inspect before paying", "No upfront money"].map(tip => (
              <div key={tip} className="flex items-start gap-2 mb-2"><Shield size={12} color="#22c55e" className="mt-0.5" /><p className="text-xs text-gray-500">{tip}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
