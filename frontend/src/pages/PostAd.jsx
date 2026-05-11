import React, { useState } from "react";
import { Plus, X, Check, CheckCircle, AlertTriangle } from "lucide-react";
import ConditionBadge from "../components/ConditionBadge";
import Avatar from "../components/Avatar";
import TrustBadge from "../components/TrustBadge";
import { CATEGORIES, CONDITIONS, fmtPrice, API_URL } from "../data";

export default function PostAd({ setView, user }) {
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState("");
  const [form, setForm] = useState({ title: "", description: "", price: "", condition: "", negotiable: true, location: "", tags: "" });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("category", cat);
    files.forEach(f => formData.append("images", f));

    try {
      const res = await fetch(`${API_URL}/api/listings`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("shelf_token")}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else alert(data.message);
    } catch (e) { alert("Network Error"); } finally { setSubmitting(false); }
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] pt-20">
      <div className="text-center">
        <div className="flex items-center justify-center rounded-full mx-auto mb-6 w-20 h-20 bg-[#DCFCE7]"><CheckCircle size={40} color="#16a34a" /></div>
        <h2 className="pp font-extrabold text-3xl mb-2 text-[#111]">Listing Live!</h2>
        <p className="text-gray-500 mb-8">Your ad is now visible to students.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setView("browse")} className="btnr pp font-bold text-white px-8 py-3.5 rounded-xl bg-[#FF3300]">Browse</button>
          <button onClick={() => window.location.reload()} className="pp font-semibold px-8 py-3.5 rounded-xl border-2 border-[#E0DDD9]">Post Another</button>
        </div>
      </div>
    </div>
  );

  const inputStyle = { border: "2px solid #E8E6E3", color: "#111", background: "transparent" };

  return (
    <div className="pt-24 pb-20 px-10 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8"><h1 className="pp font-extrabold text-3xl tracking-tight mb-1">Post an Ad</h1><p className="text-sm text-gray-500">Go live in minutes</p></div>
        <div className="bg-white rounded-3xl p-8 border border-gray-100">
          {step === 1 ? (
            <div>
              <h2 className="pp font-bold text-xl mb-6">Category</h2>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map(c => (
                  <button key={c.label} onClick={() => setCat(c.label)} className="flex flex-col gap-2 p-4 rounded-2xl text-left border-2" style={{ borderColor: cat === c.label ? "#FF3300" : "#E8E6E3", background: cat === c.label ? "#FFF5F2" : "#fff" }}>
                    <c.icon size={22} color={cat === c.label ? "#FF3300" : "#888"} />
                    <span className="pp text-sm font-semibold" style={{ color: cat === c.label ? "#FF3300" : "#333" }}>{c.label}</span>
                  </button>
                ))}
              </div>
              <button disabled={!cat} onClick={() => setStep(2)} className="btnr w-full pp font-bold text-white py-4 rounded-xl mt-8 bg-[#FF3300]" style={{ opacity: cat ? 1 : 0.5 }}>Continue</button>
            </div>
          ) : step === 2 ? (
            <div className="flex flex-col gap-5">
              <input value={form.title} onChange={e => upd("title", e.target.value)} placeholder="Title" className="w-full px-4 py-3 text-sm rounded-xl" style={inputStyle} />
              <textarea value={form.description} onChange={e => upd("description", e.target.value)} rows={4} placeholder="Description" className="w-full px-4 py-3 text-sm rounded-xl" style={inputStyle} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={form.price} onChange={e => upd("price", e.target.value)} placeholder="Price (₹)" className="w-full px-4 py-3 text-sm rounded-xl" style={inputStyle} />
                <select value={form.condition} onChange={e => upd("condition", e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl" style={inputStyle}>
                  <option value="">Condition</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="pp font-semibold px-6 py-3.5 rounded-xl border-2 border-[#E8E6E3]">Back</button>
                <button disabled={!form.title || !form.price} onClick={() => setStep(3)} className="btnr flex-1 pp font-bold text-white py-3.5 rounded-xl bg-[#FF3300]" style={{ opacity: form.title ? 1 : 0.5 }}>Continue</button>
              </div>
            </div>
          ) : step === 3 ? (
            <div>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {files.map((f, i) => (
                  <div key={i} className="relative h-20 bg-[#F0EEF5] rounded-xl overflow-hidden">
                    <img src={URL.createObjectURL(f)} className="object-cover w-full h-full" />
                    <button onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"><X size={10} /></button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center h-20 bg-[#F8F7F5] border-2 border-dashed border-[#E0DDD9] rounded-xl cursor-pointer">
                  <Plus size={18} color="#bbb" />
                  <input type="file" multiple className="hidden" onChange={e => setFiles(p => [...p, ...Array.from(e.target.files)].slice(0, 10))} />
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="pp font-semibold px-6 py-3.5 rounded-xl border-2 border-[#E8E6E3]">Back</button>
                <button disabled={!files.length} onClick={() => setStep(4)} className="btnr flex-1 pp font-bold text-white py-3.5 rounded-xl bg-[#FF3300]" style={{ opacity: files.length ? 1 : 0.5 }}>Review</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-[#F8F7F5] rounded-2xl p-5 mb-6">
                <h3 className="pp font-bold text-base mb-2">{form.title}</h3>
                <p className="pp font-extrabold text-lg text-[#FF3300] mb-3">{fmtPrice(+form.price)}</p>
                <div className="pt-5 border-t border-gray-200 flex items-center gap-3">
                  <Avatar name={user.name} src={user.avatarUrl} size={40} fontSize={16} />
                  <div>
                    <p className="pp font-bold text-sm">{user.name}</p>
                    <p className="text-[11px] text-gray-400">{user.department} · Year {user.yearOfStudy}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="pp font-semibold px-6 py-3.5 rounded-xl border-2 border-[#E8E6E3]">Back</button>
                <button onClick={handleSubmit} disabled={submitting} className="btnr flex-1 pp font-bold text-white py-3.5 rounded-xl bg-[#FF3300]">{submitting ? "Publishing..." : "Publish"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
