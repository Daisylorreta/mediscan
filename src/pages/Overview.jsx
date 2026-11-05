import { Link } from "react-router-dom";
import { Pill, Clock, MessageSquare, Upload, AlertTriangle } from "lucide-react";
import PageShell, { Card } from "../components/PageShell";
import { useAuth } from "../context/AuthContext";
import { useMeds } from "../context/MedsContext";

export default function Overview() {
  const { user } = useAuth();
  const { medications, consultations } = useMeds();
  const lowSupply = medications.filter((m) => m.daysLeft <= 7);

  return (
    <PageShell
      title={`Hello, ${user.name}`}
      subtitle="Here's a summary of your medications and recent consultations."
      action={
        <Link
          to="/upload"
          className="hidden sm:flex items-center gap-1.5 bg-[#0F766E] text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          <Upload size={15} /> Upload prescription
        </Link>
      }
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Pill, value: medications.length, label: "Active medications", bg: "bg-teal-50", fg: "text-[#0F766E]", bar: "bg-[#0F766E]" },
          { icon: Clock, value: lowSupply.length, label: "Running low (7 days or less)", bg: "bg-amber-50", fg: "text-amber-600", bar: "bg-amber-500" },
          { icon: MessageSquare, value: consultations.length, label: "AI consultations", bg: "bg-violet-50", fg: "text-violet-600", bar: "bg-violet-500" },
        ].map(({ icon: Icon, value, label, bg, fg, bar }) => (
          <div key={label} className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`absolute top-0 left-0 right-0 h-1 ${bar}`} />
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon size={18} className={fg} />
            </div>
            <div className="text-2xl font-bold mt-3">{value}</div>
            <div className="text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {lowSupply.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900">
            {lowSupply.map((m) => m.name).join(", ")} {lowSupply.length === 1 ? "is" : "are"} running low. Consider
            arranging a refill.
          </p>
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Your medications</h2>
          <Link to="/reports" className="text-sm text-[#0F766E] font-medium">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {medications.slice(0, 4).map((m) => (
            <li key={m.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">
                  {m.name} <span className="font-normal text-slate-500">{m.dosage}</span>
                </div>
                <div className="text-xs text-slate-500">{m.frequency}</div>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  m.daysLeft <= 7 ? "bg-amber-100 text-amber-800" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {m.daysLeft} days left
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </PageShell>
  );
}
