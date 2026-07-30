import { useState } from "react";
import api from "../services/api";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      alert("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
  <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8">

    <h2 className="text-3xl font-bold text-white text-center mb-2">
      Change Password
    </h2>

    <p className="text-slate-400 text-center mb-8">
      Update your account password securely.
    </p>

    <form onSubmit={handleChangePassword} className="space-y-5">

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Current Password
        </label>

        <input
          type="password"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          New Password
        </label>

        <input
          type="password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Confirm Password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:opacity-90 transition"
      >
        Change Password
      </button>

    </form>

  </div>
</div>
  );
}