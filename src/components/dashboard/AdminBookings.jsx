"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Calendar, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("renterty_token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading platform bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading platform bookings...</span>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
        <ShieldCheck className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No bookings on platform</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Tenant reservation records will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm text-left">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
            <tr>
              <th className="px-6 py-4">Property Name</th>
              <th className="px-6 py-4">Tenant Email</th>
              <th className="px-6 py-4">Owner Email</th>
              <th className="px-6 py-4">Booking Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Booking Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-50/55 dark:hover:bg-zinc-900/30 transition">
                <td className="px-6 py-4 font-bold">{booking.propertyName}</td>
                <td className="px-6 py-4">{booking.tenantEmail}</td>
                <td className="px-6 py-4">{booking.ownerId?.email || "N/A"}</td>
                <td className="px-6 py-4 flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{new Date(booking.moveInDate).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 text-teal-600 dark:text-teal-400 font-extrabold">
                  ${booking.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      booking.bookingStatus === "Approved"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : booking.bookingStatus === "Rejected"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
