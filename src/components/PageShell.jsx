export default function PageShell({ title, subtitle, action, children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
