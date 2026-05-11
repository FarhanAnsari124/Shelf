import React, { useState, useEffect, useRef } from "react";
import { Send, Eye, CheckCircle, ArrowLeft, Shield, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { validateRoll, decodeRoll, API_URL } from "../data";

export default function AuthPage({ mode, setView, setUser, onModeChange }) {
  const [step, setStep] = useState(mode === "register" ? "register" : "login");
  const [roll, setRoll] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const refs = useRef([]);

  useEffect(() => { setStep(mode === "register" ? "register" : "login"); }, [mode]);

  const decoded = decodeRoll(roll);
  const pwStrength = !pw ? 0 : pw.length < 6 ? 1 : pw.length < 8 ? 2 : (/[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw) ? 4 : 3);

  const handleRegister = async () => {
    if (!validateRoll(roll)) return setError("Roll number must be 13 digits.");
    if (!name.trim() || !email.includes('@')) return setError("Invalid details.");
    if (pw.length < 8 || pw !== pw2) return setError("Check password.");
    
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rollNumber: roll, email, password: pw })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) setStep("otp");
      else setError(data.message || "Failed");
    } catch (err) { setLoading(false); setError("Error"); }
  };

  const handleOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Enter OTP.");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        localStorage.setItem('shelf_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView(data.user.role === 'college_admin' ? "admin" : "browse");
      } else setError(data.message);
    } catch (err) { setLoading(false); setError("Error"); }
  };

  const handleLogin = async () => {
    if (!email || !pw) return setError("Required.");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        localStorage.setItem('shelf_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView(data.user.role === 'college_admin' ? "admin" : "browse");
      } else setError(data.message);
    } catch (err) { setLoading(false); setError("Error"); }
  };

  const handleOtpKey = (i, val, e) => {
    if (val.length > 1) return;
    const n = [...otp];
    n[i] = val;
    setOtp(n);
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (e.key === "Backspace" && !val && i > 0) refs.current[i - 1]?.focus();
  };

  const inputStyle = { border: "2px solid #E8E6E3", color: "#111", background: "transparent" };
  const btnStyle = { background: "#FF3300", color: "#fff", border: "none" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        {step === "register" ? (
          <>
            <div className="mb-8">
              <h1 className="pp font-extrabold text-3xl mb-1.5">Create account</h1>
              <p className="text-sm text-gray-400">Verified students only</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="pp text-xs font-semibold text-gray-600 mb-1.5 block">Roll Number</label>
                <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: roll.length === 13 ? "#16a34a" : "#E8E6E3" }}>
                  <input value={roll} onChange={(e) => setRoll(e.target.value.replace(/\D/g, "").slice(0, 13))} placeholder="2300000000000" className="flex-1 px-4 py-3 text-sm" style={{ border: "none" }} />
                  {roll.length === 13 && <span className="pr-3 text-green-600 self-center"><CheckCircle size={16} /></span>}
                </div>
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display Name" className="w-full px-4 py-3 text-sm rounded-xl" style={inputStyle} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="College Email" className="w-full px-4 py-3 text-sm rounded-xl" style={inputStyle} />
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "#E8E6E3" }}>
                <input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password (min. 8)" className="flex-1 px-4 py-3 text-sm" style={{ border: "none" }} />
                <button onClick={() => setShowPw(!showPw)} className="px-3" style={{ border: "none", background: "none" }}><Eye size={15} color="#bbb" /></button>
              </div>
              <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Confirm Password" className="w-full px-4 py-3 text-sm rounded-xl" style={{ ...inputStyle, borderColor: pw2 && pw !== pw2 ? "#dc2626" : "#E8E6E3" }} />
            </div>
            {error && <p className="mt-3 text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={11} />{error}</p>}
            <button onClick={handleRegister} disabled={loading} className="w-full pp font-bold rounded-xl py-4 mt-6" style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>{loading ? "Sending..." : "Send OTP"}</button>
            <p className="text-center text-sm mt-5 text-gray-400">Already have an account? <button onClick={() => onModeChange("login")} className="pp font-semibold" style={{ color: "#FF3300", border: "none", background: "none" }}>Sign in</button></p>
          </>
        ) : step === "otp" ? (
          <>
            <div className="mb-8">
              <button onClick={() => setStep("register")} className="flex items-center gap-1 text-sm mb-5 text-gray-400" style={{ border: "none", background: "none" }}><ArrowLeft size={14} /> Back</button>
              <h1 className="pp font-extrabold text-3xl mb-1.5">Verify OTP</h1>
              <p className="text-sm text-gray-400">Sent to <strong className="text-gray-700">{roll}</strong></p>
            </div>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((d, i) => (
                <input key={i} ref={(el) => (refs.current[i] = el)} maxLength={1} value={d} onChange={(e) => handleOtpKey(i, e.target.value, e)} onKeyDown={(e) => e.key === "Backspace" && handleOtpKey(i, "", e)} className="pp text-xl font-bold text-center rounded-xl" style={{ width: 52, height: 60, border: d ? "2.5px solid #111" : "2px solid #E8E6E3", outline: "none" }} />
              ))}
            </div>
            <button onClick={handleOtp} disabled={loading} className="w-full pp font-bold rounded-xl py-4" style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>{loading ? "Verifying..." : "Verify"}</button>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="pp font-extrabold text-3xl mb-1.5">Welcome back</h1>
              <p className="text-sm text-gray-400">Sign in to your account</p>
            </div>
            <div className="flex flex-col gap-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 text-sm rounded-xl" style={inputStyle} />
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "#E8E6E3" }}>
                <input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="flex-1 px-4 py-3 text-sm" style={{ border: "none" }} />
                <button onClick={() => setShowPw(!showPw)} className="px-3" style={{ border: "none", background: "none" }}><Eye size={15} color="#bbb" /></button>
              </div>
            </div>
            {error && <p className="mt-3 text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={11} />{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full pp font-bold rounded-xl py-4 mt-6" style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>{loading ? "Signing in..." : "Sign In"}</button>
            <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-100" /></div>
            <button onClick={() => { onModeChange("register"); setStep("register"); }} className="w-full pp font-semibold text-sm rounded-xl py-3.5" style={{ border: "2px solid #E8E6E3", background: "transparent" }}>Create account</button>
          </>
        )}
      </div>
    </div>
  );
}
