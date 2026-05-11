import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import TrustBadge from "../components/TrustBadge";
import Avatar from "../components/Avatar";
import { timeAgo, API_URL } from "../data";

export default function Conversations({ setView, setSelectedConv, user }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/conversations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` },
        });
        const data = await res.json();
        if (data.success) {
          setConversations(
            data.data.map((c) => {
              const otherUser = c.participants.find(
                (p) => (p._id || p.id) !== (user.id || user._id)
              );
              return {
                id: c._id,
                otherUser: {
                  id: otherUser?._id,
                  name: otherUser?.name || "Deleted User",
                  avatarUrl: otherUser?.avatarUrl,
                  trustScore: otherUser?.trustScore || 0,
                },
                listing: {
                  id: c.listingId?._id,
                  title: c.listingId?.title || "Deleted Listing",
                  price: c.listingId?.price || 0,
                },
                lastMessage: c.lastMessage,
                lastAt: c.lastMessageAt,
                unread: c.unreadCount || 0,
              };
            })
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user.id, user._id]);

  return (
    <div className="pt-24 pb-20 px-10" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="pp font-extrabold text-3xl tracking-tight mb-8" style={{ color: "#111" }}>
          Messages
        </h1>
        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle size={40} color="#ddd" className="mx-auto mb-4" />
            <p className="pp font-semibold text-gray-400">No conversations yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedConv(c);
                  setView("chat");
                }}
                className="lift bg-white rounded-2xl p-5 border border-gray-100 text-left w-full shadow-sm"
                style={{ cursor: "pointer", border: "none" }}
              >
                <div className="flex items-center gap-4">
                  <Avatar name={c.otherUser.name} src={c.otherUser.avatarUrl} size={46} fontSize={18} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <p className="pp font-bold text-sm text-gray-900">{c.otherUser.name}</p>
                        <TrustBadge score={c.otherUser.trustScore} />
                      </div>
                      <span className="text-xs text-gray-400">{timeAgo(c.lastAt)}</span>
                    </div>
                    <p className="pp text-xs text-gray-400 mb-1">{c.listing.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
                      {c.unread > 0 && (
                        <span
                          className="pp flex items-center justify-center text-xs font-bold text-white rounded-full flex-shrink-0 ml-2"
                          style={{ width: 20, height: 20, background: "#FF3300", fontSize: 9 }}
                        >
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
