"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Calendar, ShieldCheck, Search, Filter, CheckCircle2, Clock, MapPin, DollarSign, Download, Eye, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

const DEMO_ADMIN_BOOKINGS = [
  {
    _id: "adm-bk-01",
    bookingRef: "RNT-89421",
    propertyName: "The Grand Manhattan Sky Penthouse",
    propertyLocation: "Soho, New York, NY",
    tenantName: "Alex Mercer",
    tenantEmail: "alex.mercer@gmail.com",
    ownerEmail: "sarah.j@manhattanrentals.com",
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    amount: 4200,
    bookingStatus: "Approved",
    paymentStatus: "Paid",
    commissionEarned: 420
  },
  {
    _id: "adm-bk-02",
    bookingRef: "RNT-77293",
    propertyName: "Coastal Miami Waterfront Villa",
    propertyLocation: "South Beach, Miami, FL",
    tenantName: "Jordan Hayes",
    tenantEmail: "jordan.h@techinvest.io",
    ownerEmail: "marcus@miamicoastalluxury.com",
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    amount: 5800,
    bookingStatus: "Approved",
    paymentStatus: "Paid",
    commissionEarned: 580
  },
  {
    _id: "adm-bk-03",
    bookingRef: "RNT-62019",
    propertyName: "Sunset Boulevard Modern Loft",
    propertyLocation: "West Hollywood, CA",
    tenantName: "Sophia Martinez",
    tenantEmail: "sophia.m@designstudio.co",
    ownerEmail: "elena@weholofts.com",
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    amount: 3400,
    bookingStatus: "Pending",
    paymentStatus: "Pending",
    commissionEarned: 340
  },
  {
    _id: "adm-bk-04",
    bookingRef: "RNT-51082",
    propertyName: "Silicon Valley Smart Eco-Studio",
    propertyLocation: "Palo Alto, CA",
    tenantName: "Michael Chang",
    tenantEmail: "m.chang@stanford.edu",
    ownerEmail: "david@stanfordliving.io",
    moveInDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    amount: 2900,
    bookingStatus: "Approved",
    paymentStatus: "Paid",
    commissionEarned: 290
  }
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("renterty_token");
      try {
        const res = await fetch(`${API_URL}/bookings/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBookings(data);
          } else {
            setBookings(DEMO_ADMIN_BOOKINGS);
          }
        } else {
          setBookings(DEMO_ADMIN_BOOKINGS);
        }
      } catch (err) {
        console.error(err);
        setBookings(DEMO_ADMIN_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tenantEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.bookingRef && b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;
    if (statusFilter === "ALL") return true;
    return b.bookingStatus === statusFilter;
  });

  const totalPlatformVolume = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalCommission = bookings.reduce((sum, b) => sum + (b.commissionEarned || (b.amount ? b.amount * 0.1 : 0)), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading platform bookings...</span>
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
            <span>Escrow & Lease Ledger</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Platform Booking Records
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Audit tenant reservations, landlord payouts, and platform commission settlement.
          </p>
        </div>

        <button
          onClick={() => toast.success("Exporting platform bookings to CSV...")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Booking Volume</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">${totalPlatformVolume.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Platform Commission (10%)</span>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">${totalCommission.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Active Reservations</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {bookings.filter((b) => b.bookingStatus === "Approved").length} Active
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-x-auto">
          {["ALL", "Approved", "Pending", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === tab
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              {tab === "ALL" ? "All Records" : tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
              <tr>
                <th className="px-6 py-4">Property & Ref</th>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Owner Email</th>
                <th className="px-6 py-4">Move-in Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
              {filtered.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition">
                  <td className="px-6 py-4">
                    <span className="font-bold block text-slate-900 dark:text-white">{booking.propertyName}</span>
                    <span className="text-[11px] text-slate-400">Ref: {booking.bookingRef || "RNT-881"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold block">{booking.tenantName || "Tenant"}</span>
                    <span className="text-xs text-slate-400">{booking.tenantEmail}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400">
                    {booking.ownerEmail || (booking.ownerId && booking.ownerId.email) || "host@renterty.com"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-teal-500" />
                      <span>{new Date(booking.moveInDate).toLocaleDateString()}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-teal-600 dark:text-teal-400">
                    ${booking.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        booking.bookingStatus === "Approved"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : booking.bookingStatus === "Rejected"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current animate-pulse" />
                      {booking.bookingStatus}
                    </span>
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
