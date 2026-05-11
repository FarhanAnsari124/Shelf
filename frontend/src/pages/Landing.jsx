import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Laptop,
} from "lucide-react";
import ListingCard from "../components/ListingCard";
import Avatar from "../components/Avatar";
import { CATEGORIES, fmtPrice, timeAgo, API_URL } from "../data";

export default function Landing({
  setView,
  setAuthMode,
  savedIds,
  setSavedIds,
  setSelected,
  user,
}) {
  const [activeCat, setActiveCat] = useState("");
  const [activeFilter, setActiveFilter] = useState("Newest");
  const [query, setQuery] = useState("");
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/listings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const fetched = data.data.map((item) => ({
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
              id: item.sellerId?._id,
              name: item.sellerId?.name || "Unknown User",
              avatarUrl: item.sellerId?.avatarUrl,
              trustScore: item.sellerId?.trustScore || 0,
              role: item.sellerId?.role || "student",
              avgRating: item.sellerId?.avgRating || 0,
            },
          }));
          setRecentListings(fetched);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = recentListings.slice(0, 6).filter(
    (l) => !activeCat || l.category === activeCat
  );

  const handleSearch = () => {
    setView(query ? `browse:all:${query}` : "browse");
  };

  return (
    <div>
      {}
      <section
        className="relative flex items-center overflow-hidden main-hero"
        style={{
          minHeight: "100vh",
          background: "#FAFAF8",
        }}
      >
        <style>{`
          .main-hero { padding: 100px 80px 80px; }
          @media (max-width: 768px) {
            .main-hero { padding: 100px 20px 40px; text-align: center; }
            .hero-title { font-size: 44px !important; letter-spacing: -2px !important; }
            .hero-p { margin: 0 auto 32px !important; }
            .search-bar { flex-direction: column; gap: 10px; padding: 10px !important; height: auto !important; }
            .search-bar button { width: 100%; padding: 14px !important; border-radius: 12px !important; }
          }
        `}</style>
        <div
          className="absolute pointer-events-none"
          style={{
            top: "12%",
            right: "-5%",
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,51,0,.06) 0%, transparent 68%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "5%",
            left: "-5%",
            width: 460,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,.04) 0%, transparent 68%)",
          }}
        />

        <div className="relative z-10" style={{ maxWidth: 860 }}>
          <div
            className="a1 inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-9"
            style={{ background: "#111" }}
          >
            <span
              className="blink rounded-full"
              style={{
                width: 6,
                height: 6,
                background: "#FF3300",
                display: "block",
              }}
            />
            <span className="pp text-xs font-semibold tracking-widest text-white">
              VERIFIED STUDENTS ONLY
            </span>
          </div>

          <h1
            className="a2 pp font-black leading-none mb-9 hero-title"
            style={{
              fontSize: "clamp(54px, 8vw, 100px)",
              letterSpacing: "-3.5px",
              color: "#111",
            }}
          >
            List It.
            <br />
            Find It.
            <br />
            <span style={{ color: "#FF3300" }}>SHELF It.</span>
          </h1>

          <p
            className="a3 text-lg leading-relaxed mb-12 hero-p"
            style={{ color: "#666", maxWidth: 480 }}
          >
            Your campus-only marketplace. Buy, sell, and exchange textbooks,
            electronics, services — exclusively with verified students from your
            college.
          </p>

          <div
            className="a4 flex rounded-2xl overflow-hidden mb-11 search-bar"
            style={{
              maxWidth: 580,
              border: "2.5px solid #111",
              boxShadow: "5px 5px 0 #111",
              transition: "box-shadow .2s ease",
            }}
          >
            <div className="flex items-center px-4" style={{ color: "#bbb" }}>
              <Search size={17} />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search textbooks, laptops, cycles..."
              className="flex-1 py-4 text-sm bg-transparent"
              style={{
                color: "#111",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                border: "none",
              }}
            />
            <button
              onClick={handleSearch}
              className="btnr pp text-sm font-bold text-white px-7"
              style={{
                background: "#FF3300",
                border: "none",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>

          <div className="a5 flex gap-12">
            {[
              ["2,400+", "Active Listings"],
              ["8,000+", "Verified Students"],
              ["12", "Colleges"],
            ].map(([n, l]) => (
              <div key={l}>
                <div
                  className="pp font-extrabold text-2xl"
                  style={{ color: "#111" }}
                >
                  {n}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#999" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div
          className="absolute hidden lg:flex flex-col gap-4"
          style={{ right: 72, top: "50%", transform: "translateY(-50%)" }}
        >
          <div
            className="a2 rounded-2xl p-5 border"
            style={{
              width: 268,
              background: "#fff",
              border: "1px solid #F0EDE9",
              boxShadow: "0 8px 32px rgba(0,0,0,.09)",
            }}
          >
            <div className="flex items-center gap-3 mb-3.5">
              <div
                className="rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200"
                style={{ width: 50, height: 50 }}
              >
                <img
                  src="/images/irodov.jpg"
                  alt="Irodov Physics Book"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="pp font-semibold text-sm" style={{ color: "#111" }}>
                  Irodov Physics
                </p>
                <p className="text-xs" style={{ color: "#999" }}>
                  Like New · 2h ago
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="pp font-extrabold text-lg" style={{ color: "#FF3300" }}>
                ₹280
              </span>
              <span className="text-xs text-gray-400 line-through">₹450</span>
            </div>
          </div>

          <div
            className="a3 rounded-2xl p-5 ml-7"
            style={{
              width: 268,
              background: "#111",
              boxShadow: "0 8px 32px rgba(0,0,0,.18)",
            }}
          >
            <div className="flex items-center gap-3 mb-3.5">
              <div
                className="rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700"
                style={{ width: 50, height: 50 }}
              >
                <img
                  src="/images/hp-laptop.jpg"
                  alt="HP EliteBook Laptop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="pp font-semibold text-sm text-white">HP Laptop i5</p>
                <p className="text-xs" style={{ color: "#777" }}>
                  Like New · 5h ago
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="pp font-extrabold text-lg" style={{ color: "#FF3300" }}>
                ₹18,000
              </span>
              <span className="text-xs line-through" style={{ color: "#555" }}>
                ₹35,000
              </span>
            </div>
          </div>

          <div
            className="a4 rounded-2xl p-5 border"
            style={{
              width: 268,
              background: "#fff",
              border: "1px solid #F0EDE9",
              boxShadow: "0 8px 32px rgba(0,0,0,.09)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <span
                className="rounded-full"
                style={{
                  width: 7,
                  height: 7,
                  background: "#22c55e",
                  display: "block",
                }}
              />
              <span className="pp text-xs font-semibold" style={{ color: "#555" }}>
                Just verified
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar name="Mansi Singh" size={42} fontSize={16} />
              <div>
                <p className="pp font-semibold text-sm" style={{ color: "#111" }}>
                  Mansi Singh
                </p>
                <p className="text-xs" style={{ color: "#aaa" }}>
                  2301641540109 · CS-DS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <div className="overflow-hidden py-3" style={{ background: "#FF3300" }}>
        <div
          className="tk flex gap-12"
          style={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-12">
              {[
                "Books & Notes",
                "Electronics",
                "Cycles",
                "Furniture",
                "Services",
                "Room & PG",
                "Event Tickets",
                "Ride Sharing",
                "Lost & Found",
              ].map((item) => (
                <span
                  key={item}
                  className="pp text-sm font-medium text-white"
                  style={{ letterSpacing: ".3px" }}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {}
      <section className="px-20 pt-20 pb-6">
        <div className="flex items-end justify-between mb-9">
          <div>
            <p
              className="pp text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "#FF3300" }}
            >
              Browse
            </p>
            <h2
              className="pp font-extrabold text-4xl tracking-tight"
              style={{ color: "#111" }}
            >
              What are you looking for?
            </h2>
          </div>
          <button
            onClick={() => setView("browse")}
            className="nl pp flex items-center gap-1 text-sm font-medium"
            style={{
              color: "#777",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            All categories <ArrowRight size={13} />
          </button>
        </div>
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCat === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCat(active ? "" : cat.label)}
                className="pp flex flex-col items-center gap-2.5 py-5 px-2 rounded-2xl"
                style={{
                  border: active ? "2.5px solid #111" : "2px solid #E8E6E3",
                  background: active ? "#111" : "#fff",
                  color: active ? "#fff" : "#555",
                  cursor: "pointer",
                  transition: "all .2s ease",
                }}
              >
                <Icon size={22} color={active ? "#FF3300" : "#888"} />
                <span className="text-xs font-semibold text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {}
      <section className="px-20 py-16">
        <div className="flex items-end justify-between mb-9">
          <div>
            <p
              className="pp text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "#FF3300" }}
            >
              Recent
            </p>
            <h2
              className="pp font-extrabold text-4xl tracking-tight"
              style={{ color: "#111" }}
            >
              Fresh on SHELF
            </h2>
          </div>
          <div className="flex gap-2">
            {["Newest", "Price: Low", "Price: High", "Top Rated"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="pp text-xs font-semibold px-4 py-2 rounded-full"
                style={{
                  border:
                    activeFilter === f ? "2px solid #111" : "1.5px solid #E0DDD9",
                  background: activeFilter === f ? "#111" : "#fff",
                  color: activeFilter === f ? "#fff" : "#666",
                  cursor: "pointer",
                  transition: "all .15s ease",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {(filtered.length ? filtered : recentListings.slice(0, 6)).map(
            (item) => (
              <ListingCard
                key={item.id}
                item={item}
                onClick={() => {
                  setSelected(item);
                  setView("listing");
                }}
                savedIds={savedIds}
                onToggleSave={(id) =>
                  setSavedIds((p) =>
                    p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
                  )
                }
              />
            )
          )}
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setView("browse")}
            className="btnr pp font-semibold text-sm px-8 py-3.5 rounded-xl"
            style={{
              background: "#111",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All Listings <ArrowRight size={14} className="inline ml-1" />
          </button>
        </div>
      </section>

      {}
      <section className="px-20 py-20" style={{ background: "#111" }}>
        <div className="text-center mb-16">
          <p
            className="pp text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#FF3300" }}
          >
            Simple & Safe
          </p>
          <h2 className="pp font-extrabold text-5xl tracking-tight text-white">
            How SHELF works
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-16 max-w-4xl mx-auto">
          {[
            [
              "01",
              "Verify with Roll No.",
              "Enter your college roll number. OTP confirms you're a real student — no email needed.",
            ],
            [
              "02",
              "Browse or Post",
              "Search thousands of student listings or create your own in under 2 minutes. Add photos, set a price, go live instantly.",
            ],
            [
              "03",
              "Connect and Deal",
              "Chat with buyers or sellers directly. Negotiate using built-in offer cards. Meet on campus. No middlemen, zero commission.",
            ],
          ].map(([step, title, desc]) => (
            <div key={step}>
              <div
                className="pp font-black mb-4"
                style={{ fontSize: 52, color: "#FF3300", lineHeight: 1 }}
              >
                {step}
              </div>
              <h3 className="pp font-bold text-xl text-white mb-3">{title}</h3>
              <p className="text-sm leading-loose" style={{ color: "#666" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section
        className="px-20 py-28 text-center"
        style={{ background: "#FAFAF8" }}
      >
        <h2
          className="pp font-black tracking-tight mb-5"
          style={{
            fontSize: "clamp(44px, 6vw, 76px)",
            color: "#111",
            letterSpacing: "-2.5px",
          }}
        >
          Your campus marketplace
          <br />
          <span style={{ color: "#FF3300" }}>starts here.</span>
        </h2>
        <p
          className="text-lg mb-12 mx-auto"
          style={{ color: "#888", maxWidth: 360 }}
        >
          Join 8,000+ students already buying and selling smarter on campus.
        </p>
        <div className="flex gap-4 justify-center">
          {!user ? (
            <button
              onClick={() => setView("auth")}
              className="btnr pp font-bold text-base text-white px-10 py-4 rounded-xl"
              style={{ background: "#FF3300", border: "none", cursor: "pointer" }}
            >
              Create Free Account
            </button>
          ) : (
            <button
              onClick={() => setView("post")}
              className="btnr pp font-bold text-base text-white px-10 py-4 rounded-xl"
              style={{ background: "#FF3300", border: "none", cursor: "pointer" }}
            >
              Post a Listing
            </button>
          )}
          <button
            onClick={() => setView("browse")}
            className="pp font-semibold text-base px-10 py-4 rounded-xl"
            style={{
              color: "#333",
              background: "#fff",
              border: "2px solid #E0DDD9",
              cursor: "pointer",
            }}
          >
            Explore Listings
          </button>
        </div>
      </section>

      {}
      <footer
        className="px-20 py-7 flex items-center justify-between"
        style={{ borderTop: "1px solid #E8E6E3" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 30, height: 30, background: "#111" }}
          >
            <span className="pp font-black text-sm" style={{ color: "#FF3300" }}>
              S
            </span>
          </div>
          <span className="pp font-bold" style={{ color: "#111" }}>
            SHELF
          </span>
          <span className="text-xs" style={{ color: "#bbb" }}>
            Student Hub for Easy Listing & Finding
          </span>
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact", "For Colleges"].map((l) => (
            <button
              key={l}
              className="pp text-xs"
              style={{
                color: "#aaa",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="pp text-xs" style={{ color: "#bbb" }}>
          2025 SHELF. Built for students.
        </span>
      </footer>
    </div>
  );
}
