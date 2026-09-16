"use client";

import React, { useState, useEffect } from "react";
import { Loader2, UserCheck, Shield, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/auth/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        toast.success(`User role changed to ${newRole}`);
        fetchUsers(); // Reload
      } else {
        toast.error("Failed to change user role");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating user role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading user registry...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
            <tr>
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
            {users.map((usr) => (
              <tr key={usr._id} className="hover:bg-slate-50/55 dark:hover:bg-zinc-900/30 transition">
                <td className="px-6 py-4 flex items-center space-x-3">
                  {usr.photo ? (
                    <img src={usr.photo} alt={usr.name} className="h-8 w-8 rounded-full object-cover border" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">
                      {usr.name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-bold">{usr.name}</span>
                </td>
                <td className="px-6 py-4">{usr.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      usr.role === "Admin"
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200/80 dark:border-teal-800/60"
                        : usr.role === "Owner"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                        : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200/60 dark:border-zinc-700/60"
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    <span>{usr.role}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <select
                      value={usr.role}
                      onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                      className="appearance-none bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="Tenant">Tenant</option>
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
