import { useMemo, useState } from "react";
import { Search, CheckCircle2, AlertTriangle, Siren, MapPin, Phone, ExternalLink, Clock } from "lucide-react";
import PageShell, { Card } from "../components/PageShell";
import { CONDITIONS, HOSPITALS, SPECIALTIES } from "../data/care";

const mapsUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

function Section({ icon: Icon, title, items, tone }) {
  const tones = {
    teal: { box: "border-teal-200 bg-teal-50/60", icon: "text-[#0F766E]", dot: "bg-[#0F766E]" },
    blue: { box: "border-sky-200 bg-sky-50/70", icon: "text-sky-600", dot: "bg-sky-500" },
    red: { box: "border-red-300 bg-red-50", icon: "text-red-600", dot: "bg-red-500" },
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${tones.box}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
        <Icon size={16} className={tones.icon} />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((text) => (
          <li key={text} className="flex gap-2.5 text-sm text-slate-700">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${tones.dot}`} />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Care() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(CONDITIONS[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONDITIONS;
    return CONDITIONS.filter((c) => `${c.name} ${c.keywords}`.toLowerCase().includes(q));
  }, [query]);

  const condition = CONDITIONS.find((c) => c.id === selectedId) ?? CONDITIONS[0];

  const matches = HOSPITALS.map((h) => ({
    hospital: h,
    matched: condition.specialties.filter((s) => h.specialties.includes(s)),
  })).filter((m) => m.matched.length > 0);

  const mainSpecialty = SPECIALTIES[condition.specialties[0]];

  return (
    <PageShell
      title="Find care"
      subtitle="Pick an illness to see what you can do now, warning signs, and which hospital to visit."
    >
      <div className="flex items-start gap-2.5 bg-red-50 border border-red-300 rounded-xl p-3.5 mb-5">
        <Siren size={16} className="text-red-600 mt-0.5 shrink-0" />
        <p className="text-xs text-red-900">
          <strong>In an emergency</strong>, go to the nearest emergency department or call 112 (Nigeria's emergency
          number) right away. This guide is general information, not a diagnosis or a replacement for a doctor.
        </p>
      </div>

      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an illness or symptom, e.g. fever, sugar, rash"
          className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              c.id === condition.id
                ? "bg-[#0F766E] text-white border-[#0F766E]"
                : "bg-white text-slate-700 border-slate-300 hover:border-[#0F766E]"
            }`}
          >
            {c.name}
          </button>
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-500">No match. Try another word.</p>}
      </div>

      <Card className="mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {condition.name}
        </h2>
        <p className="text-sm text-slate-600 mt-1 mb-5">{condition.summary}</p>

        <div className="space-y-3">
          <Section icon={CheckCircle2} title="What you can do now" items={condition.doNow} tone="teal" />
          <Section icon={AlertTriangle} title="See a doctor soon if" items={condition.seeDoctor} tone="blue" />
          <Section icon={Siren} title="Go to emergency now if" items={condition.emergency} tone="red" />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Where to go</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Look for <strong>{mainSpecialty}</strong>
          {condition.specialties.length > 1 && " (or a related department)"}. Hospitals below offer a matching department.
        </p>

        <div className="space-y-3">
          {matches.map(({ hospital: h, matched }) => (
            <div key={h.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm">{h.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{h.type}</div>
                </div>
                {h.open24h && (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full">
                    <Clock size={12} /> Emergency 24 hours
                  </span>
                )}
              </div>

              <p className="flex items-center gap-1.5 text-sm text-slate-600 mt-3">
                <MapPin size={14} className="shrink-0" /> {h.area}, {h.city}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {matched.map((s) => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    {SPECIALTIES[s]}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href={mapsUrl(h.mapsQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-[#0F766E] text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:opacity-90"
                >
                  <MapPin size={14} /> Directions
                </a>
                <a
                  href={`tel:${h.emergencyPhone}`}
                  className="flex items-center gap-1.5 border border-red-300 text-red-700 text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-red-50"
                >
                  <Phone size={14} /> Emergency line
                </a>
                <a
                  href={h.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 border border-slate-300 text-xs font-semibold px-3.5 py-2 rounded-lg hover:border-[#0F766E]"
                >
                  <ExternalLink size={14} /> Website
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-600 mb-3">Not in Port Harcourt, or want more options near you?</p>
          <a
            href={mapsUrl(`${mainSpecialty} hospital near me`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-[#0F766E] text-[#0F766E] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-50"
          >
            <MapPin size={15} /> Search {mainSpecialty} hospitals near me
          </a>
          <p className="text-xs text-slate-400 mt-3">
            Department and contact details come from each hospital's own website. Call ahead to confirm clinic days
            before you travel.
          </p>
        </div>
      </Card>
    </PageShell>
  );
}
