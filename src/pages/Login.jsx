import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ScanLine, MessageSquare, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AuthShell({ title, subtitle, children, footer }) {
  const perks = [
    [ScanLine, "Scan a prescription and keep every medication in one place"],
    [MessageSquare, "Ask an AI doctor about the medicines you take"],
    [MapPin, "Find the right hospital for your illness"],
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white"
        style={{ background: "linear-gradient(150deg, #0F766E 0%, #115E59 55%, #134E4A 100%)" }}
      >
        <div className="absolute -right-32 -bottom-32 w-[520px] h-[520px] rounded-full border border-white/10" />
        <div className="absolute -right-16 -bottom-16 w-[400px] h-[400px] rounded-full border border-white/15" />
        <div className="absolute right-0 bottom-0 w-[280px] h-[280px] rounded-full border border-white/20" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Activity size={20} />
          </div>
          <span className="font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            MediScan
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Your prescriptions, finally easy to understand.
          </h2>
          <ul className="mt-8 space-y-4">
            {perks.map(([Icon, text]) => (
              <li key={text} className="flex items-start gap-3 text-teal-50">
                <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </span>
                <span className="text-sm pt-1.5">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-teal-100/80">
          MediScan gives general health information and does not replace a doctor.
        </p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center">
              <Activity size={20} color="white" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              MediScan
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">{subtitle}</p>
          {children}
          <p className="text-sm text-slate-500 mt-6">{footer}</p>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
      />
    </label>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your prescriptions."
      footer={
        <>
          New to MediScan?{" "}
          <Link to="/signup" className="text-[#0F766E] font-semibold">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button className="w-full bg-[#0F766E] text-white text-sm font-semibold rounded-lg py-2.5 hover:opacity-90">
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}
