import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import PageShell, { Card } from "../components/PageShell";
import { useMeds } from "../context/MedsContext";

const empty = { name: "", dosage: "", frequency: "", prescribedBy: "" };

export default function Upload() {
  const { addMedication } = useMeds();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [demoScan, setDemoScan] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    setDemoScan(false);
    try {
      const { demo, ...fields } = await api.scanMedication(file);
      setForm(fields);
      setDemoScan(Boolean(demo));
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Medication name is required.");
      return;
    }
    setError("");
    try {
      await addMedication(form);
      setSaved(true);
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err.message);
    }
  };

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent";

  return (
    <PageShell title="Upload medication" subtitle="Add a prescription photo and confirm the details we find.">
      <Card>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-10 cursor-pointer hover:border-[#0F766E] transition-colors">
          {preview ? (
            <img src={preview} alt="Prescription preview" className="max-h-48 rounded-lg" />
          ) : (
            <>
              <span className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <UploadIcon className="text-amber-600" />
              </span>
              <span className="text-sm font-medium">Tap to upload a prescription photo</span>
              <span className="text-xs text-slate-500">JPG or PNG</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>

        {scanning && (
          <p className="flex items-center gap-2 text-sm text-slate-600 mt-4">
            <Loader2 size={16} className="animate-spin" /> Reading your prescription…
          </p>
        )}
        {demoScan && (
          <p className="text-sm text-violet-800 bg-violet-50 border border-violet-200 rounded-lg p-3 mt-4">
            <strong>Demo mode:</strong> these details are sample values, not read from your photo. Change them to match
            your prescription before saving.
          </p>
        )}
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <form onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-4">
          {[
            ["name", "Medication name"],
            ["dosage", "Dosage"],
            ["frequency", "Frequency"],
            ["prescribedBy", "Prescribed by"],
          ].map(([key, label]) => (
            <label key={key}>
              <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>
              <input
                className={input}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </label>
          ))}
          <div className="sm:col-span-2 flex items-center gap-3">
            <button className="bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90">
              Save medication
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[#0F766E]">
                <CheckCircle2 size={16} /> Saved
              </span>
            )}
          </div>
        </form>
      </Card>
    </PageShell>
  );
}
