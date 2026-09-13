"use client";

import React, { useState } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import PropertyDescriptionGenerator from "../ai/PropertyDescriptionGenerator";
import ImageAnalyzer from "../ai/ImageAnalyzer";
import RentEstimator from "../ai/RentEstimator";
import { API_URL } from "@/lib/config";

export default function AddProperty() {
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
        toast.success("Listing submitted for Admin approval!");
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
    <div className="w-full flex justify-start ml-13">
      <div className="max-w-5xl w-full bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 p-8 sm:p-10 rounded-3xl shadow-sm text-left">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2.5 bg-teal-500/10 text-teal-500 rounded-2xl">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Property Listing</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5">Submit property details. It will go under admin verification before public viewing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Property Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
              <option value="Cabin">Cabin</option>
            </select>
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
            <select
              value={rentType}
              onChange={(e) => setRentType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-teal-500 focus:bg-white focus:outline-none p-3 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer select-none transition ${
                  amenities.includes(amenity)
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
          className="w-full flex items-center justify-center space-x-1.5 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 text-center"
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
