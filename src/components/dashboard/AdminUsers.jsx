"use client";

import React, { useState, useEffect } from "react";
import { Loader2, UserCheck, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/${userId}/role`, {
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
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm text-left">
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
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      usr.role === "Admin"
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-955/20 dark:text-purple-400"
                        : usr.role === "Owner"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-955/20 dark:text-blue-400"
                        : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {usr.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={usr.role}
                    onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                    className="bg-slate-100 dark:bg-zinc-950 border border-transparent px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Tenant">Tenant</option>
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
