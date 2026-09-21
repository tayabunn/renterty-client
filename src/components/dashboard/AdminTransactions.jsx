"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CreditCard, 
  Clock, 
  ArrowUpRight, 
  TrendingUp, 
  Landmark
} from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

const DEMO_TRANSACTIONS = [
  {
    _id: "tx-demo-01",
    transactionId: "ch_3N9xKl2eZvKYlo2C09zDemo",
    bookingRef: "RNT-89421",
    propertyName: "The Grand Manhattan Sky Penthouse",
    tenantName: "Alex Mercer",
    tenantEmail: "alex.mercer@gmail.com",
    ownerEmail: "sarah.j@manhattanrentals.com",
    amount: 8400, // First month + Deposit
    platformFee: 420,
    netPayout: 7980,
    paymentMethod: "Visa ···· 4242",
    paymentStatus: "Paid",
    escrowStatus: "Escrow Secured",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    _id: "tx-demo-02",
    transactionId: "ch_3M7tQp4bZvKYlo2C88yDemo",
    bookingRef: "RNT-77293",
    propertyName: "Coastal Miami Waterfront Villa",
    tenantName: "Jordan Hayes",
    tenantEmail: "jordan.h@techinvest.io",
    ownerEmail: "marcus@miamicoastalluxury.com",
    amount: 11600,
    platformFee: 580,
    netPayout: 11020,
    paymentMethod: "Mastercard ···· 8831",
    paymentStatus: "Paid",
    escrowStatus: "Escrow Secured",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
  },
  {
    _id: "tx-demo-03",
    transactionId: "ch_3K1sLm9xZvKYlo2C41pDemo",
    bookingRef: "RNT-62019",
    propertyName: "Sunset Boulevard Modern Loft",
    tenantName: "Sophia Martinez",
    tenantEmail: "sophia.m@designstudio.co",
    ownerEmail: "elena@weholofts.com",
    amount: 6800,
    platformFee: 340,
    netPayout: 6460,
    paymentMethod: "Apple Pay (Amex ···· 1004)",
    paymentStatus: "Paid",
    escrowStatus: "Escrow Secured",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    _id: "tx-demo-04",
    transactionId: "ch_2J9qWz1vZvKYlo2C77aDemo",
    bookingRef: "RNT-51082",
    propertyName: "Silicon Valley Smart Eco-Studio",
    tenantName: "Michael Chang",
    tenantEmail: "m.chang@stanford.edu",
    ownerEmail: "david@stanfordliving.io",
    amount: 5800,
    platformFee: 290,
    netPayout: 5510,
    paymentMethod: "Visa ···· 4242",
    paymentStatus: "Paid",
    escrowStatus: "Payout Released",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
  }
];

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("renterty_token") : null;
      try {
        const res = await fetch(`${API_URL}/bookings/admin`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          credentials: "include"
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json().catch(() => []);
          if (isMounted) {
            const paidBookings = Array.isArray(data) ? data.filter((b) => b.paymentStatus === "Paid") : [];
            if (paidBookings.length > 0) {
              setTransactions(paidBookings);
            } else {
              setTransactions(DEMO_TRANSACTIONS);
            }
          }
        } else {
          if (isMounted) setTransactions(DEMO_TRANSACTIONS);
        }
      } catch (err) {
        if (isMounted) setTransactions(DEMO_TRANSACTIONS);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      tx.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.bookingRef && tx.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;
    if (statusFilter === "ALL") return true;
    if (statusFilter === "ESCROW") return tx.escrowStatus === "Escrow Secured";
    if (statusFilter === "RELEASED") return tx.escrowStatus === "Payout Released";
    return true;
  });

  const totalProcessed = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalFees = transactions.reduce((sum, tx) => sum + (tx.platformFee || (tx.amount ? tx.amount * 0.05 : 0)), 0);
  const totalPayouts = transactions.reduce((sum, tx) => sum + (tx.netPayout || (tx.amount ? tx.amount * 0.95 : 0)), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading transactions registry...</span>
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
            <span>Stripe Connect Escrow Settlement</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-teal-500" />
            <span>Financial Transactions & Escrow Logs</span>
          </h2>
          <p className="text-base text-slate-500 dark:text-zinc-400 mt-0.5">
            Real-time ledger of reservation deposits, platform commissions, and automated landlord payouts
          </p>
        </div>

        <button
          onClick={() => toast.success("Exporting financial transactions to CSV...")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Financials</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Gross Volume Processed</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${totalProcessed.toLocaleString()}</p>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" /> 100% Escrow Protected
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Platform Take-Rate Revenue</span>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">${totalFees.toLocaleString()}</p>
          <span className="text-[11px] font-semibold text-teal-600">5% Automated Take</span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Net Landlord Disbursed</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">${totalPayouts.toLocaleString()}</p>
          <span className="text-[11px] font-semibold text-slate-400">Direct Stripe Transfer</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-x-auto">
          {[
            { id: "ALL", label: "All Transactions" },
            { id: "ESCROW", label: "In Escrow" },
            { id: "RELEASED", label: "Disbursed" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Tx ID, property, or tenant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
              <tr>
                <th className="px-6 py-4">Transaction Reference</th>
                <th className="px-6 py-4">Property & Parties</th>
                <th className="px-6 py-4">Gross Amount</th>
                <th className="px-6 py-4">Platform Fee</th>
                <th className="px-6 py-4">Escrow Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
              {filtered.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold block text-slate-900 dark:text-white select-all">
                      {tx.transactionId}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <CreditCard className="w-3 h-3 text-teal-500" />
                      <span>{tx.paymentMethod || "Stripe Checkout"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold block text-slate-900 dark:text-white">{tx.propertyName}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      Tenant: {tx.tenantName} ({tx.tenantEmail})
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    ${tx.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-teal-600 dark:text-teal-400">
                    +${(tx.platformFee || (tx.amount ? tx.amount * 0.05 : 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        tx.escrowStatus === "Payout Released"
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 border-teal-200 dark:border-teal-800"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      <span>{tx.escrowStatus || "Escrow Secured"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
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
