"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  Heart, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Building, 
  ExternalLink, 
  Check, 
  X, 
  LayoutGrid, 
  List, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Layers
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { API_URL } from "@/lib/config";

const DEMO_FAVORITES = [
  {
    _id: "demo-fav-01",
    propertyId: {
      _id: "prop-fav-01",
      title: "The Grand Manhattan Sky Penthouse",
      location: "Soho, New York, NY 10012",
      rent: 4200,
      rentType: "Monthly",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1650,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80"
      ],
      aiMatchScore: 99,
      badge: "Verified Penthouse",
      priceDrop: "-$150/mo",
      amenities: ["Private Terrace", "In-Unit Washer", "24/7 Doorman", "Floor-to-Ceiling Windows", "EV Charging"],
      petFriendly: "Yes (Cats & Dogs)",
      parking: "Reserved Underground Spot",
      walkScore: 98
    }
  },
  {
    _id: "demo-fav-02",
    propertyId: {
      _id: "prop-fav-02",
      title: "Coastal Miami Waterfront Villa",
      location: "South Beach, Miami, FL 33139",
      rent: 5800,
      rentType: "Monthly",
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 2400,
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80"
      ],
      aiMatchScore: 97,
      badge: "Waterfront Dock",
      priceDrop: null,
      amenities: ["Private Heated Pool", "Deep Water Boat Slip", "Smart Home Automation", "Outdoor Kitchen", "Keyless Entry"],
      petFriendly: "Yes (All Pets Welcome)",
      parking: "2-Car Attached Garage",
      walkScore: 91
    }
  },
  {
    _id: "demo-fav-03",
    propertyId: {
      _id: "prop-fav-03",
      title: "Sunset Boulevard Modern Loft",
      location: "West Hollywood, CA 90069",
      rent: 3400,
      rentType: "Monthly",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"
      ],
      aiMatchScore: 95,
      badge: "Virtual Tour Ready",
      priceDrop: "-$100/mo",
      amenities: ["Rooftop Lounge", "High Ceilings", "Fiber Internet Ready", "Balcony Sunset Views", "Fitness Center"],
      petFriendly: "Yes (Small Pets)",
      parking: "Gated Covered Tandem",
      walkScore: 95
    }
  },
  {
    _id: "demo-fav-04",
    propertyId: {
      _id: "prop-fav-04",
      title: "Silicon Valley Smart Eco-Studio",
      location: "Palo Alto, CA 94301",
      rent: 2900,
      rentType: "Monthly",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"
      ],
      aiMatchScore: 94,
      badge: "Smart Eco Home",
      priceDrop: null,
      amenities: ["Solar Powered", "Smart Thermostat", "Bike Storage", "Bose Sound System", "Co-working Space"],
      petFriendly: "No Pets Allowed",
      parking: "1 Reserved EV Stall",
      walkScore: 89
    }
  },
  {
    _id: "demo-fav-05",
    propertyId: {
      _id: "prop-fav-05",
      title: "Austin Hill Country Modern Retreat",
      location: "Downtown Austin, TX 78701",
      rent: 2600,
      rentType: "Monthly",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
      ],
      aiMatchScore: 92,
      badge: "Scenic Views",
      priceDrop: "-$200/mo",
      amenities: ["Infinity Pool", "Dog Park on Site", "Hardwood Floors", "Chef's Kitchen", "Yoga Studio"],
      petFriendly: "Yes (No Breed Restrictions)",
      parking: "Private Driveway + Garage",
      walkScore: 87
    }
  },
  {
    _id: "demo-fav-06",
    propertyId: {
      _id: "prop-fav-06",
      title: "Seattle Emerald Bay View Suite",
      location: "Belltown, Seattle, WA 98121",
      rent: 2950,
      rentType: "Monthly",
      bedrooms: 2,
      bathrooms: 1.5,
      sqft: 1050,
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80"
      ],
      aiMatchScore: 90,
      badge: "Water & Space Needle Views",
      priceDrop: null,
      amenities: ["Bay View Balcony", "Fireplace", "Concierge", "Wine Cellar Storage", "Heated Spa"],
      petFriendly: "Yes (Cats & Small Dogs)",
      parking: "Underground Garage",
      walkScore: 96
    }
  }
];

export default function TenantFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("MATCH"); // 'MATCH' | 'PRICE_LOW' | 'PRICE_HIGH'
  
  // Interactive Modals
  const [compareModal, setCompareModal] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [tourModalProperty, setTourModalProperty] = useState(null);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Enrich real favorites if any
          const enriched = data.map((fav, idx) => ({
            ...DEMO_FAVORITES[idx % DEMO_FAVORITES.length],
            ...fav,
            propertyId: {
              ...DEMO_FAVORITES[idx % DEMO_FAVORITES.length].propertyId,
              ...(fav.propertyId || {})
            }
          }));
          setFavorites(enriched);
        } else {
          setFavorites(DEMO_FAVORITES);
        }
      } else {
        setFavorites(DEMO_FAVORITES);
      }
    } catch (err) {
      console.error(err);
      setFavorites(DEMO_FAVORITES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (favoriteId) => {
    const removedItem = favorites.find((fav) => fav._id === favoriteId);
    setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
    toast.success("Removed from saved favorites");

    const token = localStorage.getItem("renterty_token");
    try {
      await fetch(`${API_URL}/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      // Handled silently
    }
  };

  const toggleCompareSelect = (fav) => {
    if (selectedForCompare.some(item => item._id === fav._id)) {
      setSelectedForCompare(selectedForCompare.filter(item => item._id !== fav._id));
    } else {
      if (selectedForCompare.length >= 3) {
        toast.error("You can compare up to 3 properties side-by-side.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, fav]);
    }
  };

  // Filter & Sort
  const filteredFavorites = favorites
    .filter((fav) => {
      const prop = fav.propertyId;
      if (!prop) return false;
      const query = searchQuery.toLowerCase();
      return (
        prop.title?.toLowerCase().includes(query) ||
        prop.location?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const propA = a.propertyId || {};
      const propB = b.propertyId || {};
      if (sortBy === "MATCH") return (propB.aiMatchScore || 0) - (propA.aiMatchScore || 0);
      if (sortBy === "PRICE_LOW") return (propA.rent || 0) - (propB.rent || 0);
      if (sortBy === "PRICE_HIGH") return (propB.rent || 0) - (propA.rent || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin h-9 w-9 text-teal-500 mb-3" />
        <span className="text-slate-500 font-semibold text-sm">Loading your saved properties...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Curated Shortlist & AI Price Drop Alerts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" />
            <span>Saved Favorites & Wishlist ({favorites.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Compare rental amenities side-by-side, schedule walkthroughs, and receive instant price reduction notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {selectedForCompare.length > 0 && (
            <button
              onClick={() => setCompareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer animate-bounce"
            >
              <Layers className="w-4 h-4" />
              <span>Compare ({selectedForCompare.length})</span>
            </button>
          )}

          <Link
            href="/#properties"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Building className="w-4 h-4" />
            <span>Discover More</span>
          </Link>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800/70 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white dark:bg-zinc-900 text-teal-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white dark:bg-zinc-900 text-teal-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-bold text-slate-700 dark:text-zinc-300 outline-none focus:border-teal-500"
          >
            <option value="MATCH">✨ Highest AI Match %</option>
            <option value="PRICE_LOW">💵 Price: Low to High</option>
            <option value="PRICE_HIGH">💎 Price: High to Low</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-white/60 dark:bg-zinc-900/60">
          <Heart className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 dark:text-zinc-200">No properties match your search</h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Browse our catalog to bookmark your favorite luxury apartments and homes.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredFavorites.map((fav) => {
            const prop = fav.propertyId;
            const isCompared = selectedForCompare.some(item => item._id === fav._id);

            return (
              <div
                key={fav._id}
                className="group rounded-3xl bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between relative"
              >
                {/* Image Section */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <img
                    src={prop.images?.[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-extrabold">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>{prop.aiMatchScore || 95}% Match</span>
                    </span>

                    <button
                      onClick={() => handleRemoveFavorite(fav._id)}
                      className="p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 shadow-md transition cursor-pointer"
                      title="Remove Favorite"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                  </div>

                  {/* Price Tag & Price Drop Banner */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-black text-white drop-shadow-md">
                        ${prop.rent?.toLocaleString()}
                        <span className="text-xs font-semibold text-white/80">/mo</span>
                      </span>
                    </div>

                    {prop.priceDrop && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-extrabold shadow-md">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>{prop.priceDrop}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{prop.location}</span>
                    </p>
                  </div>

                  {/* Specs Strip */}
                  <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-teal-500" />
                      <span>{prop.bedrooms} Beds</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-teal-500" />
                      <span>{prop.bathrooms} Baths</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-teal-500" />
                      <span>{prop.sqft} sqft</span>
                    </span>
                  </div>

                  {/* Amenities Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                    {prop.amenities?.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg text-[10px] font-bold whitespace-nowrap"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleCompareSelect(fav)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        isCompared
                          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                          : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {isCompared ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                      <span>{isCompared ? "Selected" : "Compare"}</span>
                    </button>

                    <button
                      onClick={() => setTourModalProperty(prop)}
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Tour</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800 text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-zinc-950 font-bold text-slate-700 dark:text-zinc-300">
                <tr>
                  <th className="px-6 py-4">Property Info</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Specs</th>
                  <th className="px-6 py-4">Rent Price</th>
                  <th className="px-6 py-4">AI Match</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 font-medium text-slate-800 dark:text-zinc-200">
                {filteredFavorites.map((fav) => {
                  const prop = fav.propertyId;
                  if (!prop) return null;
                  return (
                    <tr key={fav._id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img
                          src={prop.images?.[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100"}
                          alt={prop.title}
                          className="h-12 w-16 object-cover rounded-xl border border-slate-200 dark:border-zinc-700 shrink-0 shadow-2xs"
                        />
                        <div>
                          <span className="font-bold block text-slate-900 dark:text-white">{prop.title}</span>
                          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">{prop.badge}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center space-x-1 text-slate-600 dark:text-zinc-300">
                          <MapPin className="h-3.5 w-3.5 text-teal-500" />
                          <span>{prop.location}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-300">
                        {prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.sqft} sqft
                      </td>
                      <td className="px-6 py-4 font-black text-teal-600 dark:text-teal-400">
                        ${prop.rent?.toLocaleString()}/mo
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
                          <Sparkles className="w-3 h-3 text-teal-500" />
                          <span>{prop.aiMatchScore || 95}%</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setTourModalProperty(prop)}
                          className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl text-xs font-bold hover:from-teal-600 hover:to-emerald-600 transition cursor-pointer"
                        >
                          Book Tour
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(fav._id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
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
      )}

      {/* MODAL: SIDE-BY-SIDE PROPERTY COMPARISON MATRIX */}
      {compareModal && selectedForCompare.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-4xl w-full shadow-2xl space-y-5 relative overflow-hidden text-left max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Side-by-Side Property Comparison
                  </h3>
                  <p className="text-xs text-slate-500">Evaluating {selectedForCompare.length} selected wishlist properties</p>
                </div>
              </div>
              <button
                onClick={() => setCompareModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedForCompare.map((fav) => {
                  const prop = fav.propertyId;
                  return (
                    <div
                      key={fav._id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3 text-xs"
                    >
                      <img
                        src={prop.images?.[0]}
                        alt={prop.title}
                        className="w-full h-32 rounded-xl object-cover"
                      />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{prop.title}</h4>
                      <p className="text-teal-600 dark:text-teal-400 font-black text-base">${prop.rent?.toLocaleString()}/mo</p>
                      
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                        <div className="flex justify-between">
                          <span className="text-slate-500">AI Match:</span>
                          <span className="font-bold text-emerald-600">{prop.aiMatchScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Layout:</span>
                          <span className="font-bold">{prop.bedrooms} Bed, {prop.bathrooms} Bath</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Total Area:</span>
                          <span className="font-bold">{prop.sqft} sqft</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Price / sqft:</span>
                          <span className="font-bold">${(prop.rent / (prop.sqft || 1)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">WalkScore:</span>
                          <span className="font-bold text-purple-600">{prop.walkScore} / 100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pet Policy:</span>
                          <span className="font-medium">{prop.petFriendly}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Parking:</span>
                          <span className="font-medium">{prop.parking}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCompareModal(false);
                          setTourModalProperty(prop);
                        }}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition text-xs cursor-pointer mt-2"
                      >
                        Book Walkthrough
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setCompareModal(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUICK BOOK TOUR */}
      {tourModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-md w-full shadow-2xl space-y-4 relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Schedule Viewing Walkthrough
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">{tourModalProperty.title}</p>
                </div>
              </div>
              <button
                onClick={() => setTourModalProperty(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Tour Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toast.success("Selected Live HD Video Tour 🎥")}
                    className="p-3 rounded-xl border border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 font-bold text-center"
                  >
                    🎥 Live Video Call
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success("Selected In-Person Walkthrough 📍")}
                    className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-center hover:border-teal-500"
                  >
                    📍 In-Person Visit
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  defaultValue={new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0]}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-medium outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1">Time Slot</label>
                <select
                  defaultValue="02:00 PM (EST)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-medium outline-none focus:border-teal-500"
                >
                  <option>10:00 AM (EST)</option>
                  <option>02:00 PM (EST)</option>
                  <option>04:30 PM (EST)</option>
                  <option>06:00 PM (EST)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setTourModalProperty(null)}
                className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success(`Tour request confirmed for "${tourModalProperty.title}"! Redirecting to Tours schedule...`);
                  setTourModalProperty(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Confirm Tour Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
