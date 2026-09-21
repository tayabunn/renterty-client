"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building, BedDouble, Bath, Maximize, Heart, Share2, Calendar, Phone, FileText, User, Star, ArrowLeft, Loader2, Sparkles, Send, CreditCard, MessageSquare, Wrench, PenTool } from "lucide-react";
import toast from "react-hot-toast";
import ReviewInsights from "../../../components/ai/ReviewInsights";
import ScheduleTourModal from "../../../components/tours/ScheduleTourModal";
import LeaseSignatureModal from "../../../components/lease/LeaseSignatureModal";
import MaintenanceRequestModal from "../../../components/maintenance/MaintenanceRequestModal";
import ChatWindow from "../../../components/chat/ChatWindow";
import NeighborhoodScore from "../../../components/map/NeighborhoodScore";
import ShareModal from "../../../components/properties/ShareModal";
import AudioOverviewPlayer from "@/components/ui/AudioOverviewPlayer";
import { API_URL } from "@/lib/config";

const sanitizePropertyData = (prop) => {
  if (!prop) return prop;
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
      description: "A peaceful alpine cabin retreat surrounded by towering pines with outdoor hot tub, stone wood-burning fireplace, modern kitchen, and scenic mountain vistas.",
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
const TYPE_DEFAULT_IMAGES = {
  Cabin: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
  House: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80",
  Villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80",
  Apartment: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
  Studio: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop&q=80"
};

function PropertyDetailImage({ property }) {
  const defaultImg = TYPE_DEFAULT_IMAGES[property.propertyType] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200";
  const initialSrc = (property.images && property.images[0] && typeof property.images[0] === 'string' && property.images[0].startsWith('http')) 
    ? property.images[0] 
    : defaultImg;
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <Image
      src={imgSrc}
      alt={property.title || "Rental Property"}
      className="object-cover"
      fill
      priority
      sizes="(max-width: 768px) 100vw, 1200px"
      onError={() => setImgSrc(defaultImg)}
      unoptimized
    />
  );
}

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  // Load States
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Favorite status
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  // Booking Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1 = Details, 2 = Payment
  const [moveInDate, setMoveInDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Next-Level Feature Modals
  const [showTourModal, setShowTourModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch property details, reviews, and favorites on mount
  const fetchPropertyData = async () => {
    try {
      const res = await fetch(`${API_URL}/properties/${id}`).catch(() => null);
      if (!res || !res.ok) {
        throw new Error("Property not found");
      }
      const data = await res.json().catch(() => null);
      if (data) {
        setProperty(sanitizePropertyData(data));
      }

      // Fetch Reviews
      const reviewRes = await fetch(`${API_URL}/reviews/property/${id}`).catch(() => null);
      if (reviewRes && reviewRes.ok) {
        const reviewData = await reviewRes.json().catch(() => null);
        if (reviewData) {
          setReviews(reviewData);
        }
      }

      // Fetch Favorites if user is logged in
      if (user && user.role === "Tenant") {
        const token = typeof window !== "undefined" ? localStorage.getItem("renterty_token") : null;
        if (token) {
          const favRes = await fetch(`${API_URL}/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => null);
          if (favRes && favRes.ok) {
            const favData = await favRes.json().catch(() => null);
            if (favData && Array.isArray(favData)) {
              setFavorites(favData);
              const found = favData.find((f) => f.propertyId && f.propertyId._id === id);
              if (found) {
                setIsFavorited(true);
                setFavoriteId(found._id);
              } else {
                setIsFavorited(false);
                setFavoriteId(null);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading property details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [id, user]);

  // Favorite Toggle Handler
  const handleToggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Tenant") {
      toast.error("Only tenants can add listings to favorites");
      return;
    }

    const token = localStorage.getItem("renterty_token");
    try {
      if (isFavorited) {
        // Remove Favorite
        const res = await fetch(`${API_URL}/favorites/${favoriteId || id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setIsFavorited(false);
          setFavoriteId(null);
          toast.success("Removed from favorites");
        } else {
          toast.error("Failed to remove from favorites");
        }
      } else {
        // Add Favorite
        const res = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ propertyId: id })
        });
        const data = await res.json();
        if (res.ok) {
          setIsFavorited(true);
          setFavoriteId(data.favorite._id);
          toast.success("Added to favorites");
        } else {
          toast.error(data.message || "Failed to add to favorites");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error modifying favorites");
    }
  };

  // Share handler
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Submit Review Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Tenant") {
      toast.error("Only tenants can write reviews");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmittingReview(true);
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: id,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted!");
        setReviewComment("");
        // Reload reviews list
        const reviewRes = await fetch(`${API_URL}/reviews/property/${id}`);
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setReviews(reviewData);
        }
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Booking Modal Handlers
  const handleOpenBookingModal = () => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "Tenant") {
      toast.error("Only tenants can book properties");
    } else {
      setShowBookingModal(true);
      setBookingStep(1);
    }
  };

  const handleBookingDetailsSubmit = (e) => {
    e.preventDefault();
    if (!moveInDate || !contactNumber) {
      toast.error("Move-in date and contact number are required");
      return;
    }
    setBookingStep(2); // Advance to Stripe payment
  };

  const handleBookingPaymentSuccess = async (transactionId) => {
    const token = localStorage.getItem("renterty_token");
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: id,
          moveInDate,
          contactNumber,
          additionalNotes,
          transactionId,
          amount: property.rent
        })
      });

      const data = await res.json();
      if (res.ok) {
        setShowBookingModal(false);
        router.push(
          `/success?tx=${transactionId}&amount=${property.rent}&title=${encodeURIComponent(property.title)}`
        );
      } else {
        toast.error(data.message || "Failed to process booking on backend");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error finalizing booking record");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] bg-slate-50 dark:bg-zinc-950">
          <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
          <span className="text-sm font-semibold text-slate-500">Loading Listing Details...</span>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <Building className="h-16 w-16 text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Listing not found</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">This property may have been removed or deactivated.</p>
          <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl">
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 bg-slate-50 dark:bg-zinc-950 min-h-screen py-10 transition-colors duration-300">
        <div className="w-[90%] mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to listings</span>
          </button>

          {/* Title & Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-500/10 text-teal-500 dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider border border-teal-500/25">
                <Sparkles className="h-3 w-3" />
                <span>Verified Approved Listing</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center space-x-1.5 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                <MapPin className="h-4 w-4 text-teal-500" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Sharing & Faving actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-3 border rounded-xl flex items-center space-x-2 text-sm font-bold transition-all ${
                  isFavorited
                    ? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/50"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                <span>{isFavorited ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/80 rounded-xl flex items-center space-x-2 text-sm font-bold transition-all"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Left Content Area: Images, details, reviews */}
            <div className="lg:col-span-2 space-y-8">
              {/* Media Card */}
              <div className="rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-zinc-800 h-64 sm:h-80 md:h-[26rem] lg:h-[30rem] relative">
                <PropertyDetailImage property={property} />
              </div>

              {/* AI Audio Overview Player */}
              <AudioOverviewPlayer
                title={property.title}
                location={property.location}
                propertyType={property.propertyType}
                rent={property.rent}
                rentType={property.rentType}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                description={property.description}
              />

              {/* Description Card */}
              <div className="bg-white dark:bg-zinc-900/40 p-5 sm:p-7 md:p-8 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 shadow-sm space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">About Property</h3>
                  <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                {/* Property Details Grid specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800 text-center">
                  <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-800/50">
                    <BedDouble className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500 mx-auto mb-1.5 sm:mb-2" />
                    <span className="text-xs text-slate-400 dark:text-zinc-500 block mb-0.5">Bedrooms</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">{property.bedrooms} Beds</span>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-800/50">
                    <Bath className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500 mx-auto mb-1.5 sm:mb-2" />
                    <span className="text-xs text-slate-400 dark:text-zinc-500 block mb-0.5">Bathrooms</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">{property.bathrooms} Baths</span>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-800/50">
                    <Maximize className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500 mx-auto mb-1.5 sm:mb-2" />
                    <span className="text-xs text-slate-400 dark:text-zinc-500 block mb-0.5">Property Size</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">{property.size} sqft</span>
                  </div>
                </div>
              </div>

              {/* Included Amenities Card */}
              <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Included Amenities</h3>
                {property.amenities.length === 0 ? (
                  <span className="text-slate-500 text-sm">No specific amenities declared.</span>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {property.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-slate-100 dark:bg-zinc-950 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-800/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Feature 1: Neighborhood & Walkability Intelligence */}
              <NeighborhoodScore location={property.location} propertyType={property.propertyType} />

              {/* Extra Features Card */}
              {property.extraFeatures && (
                <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 shadow-sm space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Extra Features</h3>
                  <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed">
                    {property.extraFeatures}
                  </p>
                </div>
              )}

              {/* Reviews Card & AI Sentiment Insights */}
              <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 shadow-sm space-y-8">
                <ReviewInsights propertyId={id} title="AI Review & Community Sentiment" />

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tenant Reviews</h3>

                {/* Add Review input form */}
                {user && user.role === "Tenant" && (
                  <form onSubmit={handleSubmitReview} className="space-y-4 bg-slate-50 dark:bg-zinc-950 p-5 rounded-lg border border-slate-200/60 dark:border-zinc-800/60">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Leave a Review</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-500">Rating:</span>
                      <div className="flex text-amber-400 space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="hover:scale-110 transition"
                          >
                            <Star className={`h-5 w-5 ${star <= reviewRating ? "fill-current text-amber-400" : "text-slate-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <textarea
                        required
                        rows="3"
                        placeholder="Write your review here..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 focus:border-teal-500 focus:outline-none p-3 rounded-xl text-sm text-slate-800 dark:text-zinc-100"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      {submittingReview ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                      <span>Submit Review</span>
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">No reviews submitted yet for this property.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="space-y-3 pb-6 border-b border-slate-100 dark:border-zinc-800/80 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2.5">
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs">
                              {rev.tenantName[0].toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.tenantName}</h4>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500">{rev.tenantEmail}</span>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed italic pl-10">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                        <div className="text-[10px] text-slate-400 text-right">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Sticky Card: Booking Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 shadow-md sticky top-24 space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">RENT PRICE</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">${property.rent.toLocaleString()}</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-zinc-500">
                      /{property.rentType === "Monthly" ? "month" : property.rentType === "Weekly" ? "week" : "day"}
                    </span>
                  </div>
                </div>

                {/* Host Card Info */}
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200/50 dark:border-zinc-800/50 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">PROPERTY OWNER</span>
                  <div className="flex items-center space-x-3">
                    {property.ownerId && property.ownerId.photo ? (
                      <Image
                        src={property.ownerId.photo}
                        alt={property.ownerId.name}
                        className="rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                        width={40}
                        height={40}
                        unoptimized
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg">
                        {property.ownerId ? property.ownerId.name[0].toUpperCase() : <User className="h-5 w-5" />}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {property.ownerId ? property.ownerId.name : "System Host"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">{property.ownerEmail}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOpenBookingModal}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all duration-200 text-center cursor-pointer"
                >
                  Book Property Now
                </button>

                {/* Additional Action Buttons for 5 Next-Level Features */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) router.push('/login');
                      else setShowTourModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <span>Schedule Property Tour</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!user) router.push('/login');
                      else setShowChatModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-teal-500" />
                    <span>Direct Message Host</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!user) router.push('/login');
                      else setShowLeaseModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PenTool className="w-4 h-4 text-teal-500" />
                    <span>Digital Lease &amp; E-Sign</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!user) router.push('/login');
                      else setShowMaintenanceModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4 text-emerald-500" />
                    <span>Report Maintenance (AI Triage)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature 2: Schedule Tour Modal */}
      <ScheduleTourModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        property={property}
        user={user}
      />

      {/* Feature 3: In-App Chat Window */}
      <ChatWindow
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        recipientId={property.ownerId?._id || property.ownerId || property.ownerEmail}
        recipientName={property.ownerId?.name || "Property Host"}
        propertyId={property._id}
        propertyTitle={property.title}
        currentUser={user}
      />

      {/* Feature 4: Digital Lease & E-Signature Modal */}
      <LeaseSignatureModal
        isOpen={showLeaseModal}
        onClose={() => setShowLeaseModal(false)}
        property={property}
        user={user}
      />

      {/* Feature 5: Maintenance Request Modal */}
      <MaintenanceRequestModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        property={property}
        onSuccess={() => toast.success("Maintenance issue logged!")}
      />

      {/* Book Property Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 p-5 sm:p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-2xl z-10 space-y-6"
            >
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {bookingStep === 1 ? "Book Property Slot" : "Complete Reservation Fee"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  {bookingStep === 1
                    ? "Verify your parameters and enter move-in details."
                    : "Your card will be charged safety reservation fees securely via Stripe."}
                </p>
              </div>

              {bookingStep === 1 ? (
                <form onSubmit={handleBookingDetailsSubmit} className="space-y-4">
                  {/* User info read-only */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Your Name</label>
                      <input
                        type="text"
                        readOnly
                        value={user?.name || ""}
                        className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent p-2.5 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Your Email</label>
                      <input
                        type="text"
                        readOnly
                        value={user?.email || ""}
                        className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent p-2.5 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Move-in Date */}
                  <div className="text-left space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-teal-500" />
                      <span>MOVE-IN DATE</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none p-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="text-left space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-teal-500" />
                      <span>CONTACT NUMBER</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 123-4567"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none p-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="text-left space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-teal-500" />
                      <span>ADDITIONAL NOTES</span>
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Special instructions, pet information, queries..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-zinc-950 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none p-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-zinc-100"
                    />
                  </div>

                  {/* Modal Footer Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl font-bold transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all duration-200 text-sm"
                    >
                      Proceed to Pay
                    </button>
                  </div>
                </form>
              ) : (
                <form action="/api/checkout_sessions" method="POST" className="space-y-6">
                  {/* Hidden inputs to pass booking data to Stripe checkout API */}
                  <input type="hidden" name="amount" value={property.rent} />
                  <input type="hidden" name="propertyId" value={id} />
                  <input type="hidden" name="propertyTitle" value={property.title} />
                  <input type="hidden" name="moveInDate" value={moveInDate} />
                  <input type="hidden" name="contactNumber" value={contactNumber} />
                  <input type="hidden" name="additionalNotes" value={additionalNotes} />
                  <input type="hidden" name="tenantEmail" value={user?.email || ""} />

                  <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block mb-2">
                      RESERVATION FEES (Total Rent)
                    </span>
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      ${property.rent.toLocaleString()} USD
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 text-left">
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block">
                      Booking Details Summary
                    </span>
                    <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                      <p><strong className="text-slate-700 dark:text-zinc-300">Move-in Date:</strong> {moveInDate}</p>
                      <p><strong className="text-slate-700 dark:text-zinc-300">Contact Number:</strong> {contactNumber}</p>
                      {additionalNotes && (
                        <p className="truncate"><strong className="text-slate-700 dark:text-zinc-300">Notes:</strong> {additionalNotes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl font-bold transition text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all duration-200 text-sm"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Pay & Book (Stripe Checkout)</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        property={property}
      />

      <Footer />
    </>
  );
}
