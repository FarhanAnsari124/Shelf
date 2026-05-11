import React, { useState, useEffect } from "react";
import { Search, Plus, X, SlidersHorizontal } from "lucide-react";
import ListingCard from "../components/ListingCard";
import { CATEGORIES, CONDITIONS } from "../data";

export default function Browse({ setView, setSelected, user, savedIds, setSavedIds, initialFilter = "all", initialSearch = "" }) {
  const [query, setQuery] = useState(initialSearch);
  const [cat, setCat] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("Newest");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(initialFilter === "saved");
  const [listings, setListings] = useState([]);

  useEffect(() => setShowSavedOnly(initialFilter === "saved"), [initialFilter]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const p = new URLSearchParams();
        if (query) p.append("search", query);
        if (cat) p.append("category", cat);
        if (condition) p.append("condition", condition);
        if (minP) p.append("minPrice", minP);
        if (maxP) p.append("maxPrice", maxP);
        
        let sortVal = sort === "Price: Low" ? "price_asc" : sort === "Price: High" ? "price_desc" : "newest";
        p.append("sort", sortVal);

        const res = await fetch(`http://localhost:5000/api/listings?${p.toString()}`);
        const data = await res.json();
        if (data.success) {
          setListings(data.data.map(item => ({
            id: item._id, ...item,
            seller: { ...item.sellerId, id: item.sellerId?._id }
          })));
        }
      } catch (e) { console.error(e); }
    };
    const timer = setTimeout(fetchListings, query ? 400 : 0);
    return () => clearTimeout(timer);
  }, [query, cat, condition, sort, minP, maxP, initialFilter]);

  const filtered = listings.filter(l => showSavedOnly ? savedIds.includes(l.id) : true);

  return (
    <div className="pt-20 bg-[#FAFAF8] min-h-screen">
      <div className="px-10 py-8">
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
            <Search size={16} color="#bbb" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="flex-1 text-sm bg-transparent outline-none" />
            {query && <button onClick={() => setQuery("")} className="border-none bg-none cursor-pointer"><X size={13} color="#ccc" /></button>}
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="pp flex items-center gap-2 text-sm font-semibold px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm" style={{ color: showFilter ? "#FF3300" : "#555" }}><SlidersHorizontal size={15} /> Filter</button>
          {user && <button onClick={() => setView("post")} className="btnr pp text-sm font-semibold text-white px-5 py-3 bg-[#FF3300] rounded-xl border-none"><Plus size={15} /> Post Ad</button>}
        </div>

        {showFilter && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 grid grid-cols-4 gap-4">
            <select value={cat} onChange={e => setCat(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl border border-gray-200 outline-none"><option value="">All Categories</option>{CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}</select>
            <select value={condition} onChange={e => setCondition(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl border border-gray-200 outline-none"><option value="">Any Condition</option>{CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <div className="flex gap-2"><input value={minP} onChange={e => setMinP(e.target.value)} placeholder="Min" className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl" /><input value={maxP} onChange={e => setMaxP(e.target.value)} placeholder="Max" className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl" /></div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm px-3 py-2.5 border border-gray-200 rounded-xl outline-none"><option>Newest</option><option>Price: Low</option><option>Price: High</option></select>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button onClick={() => setCat("")} className="pp text-xs font-semibold px-4 py-2 rounded-full flex-shrink-0" style={{ background: !cat ? "#111" : "#fff", color: !cat ? "#fff" : "#666", border: "1.5px solid #E0DDD9" }}>All</button>
          {CATEGORIES.map(c => <button key={c.label} onClick={() => setCat(cat === c.label ? "" : c.label)} className="pp text-xs font-semibold px-4 py-2 rounded-full flex-shrink-0" style={{ background: cat === c.label ? "#111" : "#fff", color: cat === c.label ? "#fff" : "#666", border: "1.5px solid #E0DDD9" }}><c.icon size={11} className="inline mr-1.5" /> {c.label}</button>)}
        </div>

        {filtered.length === 0 ? <p className="text-center py-24 text-gray-400">No results found</p> : (
          <div className="grid grid-cols-4 gap-5">
            {filtered.map(item => <ListingCard key={item.id} item={item} onClick={() => { setSelected(item); setView("listing"); }} savedIds={savedIds} onToggleSave={id => setSavedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} />)}
          </div>
        )}
      </div>
    </div>
  );
}
