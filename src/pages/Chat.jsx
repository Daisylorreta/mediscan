import { useEffect, useRef, useState } from "react";
import { Send, Bot, ShieldAlert } from "lucide-react";
import PageShell from "../components/PageShell";
import { useMeds } from "../context/MedsContext";
import { api } from "../lib/api";

export default function Chat() {
  const { refreshConsultations } = useMeds();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello, I'm your MediScan AI doctor. I can see the medications you've uploaded, so ask me anything about them.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [demo, setDemo] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    api.health().then((d) => setDemo(Boolean(d.demo))).catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setTyping(true);

    try {
      // Drop the greeting; the API conversation must start with a user message.
      const history = next
        .slice(1)
        .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
      const { reply, demo: isDemoReply } = await api.chat(history);
      setMessages((prev) => [...prev, { role: "ai", text: reply, demo: isDemoReply }]);
      refreshConsultations().catch(() => {});
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: err.message, error: true }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <PageShell title="AI Doctor" subtitle="Ask questions about your medications.">
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
        <ShieldAlert size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-900">
          This AI gives general information and is not a replacement for a doctor. For severe symptoms or an emergency,
          contact a healthcare professional or emergency services immediately.
        </p>
      </div>

      {demo && (
        <div className="flex items-start gap-2 bg-violet-50 border border-violet-200 rounded-xl p-3 mb-4">
          <Bot size={16} className="text-violet-600 mt-0.5 shrink-0" />
          <p className="text-xs text-violet-900">
            <strong>Demo mode.</strong> Replies are sample answers for testing, not from a real AI. Add an API key on the
            server to turn on the real AI doctor.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-violet-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] text-sm rounded-2xl px-4 py-2.5 ${
                  m.role === "user" ? "bg-[#0F766E] text-white" : m.error ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-800"
                }`}
              >
                {m.text}
                {m.demo && <div className="mt-1.5 text-xs font-medium text-violet-600">Demo reply</div>}
              </div>
            </div>
          ))}
          {typing && <div className="text-xs text-slate-400 pl-9">AI doctor is typing…</div>}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="border-t border-slate-100 p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a medication…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
          />
          <button
            className="bg-[#0F766E] text-white rounded-lg px-4 flex items-center justify-center hover:opacity-90"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
