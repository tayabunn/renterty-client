"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Calendar, User, Check, X, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function OwnerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading booking requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    if (!window.confirm(`Are you sure you want to set status to ${status}?`)) return;

    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Booking request ${status}`);
        fetchRequests(); // Reload
      } else {
        toast.error("Failed to update booking status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading requests...</span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
        <ShieldAlert className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No requests yet</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Booking requests from tenants will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
            <tr>
              <th className="px-6 py-4">Tenant Information</th>
              <th className="px-6 py-4">Property Name</th>
              <th className="px-6 py-4">Booking Amount</th>
              <th className="px-6 py-4">Move-in Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-slate-50/55 dark:hover:bg-zinc-900/30 transition">
                <td className="px-6 py-4">
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">{req.tenantName}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-500">{req.tenantEmail}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Phone: {req.contactNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold">{req.propertyName}</td>
                <td className="px-6 py-4 text-teal-600 dark:text-teal-400 font-extrabold">
                  ${req.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{new Date(req.moveInDate).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      req.bookingStatus === "Approved"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : req.bookingStatus === "Rejected"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                    }`}
                  >
                    {req.bookingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {req.bookingStatus === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(req._id, "Approved")}
                        className="p-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg transition"
                        title="Approve Booking"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(req._id, "Rejected")}
                        className="p-1.5 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100 rounded-lg transition"
                        title="Reject Booking"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
