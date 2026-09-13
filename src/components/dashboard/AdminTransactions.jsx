"use client";

import React, { useState, useEffect } from "react";
import { Loader2, DollarSign, Calendar, FileText, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("renterty_token");
      try {
        const res = await fetch(`${API_URL}/bookings/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter to show paid bookings which act as transaction records
          const paidBookings = data.filter((b) => b.paymentStatus === "Paid");
          setTransactions(paidBookings);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading transactions registry...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
        <CheckCircle2 className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No transactions yet</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Paid reservation bookings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm text-left">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Property Name</th>
              <th className="px-6 py-4">Tenant Name</th>
              <th className="px-6 py-4">Owner Email</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-slate-50/55 dark:hover:bg-zinc-900/30 transition">
                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-zinc-400 break-all select-all">
                  {tx.transactionId}
                </td>
                <td className="px-6 py-4 font-bold">{tx.propertyName}</td>
                <td className="px-6 py-4">{tx.tenantName}</td>
                <td className="px-6 py-4">{tx.ownerId?.email || "N/A"}</td>
                <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-extrabold">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
