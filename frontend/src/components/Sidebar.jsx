import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiSearch,
  FiGlobe,
  FiAward,
  FiBookOpen,
  FiSettings,
  FiBarChart2,
} from "react-icons/fi";

const items = [
  { icon: FiGrid, label: "Overview", to: "/dashboard" },
  { icon: FiSearch, label: "Keyword Analysis", to: "/dashboard" },
  { icon: FiBarChart2, label: "Compare", to: "/compare" },



  { icon: FiGlobe, label: "Regions", to: "/regions" },
  { icon: FiAward, label: "Gamification", to: "/gamification" },
  { icon: FiBookOpen, label: "Learning Hub", to: "/learning" },
  { icon: FiSettings, label: "Settings", to: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();   // <-- HERE

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col gap-1 border-r border-slate-200 dark:border-slate-800 px-4 py-6">
      {items.map(({ icon: Icon, label, to }) => {
        const active = location.pathname === to;

        return (
          <Link
            key={label}
            to={to}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-brand-blue/10 text-brand-blue"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}