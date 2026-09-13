"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Heart, Trash2, MapPin, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

export default function TenantFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (favoriteId) => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Favorite removed");
        // Update local state
        setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
      } else {
        toast.error("Failed to remove favorite");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing favorite");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-teal-500 mr-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading favorites...</span>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
        <Heart className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No favorites yet</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Bookmark properties to save them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
            <tr>
              <th className="px-6 py-4">Property Info</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Rent Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
            {favorites.map((fav) => {
              const prop = fav.propertyId;
              if (!prop) return null;
              return (
                <tr key={fav._id} className="hover:bg-slate-50/55 dark:hover:bg-zinc-900/30 transition">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={prop.images[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100"}
                      alt={prop.title}
                      className="h-10 w-16 object-cover rounded-lg border border-slate-100"
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
                    ${prop.rent.toLocaleString()}/{prop.rentType === "Monthly" ? "mo" : prop.rentType === "Weekly" ? "wk" : "day"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemoveFavorite(fav._id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                      title="Remove Favorite"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
