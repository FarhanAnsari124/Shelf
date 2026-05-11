import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { fmtPrice, API_URL } from "../data";
import Avatar from "../components/Avatar";

export default function Chat({ conversation: initialConv, setView, user }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmt, setOfferAmt] = useState("");
  const [loading, setLoading] = useState(true);
  const [convId, setConvId] = useState(initialConv.id || initialConv._id);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const myId = user?.id || user?._id;
  const otherUser = initialConv.otherUser;

  const markRead = async () => {
    if (!convId) return;
    try {
      await fetch(`${API_URL}/api/conversations/${convId}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` },
      });
    } catch (e) { console.error(e); }
  };

  const fetchMessages = async () => {
    if (!convId) return;
    try {
      const res = await fetch(`${API_URL}/api/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` },
      });
      const data = await res.json();
      if (data.success) setMsgs(data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    const init = async () => {
      if (convId) {
        fetchMessages();
        markRead();
      } else {
        const lId = initialConv.listing.id || initialConv.listing._id;
        const oId = otherUser.id || otherUser._id;
        try {
          const res = await fetch(`${API_URL}/api/conversations/find?listingId=${lId}&receiverId=${oId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` },
          });
          const data = await res.json();
          if (data.success && data.data) setConvId(data.data._id);
          else setLoading(false);
        } catch (e) { setLoading(false); }
      }
    };
    init();

    let sock;
    import("../socket").then(({ socket }) => {
      sock = socket;
      socket.on("new_message", (data) => {
        const lId = initialConv.listing.id || initialConv.listing._id;
        const oId = otherUser.id || otherUser._id;
        const match = convId ? data.conversationId === convId : (data.listingId === lId && data.senderId === oId);
        if (match) {
          if (!convId) setConvId(data.conversationId);
          setMsgs(p => p.some(m => (m._id || m.id) === (data.message._id || data.message.id)) ? p : [...p, data.message]);
          markRead();
        }
      });
      socket.on("offer_updated", (data) => {
        setMsgs(p => p.map(m => (m._id || m.id) === data.messageId ? { ...m, offer: { ...m.offer, status: data.status } } : m));
      });
    });

    return () => {
      if (sock) {
        sock.off("new_message");
        sock.off("offer_updated");
      }
    };
  }, [convId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const sendMsg = async (type = "text", content = "", offer = null) => {
    if (sending) return;
    const lId = initialConv.listing.id || initialConv.listing._id;
    const rId = otherUser.id || otherUser._id;

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("shelf_token")}`,
        },
        body: JSON.stringify({ listingId: lId, receiverId: rId, type, content, offer }),
      });
      const data = await res.json();
      if (data.success) {
        if (!convId) setConvId(data.data.conversationId);
        setMsgs(p => p.some(m => (m._id || m.id) === (data.data._id || data.data.id)) ? p : [...p, data.data]);
        setInput("");
        setShowOffer(false);
        setOfferAmt("");
      }
    } catch (e) { console.error(e); } finally { setSending(false); }
  };

  const respondOffer = async (msgId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/conversations/offers/${msgId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("shelf_token")}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) setMsgs(p => p.map(m => m._id === msgId ? data.data : m));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col" style={{ height: "100vh", background: "#FAFAF8", paddingTop: 64 }}>
      <div className="flex items-center gap-4 px-4 md:px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <Avatar name={otherUser.name} src={otherUser.avatarUrl} size={40} fontSize={16} />
        <div className="flex-1">
          <p className="pp font-bold text-sm text-gray-900">{otherUser.name}</p>
          <p className="text-xs text-gray-400">{initialConv.listing.title}</p>
        </div>
        <div className="pp font-extrabold text-base" style={{ color: "#FF3300" }}>{fmtPrice(initialConv.listing.price)}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-3">
        {loading ? <p className="text-center text-gray-400 text-xs py-10">Loading...</p> : msgs.length === 0 ? <p className="text-center text-gray-400 text-xs py-10">No messages yet</p> : msgs.map(m => {
          const mine = (m.senderId === myId || m.senderId?._id === myId);
          if (m.type === "offer") {
            const colors = { pending: "#b45309", accepted: "#16a34a", declined: "#dc2626" };
            const bgs = { pending: "#FEF3C7", accepted: "#DCFCE7", declined: "#FEE2E2" };
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className="max-w-xs rounded-2xl p-4 border" style={{ background: bgs[m.offer.status] || "#F5F3F0", border: `1px solid ${colors[m.offer.status]}30` }}>
                  <p className="pp text-xs font-bold mb-1" style={{ color: colors[m.offer.status] || "#555" }}>{mine ? "Your Offer" : "Incoming Offer"}</p>
                  <p className="pp font-extrabold text-xl mb-1">{fmtPrice(m.offer.amount)}</p>
                  <p className="pp text-xs font-semibold capitalize" style={{ color: colors[m.offer.status] }}>{m.offer.status}</p>
                  {!mine && m.offer.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => respondOffer(m._id, "accepted")} className="pp flex-1 text-xs font-bold text-white py-2 rounded-xl" style={{ background: "#16a34a", border: "none" }}>Accept</button>
                      <button onClick={() => respondOffer(m._id, "declined")} className="pp flex-1 text-xs font-bold py-2 rounded-xl" style={{ background: "transparent", border: "1.5px solid #dc2626", color: "#dc2626" }}>Decline</button>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-sm px-4 py-2.5 text-sm ${mine ? "chat-bubble-out" : "chat-bubble-in"}`} style={{ background: mine ? "#FF3300" : "#fff", color: mine ? "#fff" : "#111", border: mine ? "none" : "1px solid #F0EDE9" }}>{m.content}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {showOffer && (
        <div className="px-4 md:px-6 py-4 bg-white border-t border-gray-100">
          <p className="pp text-sm font-bold text-gray-700 mb-3">Make an Offer</p>
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
              <span className="pp font-bold text-sm text-gray-400">₹</span>
              <input type="number" value={offerAmt} onChange={(e) => setOfferAmt(e.target.value)} placeholder="Amount" className="flex-1 text-sm bg-transparent" style={{ color: "#111", border: "none" }} />
            </div>
            <button onClick={() => sendMsg("offer", "", { amount: +offerAmt })} disabled={sending || !offerAmt} className="pp font-bold text-sm text-white px-5 py-2.5 rounded-xl" style={{ background: (sending || !offerAmt) ? "#ccc" : "#FF3300", border: "none" }}>{sending ? "Sending..." : "Send"}</button>
            <button onClick={() => setShowOffer(false)} className="pp text-sm text-gray-400 px-3 py-2.5 rounded-xl" style={{ background: "#F5F3F0", border: "none" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="px-4 md:px-6 py-4 bg-white border-t border-gray-100 flex items-center gap-3">
        <button onClick={() => setShowOffer(p => !p)} className="pp text-xs font-bold px-4 py-2.5 rounded-xl" style={{ background: showOffer ? "#111" : "#F5F3F0", color: showOffer ? "#fff" : "#555", border: "none" }}>Make Offer</button>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 border border-gray-200">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg("text", input.trim())} placeholder="Type a message..." className="flex-1 text-sm bg-transparent" style={{ color: "#111", border: "none" }} />
        </div>
        <button onClick={() => sendMsg("text", input.trim())} disabled={!input.trim() || sending} className="flex items-center justify-center rounded-2xl" style={{ width: 44, height: 44, background: (input.trim() && !sending) ? "#FF3300" : "#F5F3F0", border: "none" }}><Send size={16} color={(input.trim() && !sending) ? "#fff" : "#bbb"} /></button>
      </div>
    </div>
  );
}
