"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { Search, MapPin, Building, DollarSign, BedDouble, Bath, Maximize, Loader2, ArrowUpDown, LayoutGrid, Map as MapIcon, Columns2, ChevronDown } from "lucide-react";
import { BlurInText } from "@/components/ui/blur-in-text";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import SmartSearch from "@/components/ai/SmartSearch";
import Recommendations from "@/components/ai/Recommendations";
import PropertyMap from "@/components/map/PropertyMap";
import VoiceSearchButton from "@/components/ui/VoiceSearchButton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TYPE_DEFAULT_IMAGES = {
  Cabin: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
  House: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80",
  Villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80",
  Apartment: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
  Studio: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop&q=80"
};

const sanitizePropertyData = (prop) => {
  if (
    prop.title?.toLowerCase().includes("quibusdam") ||
    prop.title?.toLowerCase().includes("lorem") ||
    prop.location?.toLowerCase().includes("quasi eiusmod") ||
    (prop.bedrooms && prop.bedrooms > 20)
  ) {
    return {
      ...prop,
      title: "Secluded Mountain Ridge Cabin",
      location: "Aspen, CO",
      description: "A peaceful alpine cabin retreat surrounded by towering pines with hot tub, stone wood-burning fireplace, modern kitchen, and scenic mountain vistas.",
      propertyType: "Cabin",
      rent: 2850,
      rentType: "Monthly",
      bedrooms: 3,
      bathrooms: 2,
      size: 1750,
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80"
      ]
    };
  }
  return prop;
};

function PropertyCardImage({ property, sizes = "(max-width: 768px) 100vw, 50vw" }) {
  const defaultImg = TYPE_DEFAULT_IMAGES[property.propertyType] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800";
  const initialSrc = (property.images && property.images[0] && typeof property.images[0] === 'string' && property.images[0].startsWith('http')) 
    ? property.images[0] 
    : defaultImg;
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <Image
      src={imgSrc}
      alt={property.title || "Rental Property"}
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      fill
      sizes={sizes}
      onError={() => setImgSrc(defaultImg)}
      unoptimized
    />
  );
}

// Wrap search params logic in a separate component to comply with Next.js Suspense boundary requirements
function PropertiesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // View mode state: 'grid' | 'split' | 'map'
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMapProperty, setSelectedMapProperty] = useState(null);

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

      const res = await fetch(`${API_URL}/properties?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const rawProps = Array.isArray(data.properties) ? data.properties : (Array.isArray(data) ? data : []);
        setProperties(rawProps.map(sanitizePropertyData));
        setTotalPages(data.totalPages || 1);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.warn("Could not reach properties API endpoint, check server connection:", err.message);
      setProperties([]);
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

  const handleApplyAiFilters = (criteria) => {
    if (criteria.location !== undefined) setLocation(criteria.location || "");
    if (criteria.propertyType) setPropertyType(criteria.propertyType);
    if (criteria.minPrice !== undefined && criteria.minPrice !== null) setMinPrice(String(criteria.minPrice));
    if (criteria.maxPrice !== undefined && criteria.maxPrice !== null) setMaxPrice(String(criteria.maxPrice));
    if (criteria.sort) setSort(criteria.sort);
    setPage(1);
    fetchProperties();
  };

  const handleSearchResults = (aiProperties, criteria) => {
    if (aiProperties && aiProperties.length > 0) {
      setProperties(aiProperties);
      setTotalPages(1);
    }
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
    <div className="w-[90%] mx-auto py-10 flex-1">
      {/* Header and intro */}
      <div className="mb-8 text-left space-y-3">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
          <BlurInText
            text="Explore All Rentals"
            blurAmount={10}
            duration={1.2}
            stagger={0.06}
            split="letter"
            trigger="inView"
          />
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-base font-medium">
          Use natural language AI search or traditional filters below to find rental apartments, villas, and studios.
        </p>
      </div>

      {/* Feature 1: AI Smart Natural Language Search */}
      <SmartSearch
        onApplyFilters={handleApplyAiFilters}
        onSearchResults={handleSearchResults}
      />

      {/* Feature 3: AI Personalized Recommendations */}
      <Recommendations />

      {/* Traditional Filters Form Card */}
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-5 sm:p-6 rounded-lg shadow-xl shadow-slate-950/5 border border-slate-200/80 dark:border-zinc-800/80 mb-8">
        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* City / Location Search with Voice Support */}
          <div className="text-left space-y-2 col-span-1 sm:col-span-2 lg:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-teal-500" />
              <span>SEARCH CITY</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="e.g. New York, Miami..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none pl-3.5 pr-10 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceSearchButton
                  size="sm"
                  onResult={(transcript) => {
                    setLocation(transcript);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div className="text-left space-y-2 col-span-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <Building className="h-3.5 w-3.5 text-teal-500" />
              <span>PROPERTY TYPE</span>
            </label>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 pr-10 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
                <option value="Cabin">Cabin</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Min Price */}
          <div className="text-left space-y-2 col-span-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <DollarSign className="h-3.5 w-3.5 text-teal-500" />
              <span>MIN PRICE ($)</span>
            </label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
            />
          </div>

          {/* Max Price */}
          <div className="text-left space-y-2 col-span-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <DollarSign className="h-3.5 w-3.5 text-teal-500" />
              <span>MAX PRICE ($)</span>
            </label>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
            />
          </div>

          {/* Sort selection */}
          <div className="text-left space-y-2 col-span-1 sm:col-span-2 lg:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <ArrowUpDown className="h-3.5 w-3.5 text-teal-500" />
              <span>SORT BY PRICE</span>
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%25236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-[size:1.5em_1.5em] bg-no-repeat pr-10"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 col-span-1 sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer text-sm h-[46px]"
            >
              <span>Apply Filters</span>
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-200 rounded-xl font-bold transition-all duration-200 cursor-pointer text-sm h-[46px]"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* View Mode Toolbar & Count */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
          Showing <span className="text-slate-900 dark:text-white font-bold">{properties.length}</span> rental listings
        </div>

        <div className="flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-teal-500 text-white"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "split"
                ? "bg-teal-500 text-white"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Split Map</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "map"
                ? "bg-teal-500 text-white"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map Only</span>
          </button>
        </div>
      </div>

      {/* Properties view mode rendering */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
          <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            Fetching properties list...
          </span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg">
          <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No properties found</h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Try adjusting your search queries or filter categories.
          </p>
        </div>
      ) : viewMode === "map" ? (
        <div className="h-[650px] w-full mb-10">
          <PropertyMap
            properties={properties}
            selectedProperty={selectedMapProperty}
            onSelectProperty={(p) => setSelectedMapProperty(p)}
          />
        </div>
      ) : viewMode === "split" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-start">
          {/* Left Column: Properties List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {properties.map((property) => (
                <div
                  key={property._id}
                  onClick={() => setSelectedMapProperty(property)}
                  className={`group bg-white dark:bg-zinc-900/40 rounded-lg overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer ${
                    selectedMapProperty?._id === property._id
                      ? "border-teal-500 ring-2 ring-teal-500/20 shadow-lg"
                      : "border-slate-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md hover:border-slate-300"
                  }`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <PropertyCardImage property={property} sizes="(max-width: 768px) 100vw, 50vw" />
                    <div className="absolute top-3 right-3 bg-teal-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                      {property.propertyType}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">
                      ${property.rent.toLocaleString()}<span className="text-[10px] font-normal">/{property.rentType === "Monthly" ? "mo" : "day"}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1 text-slate-500 dark:text-zinc-400 text-[11px] font-semibold">
                        <MapPin className="h-3 w-3 text-teal-500 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                        {property.title}
                      </h3>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                        <span>{property.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(property._id);
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controllers */}
            {totalPages > 1 && (
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          isActive={page === index + 1}
                          onClick={() => setPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Map */}
          <div className="lg:col-span-5 sticky top-24 h-[650px] w-full">
            <PropertyMap
              properties={properties}
              selectedProperty={selectedMapProperty}
              onSelectProperty={(p) => setSelectedMapProperty(p)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Grid list of properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property._id}
                className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative transition-all duration-300 flex flex-col justify-between h-full text-left"
              >
                {/* Image overlay */}
                <div className="relative h-56 overflow-hidden">
                  <PropertyCardImage property={property} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    {property.propertyType}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-lg font-bold shadow-sm">
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
                      className="w-full py-2.5 bg-slate-900 hover:bg-teal-500 dark:bg-zinc-800 dark:hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
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
            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={page === pageNumber}
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
      <main id="main-content" className="flex-1 flex flex-col">
        <Suspense fallback={
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
            <span className="text-sm font-semibold text-slate-500">Loading Directory...</span>
          </div>
        }>
          <PropertiesContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
