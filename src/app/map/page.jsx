"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyMap from "@/components/map/PropertyMap";
import { API_URL } from "@/lib/config";
import {
  MapPin,
  Building,
  DollarSign,
  BedDouble,
  Bath,
  Maximize,
  Search,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Loader2,
  Sparkles,
  Heart,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MapExplorerPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mobileView, setMobileView] = useState("split"); // "split" | "list" | "map"

  // Filter States
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (location) query.append("location", location);
        if (propertyType && propertyType !== "All") query.append("propertyType", propertyType);
        if (maxPrice) query.append("maxPrice", maxPrice);
        query.append("limit", 50);

        const res = await fetch(`${API_URL}/properties?${query.toString()}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data) {
            setProperties(data.properties || []);
          }
        }
      } catch {
        // Fallback gracefully without console error
      } finally {
        setLoading(false);
      }
    };

    fetchProps();
  }, [location, propertyType, maxPrice]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Navbar />

      {/* Top Filter Bar */}
      <section className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-6 py-3.5 sticky top-16 z-30">
        <div className="w-[90%] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Inputs */}
          <div className="flex-1 flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, neighborhood..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition"
              />
            </div>

            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="pl-3.5 pr-8 py-2 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
                <option value="Cabin">Cabin</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-zinc-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-3.5 pr-8 py-2 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer"
              >
                <option value="">Any Price</option>
                <option value="1000">Under $1,000</option>
                <option value="2000">Under $2,000</option>
                <option value="3000">Under $3,000</option>
                <option value="5000">Under $5,000</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Mobile View Toggle Buttons */}
          <div className="flex md:hidden items-center justify-center p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl gap-1">
            <button
              onClick={() => setMobileView("list")}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                mobileView === "list"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List ({properties.length})</span>
            </button>
            <button
              onClick={() => setMobileView("map")}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                mobileView === "map"
                  ? "bg-white dark:bg-zinc-900 text-teal-600 shadow-xs"
                  : "text-slate-500 dark:text-zinc-400"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>Map Explorer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Split-Screen Container */}
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-100px)] min-h-[680px] lg:min-h-[750px] overflow-hidden">
        {/* Left Side: Property Cards List */}
        <div
          className={`w-full md:w-[45%] lg:w-[40%] xl:w-[35%] h-full overflow-y-auto p-4 sm:p-6 space-y-4 border-r border-slate-200/80 dark:border-zinc-800/80 ${
            mobileView === "map" ? "hidden md:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-zinc-800/60">
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Properties on Map
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {properties.length} rental properties found
              </p>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-full">
              Live Map View
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
              <span className="text-xs font-semibold text-slate-400">Loading map listings...</span>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
              <MapPin className="h-10 w-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No properties found</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Try adjusting your filters or location search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((prop) => {
                const isSelected = selectedProperty?._id === prop._id;
                return (
                  <div
                    key={prop._id}
                    onClick={() => setSelectedProperty(prop)}
                    className={`group bg-white dark:bg-zinc-900 rounded-lg border p-3.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-teal-500 ring-2 ring-teal-500/20"
                        : "border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/50"
                    }`}
                  >
                    <div className="flex gap-3.5">
                      {/* Image Preview */}
                      <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800">
                        <img
                          src={prop.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {prop.propertyType}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-extrabold text-teal-600 dark:text-teal-400">
                              ${prop.rent?.toLocaleString()}
                              <span className="text-[10px] font-medium text-slate-400">/{prop.rentType || "mo"}</span>
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                            {prop.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{prop.location}</span>
                          </p>
                        </div>

                        {/* Specs & Link */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60 text-[11px] text-slate-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <BedDouble className="h-3 w-3" /> {prop.bedrooms} bd
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" /> {prop.bathrooms} ba
                          </span>
                          <Link
                            href={`/properties/${prop._id}`}
                            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
                          >
                            Details <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Interactive Leaflet Map */}
        <div
          className={`flex-1 h-full min-h-full relative bg-slate-100 dark:bg-zinc-900 flex flex-col ${
            mobileView === "list" ? "hidden md:flex" : "flex"
          }`}
        >
          <PropertyMap
            properties={properties}
            selectedProperty={selectedProperty}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
          />
        </div>
      </div>
    </div>
  );
}
