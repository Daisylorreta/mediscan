import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  LayoutGrid,
  FileText,
  Upload,
  MessageSquare,
  Stethoscope,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true, color: "text-teal-300" },
  { to: "/reports", label: "Reports", icon: FileText, color: "text-sky-300" },
  { to: "/upload", label: "Upload", icon: Upload, color: "text-amber-300" },
  { to: "/chat", label: "AI Chat", icon: MessageSquare, color: "text-violet-300" },
  { to: "/care", label: "Find Care", icon: Stethoscope, color: "text-emerald-300" },
  { to: "/settings", label: "Settings", icon: Settings, color: "text-slate-300" },
];

const isDesktop = () => typeof window !== "undefined" && window.innerWidth >= 1024;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(isDesktop);

  // On small screens the menu closes after you pick a page.
  useEffect(() => {
    if (!isDesktop()) setOpen(false);
  }, [location.pathname]);

  const initial = (user?.name || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen">
      {/* Dim the page behind the menu on small screens */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Side menu */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 flex flex-col text-white transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0B1524" }}
        aria-label="Main menu"
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center">
              <Activity size={16} />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              MediScan
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {LINKS.map(({ to, label, icon: Icon, end, color }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} className={color} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 font-semibold flex items-center justify-center">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Page */}
      <div className={`transition-[margin] duration-200 ${open ? "lg:ml-64" : ""}`}>
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4">
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 -ml-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Menu size={20} />
          </button>
          {!open && (
            <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              MediScan
            </span>
          )}
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
