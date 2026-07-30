import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiSave } from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put("/auth/update-profile", {
        name,
        email,
      });
      updateUser({
        ...user,
        name,
        email,
      });

      alert("Profile updated successfully!");

      navigate("/settings");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700"
        >
          <FiArrowLeft />
          Back to Settings
        </button>

        <div className="glass-panel rounded-2xl p-8">

          <h1 className="text-3xl font-bold mb-2">
            Edit Profile
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Update your personal information.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3 bg-white dark:bg-slate-900">

                <FiUser className="mr-3 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full bg-transparent outline-none"
                  required
                />

              </div>

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3 bg-white dark:bg-slate-900">

                <FiMail className="mr-3 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-transparent outline-none"
                  required
                />

              </div>

            </div>

            <div className="flex gap-4 pt-2">

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave />

                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}