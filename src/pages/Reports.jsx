import PageShell, { Card } from "../components/PageShell";
import { useMeds } from "../context/MedsContext";

const TINTS = [
  "bg-teal-100 text-teal-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

export default function Reports() {
  const { medications, consultations } = useMeds();

  return (
    <PageShell title="Reports" subtitle="Your prescription and consultation history.">
      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Prescriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                <th className="py-2 pr-4 font-medium">Medication</th>
                <th className="py-2 pr-4 font-medium">Dosage</th>
                <th className="py-2 pr-4 font-medium">Frequency</th>
                <th className="py-2 pr-4 font-medium">Prescribed by</th>
                <th className="py-2 font-medium">Started</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m, i) => (
                <tr key={m.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 pr-4 font-semibold">
                    <span className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${TINTS[i % TINTS.length]}`}>
                        {m.name.charAt(0).toUpperCase()}
                      </span>
                      {m.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{m.dosage}</td>
                  <td className="py-3 pr-4">{m.frequency}</td>
                  <td className="py-3 pr-4 text-slate-600">{m.prescribedBy}</td>
                  <td className="py-3 text-slate-600">{m.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">AI consultations</h2>
        <ul className="divide-y divide-slate-100">
          {consultations.map((c) => (
            <li key={c.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{c.topic}</span>
                <span className="text-xs text-slate-500 shrink-0">{c.date}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{c.summary}</p>
            </li>
          ))}
        </ul>
      </Card>
    </PageShell>
  );
}
