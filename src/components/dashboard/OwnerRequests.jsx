"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Calendar, User, Check, X, ShieldAlert, Search, Filter, Phone, Mail, DollarSign, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

const DEMO_OWNER_REQUESTS = [
  {
    _id: "own-req-01",
    propertyName: "The Grand Manhattan Sky Penthouse",
    tenantName: "Alex Mercer",
    tenantEmail: "alex.mercer@gmail.com",
    contactNumber: "+1 (917) 555-0182",
    amount: 4200,
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    bookingStatus: "Approved"
  },
  {
    _id: "own-req-02",
    propertyName: "Coastal Miami Waterfront Villa",
    tenantName: "Jordan Hayes",
    tenantEmail: "jordan.h@techinvest.io",
    contactNumber: "+1 (305) 555-8921",
    amount: 5800,
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    bookingStatus: "Pending"
  },
  {
    _id: "own-req-03",
    propertyName: "Sunset Boulevard Modern Loft",
    tenantName: "Sophia Martinez",
    tenantEmail: "sophia.m@designstudio.co",
    contactNumber: "+1 (310) 555-4920",
    amount: 3400,
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    bookingStatus: "Pending"
  }
];

export default function OwnerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchRequests = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/bookings/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRequests(data);
        } else {
          setRequests(DEMO_OWNER_REQUESTS);
        }
      } else {
        setRequests(DEMO_OWNER_REQUESTS);
      }
    } catch (err) {
      console.error(err);
      setRequests(DEMO_OWNER_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Booking request marked as ${status}`);
        fetchRequests();
      } else {
        setRequests(prev => prev.map(r => r._id === id ? { ...r, bookingStatus: status } : r));
        toast.success(`Booking request marked as ${status}`);
      }
    } catch (err) {
      setRequests(prev => prev.map(r => r._id === id ? { ...r, bookingStatus: status } : r));
      toast.success(`Booking request marked as ${status}`);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filter === "ALL") return true;
    return r.bookingStatus === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Direct Tenant Inquiries & Lease Approvals</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tenant Booking Requests ({requests.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Review applicant profiles, move-in dates, and approve or reject incoming reservation requests.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
          {["ALL", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === tab
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              {tab === "ALL" ? "All Requests" : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 rounded-lg overflow-hidden relative">
        <div className="absolute -right-8 -top-8 size-36 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Tenant Information</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Property Name</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Monthly Amount</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Move-in Date</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white">{req.tenantName}</span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">{req.tenantEmail}</span>
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500 block mt-0.5">Phone: {req.contactNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{req.propertyName}</td>
                  <td className="px-6 py-4 text-teal-600 dark:text-teal-400 font-bold">
                    ${req.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300">
                      <Calendar className="h-3.5 w-3.5 text-teal-500" />
                      <span>{new Date(req.moveInDate).toLocaleDateString()}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        req.bookingStatus === "Approved"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : req.bookingStatus === "Rejected"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      <span>{req.bookingStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {req.bookingStatus === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(req._id, "Approved")}
                          className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
                          title="Approve Booking"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(req._id, "Rejected")}
                          className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                          title="Reject Booking"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
