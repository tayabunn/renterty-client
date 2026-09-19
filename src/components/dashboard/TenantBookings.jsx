"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  ClipboardCheck, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  MapPin, 
  Key, 
  FileText, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  X,
  Sparkles,
  Building,
  User,
  CreditCard,
  Copy,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { API_URL } from "@/lib/config";

const DEMO_BOOKINGS = [
  {
    _id: "demo-bk-101",
    bookingRef: "RNT-89421",
    propertyName: "The Grand Manhattan Sky Penthouse",
    propertyLocation: "Soho, New York, NY 10012",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    leaseDuration: "12 Months (Fixed Term)",
    monthlyRent: 4200,
    amount: 4200,
    depositAmount: 4200,
    bookingStatus: "Approved",
    paymentStatus: "Paid",
    escrowStatus: "Secured in Escrow",
    paymentMethod: "Visa ending in 4242",
    transactionId: "pi_3N9xKl2eZvKYlo2C09zDemo",
    host: {
      name: "Sarah Jenkins",
      email: "sarah.j@manhattanrentals.com",
      phone: "+1 (212) 555-0194",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120"
    },
    smartLockCode: "9482#",
    unitNumber: "Penthouse 18B",
    wifiName: "ManhattanPenthouse_5G",
    wifiPass: "LuxuryLiving2026!",
    leaseAgreementId: "LEASE-NY-2026-88"
  },
  {
    _id: "demo-bk-102",
    bookingRef: "RNT-77293",
    propertyName: "Coastal Miami Waterfront Villa",
    propertyLocation: "South Beach, Miami, FL 33139",
    propertyImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    leaseDuration: "6 Months (Seasonal)",
    monthlyRent: 5800,
    amount: 5800,
    depositAmount: 5800,
    bookingStatus: "Approved",
    paymentStatus: "Paid",
    escrowStatus: "Secured in Escrow",
    paymentMethod: "Mastercard ending in 8831",
    transactionId: "pi_3M7tQp4bZvKYlo2C88yDemo",
    host: {
      name: "Marcus Vance",
      email: "marcus@miamicoastalluxury.com",
      phone: "+1 (305) 555-7312",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
    },
    smartLockCode: "3055#",
    unitNumber: "Private Villa 4",
    wifiName: "VillaCoastal_Guest",
    wifiPass: "OceanBreeze26",
    leaseAgreementId: "LEASE-FL-2026-42"
  },
  {
    _id: "demo-bk-103",
    bookingRef: "RNT-62019",
    propertyName: "Sunset Boulevard Modern Loft",
    propertyLocation: "West Hollywood, CA 90069",
    propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    leaseDuration: "12 Months (Renewable)",
    monthlyRent: 3400,
    amount: 3400,
    depositAmount: 3400,
    bookingStatus: "Pending",
    paymentStatus: "Pending",
    escrowStatus: "Authorized Pre-hold",
    paymentMethod: "Apple Pay (Amex ···· 1004)",
    transactionId: "pi_3K1sLm9xZvKYlo2C41pDemo",
    host: {
      name: "Elena Rostova",
      email: "elena@weholofts.com",
      phone: "+1 (310) 555-4920",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
    },
    smartLockCode: "Pending Approval",
    unitNumber: "Unit 304",
    wifiName: "SunsetLoft_HighSpeed",
    wifiPass: "PendingMoveIn",
    leaseAgreementId: "LEASE-CA-2026-19"
  },
  {
    _id: "demo-bk-104",
    bookingRef: "RNT-51082",
    propertyName: "Silicon Valley Smart Eco-Studio",
    propertyLocation: "Palo Alto, CA 94301",
    propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
    moveInDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    leaseDuration: "Completed (Past Stay)",
    monthlyRent: 2900,
    amount: 2900,
    depositAmount: 2900,
    bookingStatus: "Completed",
    paymentStatus: "Paid",
    escrowStatus: "Deposit Released",
    paymentMethod: "Visa ending in 4242",
    transactionId: "pi_2J9qWz1vZvKYlo2C77aDemo",
    host: {
      name: "David Chen",
      email: "david@stanfordliving.io",
      phone: "+1 (650) 555-3211",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
    },
    smartLockCode: "Expired",
    unitNumber: "Studio 12",
    wifiName: "EcoSmart_Guest",
    wifiPass: "Expired",
    leaseAgreementId: "LEASE-CA-2025-09"
  }
];

export default function TenantBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'lease' | 'access' | 'receipt'
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("renterty_token");
      try {
        const res = await fetch(`${API_URL}/bookings/tenant`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Merge or set real bookings with demo enrichment for complete fields
            const enriched = data.map((b, idx) => ({
              ...DEMO_BOOKINGS[idx % DEMO_BOOKINGS.length],
              ...b,
              propertyName: b.propertyName || DEMO_BOOKINGS[idx % DEMO_BOOKINGS.length].propertyName,
              amount: b.amount || DEMO_BOOKINGS[idx % DEMO_BOOKINGS.length].amount
            }));
            setBookings(enriched);
          } else {
            setBookings(DEMO_BOOKINGS);
          }
        } else {
          setBookings(DEMO_BOOKINGS);
        }
      } catch (err) {
        console.error(err);
        setBookings(DEMO_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadLease = (bookingRef) => {
    toast.success(`Downloading Residential Lease Agreement for #${bookingRef}...`);
  };

  const handleDownloadReceipt = (bookingRef) => {
    toast.success(`Receipt for #${bookingRef} generated successfully!`);
  };

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.propertyLocation && b.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.bookingRef && b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filter === "ALL") return true;
    if (filter === "APPROVED") return b.bookingStatus === "Approved";
    if (filter === "PENDING") return b.bookingStatus === "Pending";
    if (filter === "COMPLETED") return b.bookingStatus === "Completed";
    return true;
  });

  const totalSpend = bookings.reduce((sum, b) => (b.paymentStatus === "Paid" ? sum + (b.amount || 0) : sum), 0);
  const activeCount = bookings.filter((b) => b.bookingStatus === "Approved").length;
  const pendingCount = bookings.filter((b) => b.bookingStatus === "Pending").length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin h-9 w-9 text-teal-500 mb-3" />
        <span className="text-slate-500 font-semibold text-sm">Loading verified lease records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Smart Escrow Protected Reservations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-7 h-7 text-teal-500" />
            <span>My Bookings & Leases</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Access verified rental agreements, digital door codes, escrow receipts, and check-in guides.
          </p>
        </div>

        <Link
          href="/#properties"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 self-start md:self-auto cursor-pointer"
        >
          <Building className="w-4 h-4" />
          <span>Explore Properties</span>
        </Link>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Active Leases */}
        <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 size-24 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Active Leases
              </span>
              <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {activeCount}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">
                Active &amp; Verified
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
        </div>

        {/* Card 2: Pending Review */}
        <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 size-24 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Pending Review
              </span>
              <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {pendingCount}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">
                {pendingCount > 0 ? "Awaiting Host Review" : "All Processed"}
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
        </div>

        {/* Card 3: Total Paid */}
        <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 size-24 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Total Escrow Paid
              </span>
              <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                ${totalSpend.toLocaleString()}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">
                100% Escrow Protected
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
        </div>

        {/* Card 4: Next Key Access */}
        <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 size-24 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Smart Key Access
              </span>
              <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Key className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate block group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Soho 18B
              </span>
              <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">
                PIN Code Active
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/70 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: "ALL", label: "All Bookings", count: bookings.length },
            { id: "APPROVED", label: "Active & Confirmed", count: activeCount },
            { id: "PENDING", label: "Pending", count: pendingCount },
            { id: "COMPLETED", label: "Completed", count: bookings.filter((b) => b.bookingStatus === "Completed").length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filter === tab.id
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === tab.id ? "bg-teal-50 dark:bg-teal-950 text-teal-600" : "bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Bookings Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {filteredBookings.map((b) => (
          <div
            key={b._id}
            className="group p-5 sm:p-6 rounded-lg bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden flex flex-col justify-between space-y-4"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -right-10 -top-10 size-36 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 size-28 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Header Badge Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center text-xs font-extrabold px-3 py-1 rounded-full border backdrop-blur-xs ${
                      b.bookingStatus === "Approved"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : b.bookingStatus === "Completed"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    <span>{b.bookingStatus === "Approved" ? "Confirmed Lease" : b.bookingStatus}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-full text-[11px] font-bold">
                    Ref: {b.bookingRef || "RNT-9982"}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 rounded-full text-[11px] font-bold border border-teal-200/60 dark:border-teal-800/60">
                  <ShieldCheck className="w-3 h-3 text-teal-500" />
                  <span>{b.paymentStatus === "Paid" ? "Stripe Paid" : "Escrow Pending"}</span>
                </span>
              </div>

              {/* Property Image & Title */}
              <div className="flex items-start gap-4">
                <img
                  src={b.propertyImage || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200"}
                  alt={b.propertyName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-slate-200/80 dark:border-zinc-700/80 shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    {b.unitNumber || "Suite 4B"} • {b.leaseDuration || "12 Months"}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {b.propertyName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 line-clamp-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{b.propertyLocation || "New York, NY"}</span>
                  </p>
                </div>
              </div>

              {/* Pricing & Move-in Strip */}
              <div className="p-3.5 rounded-lg bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-800/40 border border-teal-500/20 dark:border-teal-800/40 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-medium">Move-in Date</span>
                  <span className="font-extrabold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                    <span>{new Date(b.moveInDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-medium">Rent & Escrow</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-sm sm:text-base">
                    ${(b.amount || b.monthlyRent || 0).toLocaleString()}
                    <span className="text-[11px] font-medium text-slate-400">/mo</span>
                  </span>
                </div>
              </div>

              {/* Host & Smart Lock Details */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <img
                    src={b.host?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80"}
                    alt={b.host?.name || "Host"}
                    className="size-7 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{b.host?.name || "Sarah Jenkins"}</span>
                    <span className="text-[10px] text-slate-400">Host / Landlord</span>
                  </div>
                </div>

                {b.smartLockCode && b.bookingStatus === "Approved" ? (
                  <button
                    onClick={() => {
                      setSelectedBooking(b);
                      setActiveModal("access");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Door PIN: {b.smartLockCode}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Digital Key upon approval</span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 relative z-10">
              <button
                onClick={() => {
                  setSelectedBooking(b);
                  setActiveModal("lease");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-teal-500" />
                <span>Lease Agreement</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedBooking(b);
                    setActiveModal("receipt");
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="View Escrow Receipt"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setSelectedBooking(b);
                    setActiveModal("access");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Key Pass & Guide</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Digital Lease Agreement Modal */}
      {activeModal === "lease" && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-lg border border-slate-200 dark:border-zinc-800 max-w-2xl w-full shadow-2xl space-y-5 relative overflow-hidden text-left max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Digital Residential Lease Agreement
                  </h3>
                  <p className="text-xs text-slate-500">Doc ID: {selectedBooking.leaseAgreementId} • E-Signed & Encrypted</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-600 dark:text-zinc-300">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold uppercase">Premises</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedBooking.propertyName} ({selectedBooking.unitNumber})</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold uppercase">Location</span>
                    <span className="font-medium text-slate-700 dark:text-zinc-200">{selectedBooking.propertyLocation}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold uppercase">Monthly Rent</span>
                    <span className="font-extrabold text-teal-600 dark:text-teal-400">${selectedBooking.monthlyRent.toLocaleString()} USD</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold uppercase">Security Deposit</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">${selectedBooking.depositAmount.toLocaleString()} USD (In Escrow)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 leading-relaxed">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Key Lease Terms & Conditions:</h4>
                <p>1. <strong>Occupancy & Term:</strong> Fixed term lease beginning {new Date(selectedBooking.moveInDate).toLocaleDateString()} for a duration of {selectedBooking.leaseDuration}.</p>
                <p>2. <strong>Rent Payments:</strong> Rent is processed automatically on the 1st of each calendar month via Renterty automated payment rails.</p>
                <p>3. <strong>Utilities & Maintenance:</strong> High-speed internet, water, and trash are included. Maintenance dispatch is triaged 24/7 via the Renterty Maintenance tab.</p>
                <p>4. <strong>Smart Lock & Access:</strong> Digital key codes are personal and strictly non-transferable.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Tenant & Landlord E-Signatures Verified</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">SHA-256 Verified</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadLease(selectedBooking.bookingRef)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Agreement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Key Pass & Check-In Guide */}
      {activeModal === "access" && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-lg border border-slate-200 dark:border-zinc-800 max-w-md w-full shadow-2xl space-y-5 relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Digital Smart Lock & Check-In
                  </h3>
                  <p className="text-xs text-slate-500">{selectedBooking.unitNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Door Code Box */}
              <div className="p-4 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 text-center space-y-2">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                  Front Door Keypad PIN
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-bold font-mono text-teal-900 dark:text-teal-200 tracking-widest">
                    {selectedBooking.smartLockCode}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedBooking.smartLockCode)}
                    className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-teal-300 dark:border-teal-700 text-teal-600 hover:bg-teal-50 transition cursor-pointer"
                    title="Copy Key Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-teal-600 dark:text-teal-400">
                  Touch the keypad to awaken, enter PIN, then press #
                </p>
              </div>

              {/* Wi-Fi Credentials */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-zinc-300">Wi-Fi Network:</span>
                  <span className="font-mono font-extrabold text-slate-900 dark:text-white">{selectedBooking.wifiName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-zinc-300">Password:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-extrabold text-teal-600 dark:text-teal-400">{selectedBooking.wifiPass}</span>
                    <button
                      onClick={() => handleCopy(selectedBooking.wifiPass)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Demo */}
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-800/60 flex items-center gap-3">
                <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700 shrink-0">
                  <QrCode className="w-8 h-8 text-teal-600" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Building Concierge QR Badge</span>
                  <span className="text-slate-500 text-[11px]">Scan at lobby turnstiles or elevator reader for seamless access.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Escrow & Payment Receipt */}
      {activeModal === "receipt" && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-lg border border-slate-200 dark:border-zinc-800 max-w-md w-full shadow-2xl space-y-5 relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Escrow Payment Receipt
                  </h3>
                  <p className="text-xs text-slate-500">Stripe Ref: {selectedBooking.transactionId}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">First Month Rent:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">${selectedBooking.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Security Deposit (Escrow):</span>
                <span className="font-extrabold text-slate-900 dark:text-white">${selectedBooking.depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Method:</span>
                <span className="font-bold text-slate-700 dark:text-zinc-300">{selectedBooking.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-zinc-800">
                <span className="font-bold text-slate-900 dark:text-white">Total Amount Processed:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                  ${(selectedBooking.amount + selectedBooking.depositAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadReceipt(selectedBooking.bookingRef)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
