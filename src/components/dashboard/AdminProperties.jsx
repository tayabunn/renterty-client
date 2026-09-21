"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Check, X, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import ListingQuality from "../ai/ListingQuality";
import { API_URL } from "@/lib/config";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectPropId, setRejectPropId] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("renterty_token") : null;
      try {
        const res = await fetch(`${API_URL}/properties/admin`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          credentials: "include"
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json().catch(() => []);
          if (isMounted) {
            setProperties(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.warn("Failed to load admin properties:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this property listing?")) return;

    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/properties/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Approved" })
      });
      if (res.ok) {
        toast.success("Listing Approved");
        fetchProperties();
      } else {
        toast.error("Failed to approve listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const handleRejectOpen = (id) => {
    setRejectPropId(id);
    setRejectionFeedback("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionFeedback.trim()) {
      toast.error("Please provide feedback for rejection");
      return;
    }

    setSubmittingFeedback(true);
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/properties/${rejectPropId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "Rejected",
          rejectionFeedback
        })
      });
      if (res.ok) {
        toast.success("Listing Rejected with feedback");
        setShowRejectModal(false);
        fetchProperties();
      } else {
        toast.error("Failed to reject listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;

    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Listing deleted successfully");
        setProperties(properties.filter((p) => p._id !== id));
      } else {
        toast.error("Failed to delete listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting property");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading listings registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all duration-300 rounded-lg overflow-hidden relative">
        <div className="absolute -right-8 -top-8 size-36 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Property Info</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Owner Info</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Rent Price</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs uppercase tracking-wider">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
              {properties.map((prop) => (
                <tr key={prop._id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={prop.images[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100"}
                      alt={prop.title}
                      className="h-10 w-16 object-cover rounded-lg border border-slate-200/80 dark:border-zinc-700"
                    />
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white">{prop.title}</span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">{prop.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="block font-bold text-slate-900 dark:text-white">
                        {prop.ownerId ? prop.ownerId.name : "N/A"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">{prop.ownerEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-teal-600 dark:text-teal-400 font-extrabold">
                    ${prop.rent.toLocaleString()}/{prop.rentType}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                        prop.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : prop.status === "Rejected"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      <span>{prop.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <ListingQuality property={prop} />

                      {prop.status !== "Approved" && (
                        <button
                          onClick={() => handleApprove(prop._id)}
                          className="p-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                          title="Approve Listing"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      {prop.status !== "Rejected" && (
                        <button
                          onClick={() => handleRejectOpen(prop._id)}
                          className="p-1.5 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                          title="Reject Listing"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(prop._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                        title="Permanently Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Feedback Modal Form */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Reject Listing</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mb-4">Provide rejection feedback to explain the reasons to the owner.</p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <textarea
                  required
                  rows="4"
                  placeholder="e.g. Please upload higher resolution photos and provide a detailed description..."
                  value={rejectionFeedback}
                  onChange={(e) => setRejectionFeedback(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 p-3 rounded-xl text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-1"
                >
                  {submittingFeedback && <Loader2 className="animate-spin h-4 w-4 mr-1" />}
                  <span>Submit Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
