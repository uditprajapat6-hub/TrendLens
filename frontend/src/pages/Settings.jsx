import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMoon, FiBell, FiTrash2, FiLock, FiLogOut, FiFlag, FiMessageSquare } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
export default function Settings() {
    const { user } = useAuth();
    const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [timeRange, setTimeRange] = useState(
    localStorage.getItem("timeRange") || "90"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const clearHistory = async () => {
    try {
        await api.delete("/dashboard/history");
        alert("Search history cleared.");
    } catch (error) {
        console.error(error);
    }
};
  const reportBug = () => {
    window.location.href =
    "mailto:support@trendlens.com?subject=Bug Report";
    }
    const sendFeedback = () => {
        window.location.href =
          "mailto:support@trendlens.com?subject=Feedback";
    };
    
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold mb-2">
          Settings
        </h1>

        <p className="text-slate-500 mb-8">
          Manage your account and application preferences.
        </p>

        <div className="space-y-6">

          {/* Account */}

          <div className="glass-panel p-6 rounded-xl">

            <div className="flex items-center gap-2 mb-4">
              <FiUser />
              <h2 className="text-xl font-semibold">
                Account
              </h2>
            </div>

            <p><strong>Name:</strong> {user?.name}</p>

            <p className="mt-2">
              <strong>Email:</strong> {user?.email}
            </p>

            <button
  onClick={() => navigate("/edit-profile")}
  className="btn-primary mt-5"
>
  Edit Profile
</button>

          </div>

          {/* Appearance */}

          <div className="glass-panel p-6 rounded-xl">

            <div className="flex items-center gap-2 mb-4">
              <FiMoon />
              <h2 className="text-xl font-semibold">
                Appearance
              </h2>
            </div>

            <label className="flex justify-between items-center">

              <span>Dark Mode</span>

              <input
  type="checkbox"
  checked={theme === "dark"}
  onChange={toggleTheme}
/>

            </label>

          </div>

          {/* Notifications */}

          <div className="glass-panel p-6 rounded-xl">

            <div className="flex items-center gap-2 mb-4">
              <FiBell />
              <h2 className="text-xl font-semibold">
                Notifications
              </h2>
            </div>

            <label className="flex justify-between">

              <span>Email Notifications</span>

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() =>
                  setEmailNotifications(!emailNotifications)
                }
              />

            </label>

          </div>

          {/* Preferences */}

          <div className="glass-panel p-6 rounded-xl">

            <h2 className="text-xl font-semibold mb-4">
              Dashboard Preferences
            </h2>

            <select
  value={timeRange}
  onChange={(e) => {
    setTimeRange(e.target.value);
    localStorage.setItem("timeRange", e.target.value);
  }}
  className="rounded-lg border border-slate-600 bg-slate-900 text-white px-4 py-2 appearance-none"
>
  <option value="30" className="text-white">
    30 Days
  </option>

  <option value="90" className="text-white">
    90 Days
  </option>

  <option value="365" className="text-white">
    365 Days
  </option>
</select>
          </div>

          {/* Data */}

          <div className="glass-panel p-6 rounded-xl">

            <div className="flex items-center gap-2 mb-4">
              <FiTrash2 />
              <h2 className="text-xl font-semibold">
                Data
              </h2>
            </div>

            <button
              onClick={clearHistory}
              className="btn-secondary"
            >
              Clear Search History
            </button>

          </div>

          {/* Support */}

          <div className="glass-panel p-6 rounded-xl">

            <h2 className="text-xl font-semibold mb-4">
              Help & Support
            </h2>

            <div className="space-y-3">

            <button
  onClick={() =>
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=uditprajapat6@gmail.com&su=TrendLens%20Bug%20Report",
      "_blank"
    )
  }
  className="flex items-center gap-3 w-full py-2 text-left text-slate-300 hover:text-white"
>
  <FiFlag />
  <span>Report Bug</span>
</button>
<button
onClick={() =>
  window.open(
    "https://mail.google.com/mail/?view=cm&fs=1&to=uditprajapat6@gmail.com&su=TrendLens%20Feedback",
    "_blank"
  )
}
className="flex items-center gap-3 w-full py-2 text-left text-slate-300 hover:text-white"
>
<FiMessageSquare />
<span>Send Feedback</span>
</button>

            </div>

            <hr className="my-5" />

            <p className="text-sm text-slate-500">
              TrendLens Version 1.0.0
            </p>

          </div>

          {/* Security */}

          <div className="glass-panel p-6 rounded-xl">

            <div className="flex items-center gap-2 mb-4">

              <FiLock />

              <h2 className="text-xl font-semibold">

                Security

              </h2>

            </div>

            

                      
                      <button
  onClick={() => navigate("/change-password")}
  className="btn-primary"
>
  Change Password
</button>

          </div>

          {/* Logout */}

          <div className="glass-panel p-6 rounded-xl">

            <div className="flex items-center gap-2 mb-4">

              <FiLogOut />

              <h2 className="text-xl font-semibold">

                Account

              </h2>

            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}