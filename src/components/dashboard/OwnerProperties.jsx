"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Trash2, Eye, HelpCircle, Edit3, X, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

export default function OwnerProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState("");

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchProperties = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/properties/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

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

  const handleEditOpen = (property) => {
    setEditProperty({ ...property });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/properties/${editProperty._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editProperty)
      });
      if (res.ok) {
        toast.success("Listing updated! Sent back for Admin Review.");
        setShowEditModal(false);
        fetchProperties();
      } else {
        toast.error("Failed to update listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating property");
    } finally {
      setUpdating(false);
    }
  };

  const handleShowFeedback = (feedback) => {
    setActiveFeedback(feedback || "No feedback left by administrator.");
    setShowFeedbackModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading properties...</span>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
        <Trash2 className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No properties added yet</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Add a new property to start leasing your space.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
              <tr>
                <th className="px-6 py-4">Property Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Rent Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
              {properties.map((prop) => (
                <tr key={prop._id} className="hover:bg-slate-50/55 dark:hover:bg-zinc-900/30 transition">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={prop.images[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100"}
                      alt={prop.title}
                      className="h-10 w-16 object-cover rounded-lg border"
                    />
                    <span className="font-bold">{prop.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{prop.location}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-teal-600 dark:text-teal-400 font-extrabold">
                    ${prop.rent.toLocaleString()}/{prop.rentType}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          prop.status === "Approved"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : prop.status === "Rejected"
                            ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}
                      >
                        {prop.status}
                      </span>
                      {prop.status === "Rejected" && (
                        <button
                          onClick={() => handleShowFeedback(prop.rejectionFeedback)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                          title="View Rejection Feedback"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditOpen(prop)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-955/20 rounded-lg transition"
                      title="Edit Listing"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prop._id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg transition"
                      title="Delete Listing"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Rejection Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Rejection Feedback</h3>
            <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/20 text-sm text-red-600 dark:text-red-400 rounded-2xl italic leading-relaxed">
              &ldquo;{activeFeedback}&rdquo;
            </div>
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="mt-6 w-full py-2.5 bg-slate-900 dark:bg-zinc-800 text-white rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {showEditModal && editProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative my-8">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Edit Property Listing</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={editProperty.title}
                  onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent p-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Rent Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={editProperty.rent}
                    onChange={(e) => setEditProperty({ ...editProperty, rent: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent p-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Rent Type</label>
                  <select
                    value={editProperty.rentType}
                    onChange={(e) => setEditProperty({ ...editProperty, rentType: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent p-2.5 rounded-xl text-sm"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={editProperty.location}
                  onChange={(e) => setEditProperty({ ...editProperty, location: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent p-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editProperty.description}
                  onChange={(e) => setEditProperty({ ...editProperty, description: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent p-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-1"
                >
                  {updating && <Loader2 className="animate-spin h-4 w-4 mr-1" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
