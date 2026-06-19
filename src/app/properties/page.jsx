"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { Search, MapPin, Building, DollarSign, BedDouble, Bath, Maximize, Loader2, ArrowUpDown } from "lucide-react";

// Wrap search params logic in a separate component to comply with Next.js Suspense boundary requirements
function PropertiesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load initial states from URL query parameters
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "All");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  // API response state
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch function
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (location) query.append("location", location);
      if (propertyType && propertyType !== "All") query.append("propertyType", propertyType);
      if (minPrice) query.append("minPrice", minPrice);
      if (maxPrice) query.append("maxPrice", maxPrice);
      if (sort) query.append("sort", sort);
      query.append("page", page);
      query.append("limit", 6); // 6 items per page

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter/page change
  useEffect(() => {
    fetchProperties();

    // Sync URL queries
    const query = new URLSearchParams();
    if (location) query.append("location", location);
    if (propertyType && propertyType !== "All") query.append("propertyType", propertyType);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sort) query.append("sort", sort);
    query.append("page", page);
    router.replace(`/properties?${query.toString()}`, { scroll: false });
  }, [page, sort]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new filter query
    fetchProperties();
  };

  const handleClearFilters = () => {
    setLocation("");
    setPropertyType("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  const handleViewDetails = (propertyId) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/properties/${propertyId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
      {/* Header and intro */}
      <div className="mb-10 text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore All Rentals
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Use the filters below to find rental houses, villas, and studios matching your budget and lifestyle.
        </p>
      </div>

      {/* Filters Form Card */}
      <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-sm mb-10">
        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Location */}
          <div className="text-left space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 text-teal-500" />
              <span>SEARCH CITY</span>
            </label>
            <input
              type="text"
              placeholder="e.g. New York, Miami..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            />
          </div>

          {/* Property Type */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
              <Building className="h-3.5 w-3.5 text-teal-500" />
              <span>PROPERTY TYPE</span>
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            >
              <option value="All">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
              <option value="Cabin">Cabin</option>
            </select>
          </div>

          {/* Min Price */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
              <DollarSign className="h-3.5 w-3.5 text-teal-500" />
              <span>MIN PRICE ($)</span>
            </label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            />
          </div>

          {/* Max Price */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
              <DollarSign className="h-3.5 w-3.5 text-teal-500" />
              <span>MAX PRICE ($)</span>
            </label>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            />
          </div>

          {/* Sort selection */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-teal-500" />
              <span>SORT BY PRICE</span>
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 col-span-1 md:col-span-4">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold shadow-md transition-all duration-200 text-sm"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl font-bold transition-all text-sm"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Properties grid list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
          <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            Fetching properties list...
          </span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
          <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No properties found</h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Try adjusting your search queries or filter categories.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Grid list of properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property._id}
                className="group bg-white dark:bg-zinc-900/40 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={property.images[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    {property.propertyType}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-lg font-black shadow-sm">
                    ${property.rent.toLocaleString()}
                    <span className="text-xs font-normal">/{property.rentType === "Monthly" ? "mo" : property.rentType === "Weekly" ? "wk" : "day"}</span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1.5 text-slate-500 dark:text-zinc-400 text-xs font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      <span>{property.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
                      {property.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                    {/* Size and specs */}
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-zinc-400">
                      <span className="flex items-center space-x-1">
                        <BedDouble className="h-4 w-4 text-teal-500" />
                        <span>{property.bedrooms} Beds</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Bath className="h-4 w-4 text-teal-500" />
                        <span>{property.bathrooms} Baths</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Maximize className="h-4 w-4 text-teal-500" />
                        <span>{property.size} sqft</span>
                      </span>
                    </div>

                    {/* View Details */}
                    <button
                      onClick={() => handleViewDetails(property._id)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-teal-500 dark:bg-zinc-800 dark:hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controllers */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/50 disabled:opacity-50 text-sm font-semibold transition"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/50 disabled:opacity-50 text-sm font-semibold transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Properties() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
          <span className="text-sm font-semibold text-slate-500">Loading Directory...</span>
        </div>
      }>
        <PropertiesContent />
      </Suspense>
      <Footer />
    </>
  );
}
