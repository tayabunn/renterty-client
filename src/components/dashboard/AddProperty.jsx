"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Plus, Sparkles, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import PropertyDescriptionGenerator from "../ai/PropertyDescriptionGenerator";
import ImageAnalyzer from "../ai/ImageAnalyzer";
import RentEstimator from "../ai/RentEstimator";
import { API_URL } from "@/lib/config";

export default function AddProperty() {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [rent, setRent] = useState("");
  const [rentType, setRentType] = useState("Monthly");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [size, setSize] = useState("");
  const [extraFeatures, setExtraFeatures] = useState("");

  // Prepopulate from URL parameters if available (e.g. from AI Estimator or Landlord landing page)
  useEffect(() => {
    if (!searchParams) return;
    const pRent = searchParams.get("rent");
    const pLoc = searchParams.get("location");
    const pBeds = searchParams.get("bedrooms");
    const pBaths = searchParams.get("bathrooms");
    const pType = searchParams.get("propertyType");
    const pSize = searchParams.get("size");
    const pAmenities = searchParams.get("amenities");

    if (pRent) setRent(pRent);
    if (pLoc) setLocation(pLoc);
    if (pBeds) setBedrooms(Number(pBeds) || 1);
    if (pBaths) setBathrooms(Number(pBaths) || 1);
    if (pType) setPropertyType(pType);
    if (pSize) setSize(pSize);
    if (pAmenities) {
      const splitAmenities = pAmenities.split(",").map((a) => a.trim()).filter(Boolean);
      if (splitAmenities.length > 0) setAmenities(splitAmenities);
    }
    if (pLoc && pBeds && !title) {
      setTitle(`${pBeds} Bedroom ${pType || "Apartment"} in ${pLoc}`);
    }
  }, [searchParams]);

  // Amenities checklist
  const [amenities, setAmenities] = useState([]);
  const availableAmenities = ["Wifi", "Air Conditioning", "Pool", "Gym", "Laundry", "Fireplace", "Gated Security", "Backyard", "Kitchen"];

  // Image URLs
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const handleAmenityChange = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !rent || !size) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("renterty_token");

    // Gather images
    const images = [];
    if (image1.trim()) images.push(image1.trim());
    if (image2.trim()) images.push(image2.trim());
    if (image3.trim()) images.push(image3.trim());

    // Fallback image if none provided
    if (images.length === 0) {
      images.push("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800");
    }

    try {
      const res = await fetch(`${API_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          location,
          propertyType,
          rent: Number(rent),
          rentType,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          size: Number(size),
          amenities,
          images,
          extraFeatures
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.status === "Approved" ? "Property listing created and approved!" : "Listing submitted for Admin approval!");
        // Reset form fields
        setTitle("");
        setDescription("");
        setLocation("");
        setPropertyType("Apartment");
        setRent("");
        setRentType("Monthly");
        setBedrooms(1);
        setBathrooms(1);
        setSize("");
        setExtraFeatures("");
        setAmenities([]);
        setImage1("");
        setImage2("");
        setImage3("");
      } else {
        toast.error(data.message || "Failed to create listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating property listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="group w-full bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 relative overflow-hidden text-left">
        {/* Corner Ambient Glow Orb */}
        <div className="absolute -right-12 -top-12 size-48 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header with Bento Styling */}
        <div className="flex items-start sm:items-center space-x-3.5 sm:space-x-4 mb-8 sm:mb-10 relative z-10">
          <div className="size-14 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center text-2xl shadow-md shadow-teal-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
              <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span>Property Management Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Add New Property Listing
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm">
              List high-end residential real estate with intelligent automated pricing & AI visual analysis.
            </p>
          </div>

          <div className="ml-auto hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setTitle("Luxury Skyline Duplex Penthouse");
                setLocation("Tribeca, New York, NY 10013");
                setPropertyType("Apartment");
                setRent("4600");
                setRentType("Monthly");
                setBedrooms(3);
                setBathrooms(2);
                setSize("1750");
                setAmenities(["Wifi", "Air Conditioning", "Pool", "Gym", "Laundry", "Fireplace", "Gated Security"]);
                setImage1("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800");
                setImage2("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800");
                setImage3("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800");
                setExtraFeatures("Floor-to-ceiling glass windows, private elevator foyer, Gaggenau appliances, and rooftop terrace.");
                setDescription("Stunning Tribeca skyline duplex featuring expansive living spaces, private elevator access, and panoramic city views.");
                toast.success("Loaded demo property sample data! 🚀");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>Fill Demo Sample</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7 relative z-10">
          {/* Title & Property Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                PROPERTY TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Elegant 3-Bed Villa with Pool"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                PROPERTY TYPE
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 pr-10 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100 appearance-none cursor-pointer"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Cabin">Cabin</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description & AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                DESCRIPTION
              </label>
              <PropertyDescriptionGenerator
                formData={{
                  title,
                  description,
                  location,
                  propertyType,
                  rent,
                  rentType,
                  bedrooms,
                  bathrooms,
                  size,
                  amenities,
                  extraFeatures
                }}
                onApplyTitle={(newTitle) => setTitle(newTitle)}
                onApplyDescription={(newDesc) => setDescription(newDesc)}
              />
            </div>
            <textarea
              rows="3"
              placeholder="Explain property highlights, neighborhood, transport... or use the AI Generator above"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              LOCATION (CITY & STATE) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Miami, FL"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            />
          </div>

          {/* Feature 6: AI Rent Estimator Widget */}
          <RentEstimator
            formData={{
              location,
              propertyType,
              bedrooms,
              bathrooms,
              size,
              amenities
            }}
            onApplyRent={(estimatedRent) => setRent(String(estimatedRent))}
          />

          {/* Rent & Type & Size Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                RENT PRICE ($) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 2500"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                RENT FREQUENCY
              </label>
              <div className="relative">
                <select
                  value={rentType}
                  onChange={(e) => setRentType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 pr-10 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100 appearance-none cursor-pointer"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                SIZE (SQFT) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 1200"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                BEDROOMS
              </label>
              <input
                type="number"
                value={bedrooms}
                min="1"
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                BATHROOMS
              </label>
              <input
                type="number"
                value={bathrooms}
                min="1"
                step="0.5"
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Amenities Checklist */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-3">
              AMENITIES
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer select-none transition ${amenities.includes(amenity)
                      ? "bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-950/20 dark:border-teal-900/50 dark:text-teal-400"
                      : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-zinc-950 dark:border-zinc-800/80 dark:text-zinc-400"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="hidden"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image URL Inputs & AI Vision Analyzers */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
              IMAGE URLS & AI VISION INSPECTION
            </label>
            <div>
              <input
                type="url"
                placeholder="Image URL 1"
                value={image1}
                onChange={(e) => setImage1(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
              {image1 && (
                <ImageAnalyzer
                  imageUrl={image1}
                  propertyLocation={location}
                  onAddDetectedAmenities={(amenity) => handleAmenityChange(amenity)}
                />
              )}
            </div>

            <div>
              <input
                type="url"
                placeholder="Image URL 2 (Optional)"
                value={image2}
                onChange={(e) => setImage2(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
              {image2 && (
                <ImageAnalyzer
                  imageUrl={image2}
                  propertyLocation={location}
                  onAddDetectedAmenities={(amenity) => handleAmenityChange(amenity)}
                />
              )}
            </div>

            <div>
              <input
                type="url"
                placeholder="Image URL 3 (Optional)"
                value={image3}
                onChange={(e) => setImage3(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
              />
              {image3 && (
                <ImageAnalyzer
                  imageUrl={image3}
                  propertyLocation={location}
                  onAddDetectedAmenities={(amenity) => handleAmenityChange(amenity)}
                />
              )}
            </div>
          </div>

          {/* Extra Features */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">
              EXTRA FEATURES NOTES
            </label>
            <input
              type="text"
              placeholder="e.g. Near bus stop, pet friendly deposit details..."
              value={extraFeatures}
              onChange={(e) => setExtraFeatures(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl font-extrabold text-sm sm:text-base transition-all duration-200 text-center cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-1" />
                <span>Submitting Listing...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Submit Property for Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
