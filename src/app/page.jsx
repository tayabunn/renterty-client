"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Search, MapPin, Building, DollarSign, BedDouble, Bath, Maximize, Star, ShieldCheck, CreditCard, Sparkles, Heart, Users } from "lucide-react";
import { BlurInText } from "@/components/ui/blur-in-text";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { TypingAnimation } from "@/registry/magicui/typing-animation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Search States
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // DB States
  const [featured, setFeatured] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured properties and reviews on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/featured`);
        if (propRes.ok) {
          const data = await propRes.json();
          setFeatured(data);
        }

      
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Default reviews list
    setReviews([
      {
        name: "Sophia Martinez",
        username: "@sophia_m",
        body: "Beautiful downtown studio! It was extremely clean, right in the center of the city, and the booking process was entirely seamless.",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Liam Henderson",
        username: "@liam_h",
        body: "Absolutely spectacular villa. The pool and sunset views were breathtaking, and the owner was incredibly helpful throughout our stay.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Clara Johansson",
        username: "@clara_j",
        body: "Perfect mountain cabin getaway. The hot tub was amazing after a long day of hiking. Will definitely book this space again next season!",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Marcus Vance",
        username: "@marcus_v",
        body: "Wonderful family home. The yard was perfect for the kids and the neighborhood was so peaceful and welcoming. Highly recommended!",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Emma Watson",
        username: "@emma_w",
        body: "A gorgeous luxury penthouse in Miami. The booking check-in was simple, and the skyline views at night were just magical.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Ethan Wright",
        username: "@ethan_w",
        body: "Highly professional host and beautiful beachside cottage. Secured our reservation with Stripe and got instant confirmation.",
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Olivia Chen",
        username: "@olivia_c",
        body: "Super cozy loft. Very close to local transit and great coffee shops. Extremely tidy and accurate listing description.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Alexander Gray",
        username: "@alex_gray",
        body: "The easiest rental reservation platform I've used. Vetted listings gave me peace of mind, and the support was excellent.",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
      }
    ]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchLocation) query.append("location", searchLocation);
    if (searchType && searchType !== "All") query.append("propertyType", searchType);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    router.push(`/properties?${query.toString()}`);
  };

  const handleViewDetails = (propertyId) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/properties/${propertyId}`);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <>
      <Navbar />

      {/* Hero Banner Section Wrapper */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Rounded Hero Card (acts as background container) */}
        <div className="relative w-full min-h-[60vh] sm:min-h-[65vh] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl bg-linear-to-t from-slate-950 to-slate-800/50">
          {/* Background Image / Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&auto=format&fit=crop&q=80"
              alt="Renterty Hero"
              className="object-cover opacity-45 dark:opacity-25"
              fill
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/50 to-slate-950" />
          </div>

          {/* Hero Content (Centered) */}
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-teal-500/25 backdrop-blur-xs">
                <Sparkles className="h-3 w-3 animate-spin text-teal-400" />
                <span>PREMIUM HOME RENTAL MARKETPLACE</span>
              </span>
              <h1 className="scroll-m-20 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Find Your Next
                <br />
                <span className="text-teal-400">
                  <TypingAnimation
                    words={["Dream Living Space", "Perfect Rental Home", "Cozy Smart Apartment"]}
                    loop
                  />
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 dark:text-zinc-300 font-medium leading-relaxed">
                Renterty connects property owners and tenants through a secure, transparent, and beautiful portal. Browse vetted rentals, secure booking slots, and pay reservation fees online.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search Bar Panel - Responsive: flows naturally below card on mobile, overlaps on desktop */}
        <div className="relative md:absolute bottom-auto md:bottom-3 left-0 md:left-1/2 md:-translate-x-1/2 w-full max-w-5xl px-0 md:px-8 z-20 mt-6 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl shadow-slate-950/20 border border-white/10 dark:border-zinc-800/10"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Location */}
              <div className="text-left space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5 text-teal-500" />
                  <span>LOCATION</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
                />
              </div>

              {/* Property Type */}
              <div className="text-left space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                  <Building className="h-3.5 w-3.5 text-teal-500" />
                  <span>TYPE</span>
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
                >
                  <option value="All" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">All Types</option>
                  <option value="Apartment" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Apartment</option>
                  <option value="House" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">House</option>
                  <option value="Villa" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Villa</option>
                  <option value="Studio" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Studio</option>
                  <option value="Cabin" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Cabin</option>
                </select>
              </div>

              {/* Min Price */}
              <div className="text-left space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                  <DollarSign className="h-3.5 w-3.5 text-teal-500" />
                  <span>MIN PRICE</span>
                </label>
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
                />
              </div>

              {/* Max Price */}
              <div className="text-left space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                  <DollarSign className="h-3.5 w-3.5 text-teal-500" />
                  <span>MAX PRICE</span>
                </label>
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer h-[46px]"
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative z-10">
        <div className="text-center space-y-3 mb-16">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
            <BlurInText
              text="Featured Rental Properties"
              blurAmount={10}
              duration={1.2}
              stagger={0.06}
              split="letter"
              trigger="inView"
            />
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm font-medium">
            Explore our curated selection of verified, highly-rated rental properties available for instant reservation.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-zinc-900 rounded-3xl h-[450px] border border-slate-200 dark:border-zinc-800"></div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featured.map((property) => (
              <motion.div
                key={property._id}
                variants={itemVariants}
                className="group bg-white dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Wrap */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={property.images[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"}
                    alt={property.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    {property.propertyType}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-lg font-bold shadow-sm">
                    ${property.rent.toLocaleString()}
                    <span className="text-xs font-normal">/{property.rentType === "Monthly" ? "mo" : property.rentType === "Weekly" ? "wk" : "day"}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1.5 text-slate-500 dark:text-zinc-400 text-xs font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      <span>{property.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
                      {property.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                    {/* Specs info */}
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

                    {/* Action Button */}
                    <button
                      onClick={() => handleViewDetails(property._id)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-teal-500 dark:bg-zinc-800 dark:hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>

      {/* Why Choose Us Section */}
      <div className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative z-10">
          <div className="text-center space-y-3 mb-16">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
              <BlurInText
                text="Why Book With Renterty"
                blurAmount={10}
                duration={1.2}
                stagger={0.06}
                split="letter"
                trigger="inView"
              />
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm font-medium">
              We make renting homes secure, transparent, and pleasant for both renters and property managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4 shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-500 w-fit rounded-2xl">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verified Properties</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                All property listings undergo administrative review and moderation. No spam, no scams, just legitimate and gorgeous spaces.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4 shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-500 w-fit rounded-2xl">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Payments</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Pay reservation booking fees safely using Stripe. Transactions are encrypted, keeping your money secure until approvals.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4 shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-500 w-fit rounded-2xl">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Transparent Reviews</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Honest ratings and reviews from real tenants. Gain insights into properties, hosts, and neighborhoods before signing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative z-10">
        <div className="text-center space-y-3 mb-16">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
            <BlurInText
              text="Tenant Success Stories"
              blurAmount={10}
              duration={1.2}
              stagger={0.06}
              split="letter"
              trigger="inView"
            />
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm font-medium">
            Hear from tenants who found their perfect homes and apartments on Renterty.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover className="[--duration:40s]">
            {reviews.slice(0, Math.ceil(reviews.length / 2)).map((review, idx) => (
              <figure
                key={idx}
                className={cn(
                  "relative h-full w-72 cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all duration-300 text-left",
                  "border-slate-200/80 bg-white hover:bg-slate-50/80 hover:shadow-md",
                  "dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:bg-zinc-850/50"
                )}
              >
                <div className="flex flex-row items-center gap-3">
                  <Image
                    className="rounded-full object-cover animate-none"
                    width={36}
                    height={36}
                    alt={review.name}
                    src={review.img}
                    unoptimized
                  />
                  <div className="flex flex-col">
                    <figcaption className="text-sm font-bold text-slate-900 dark:text-white">
                      {review.name}
                    </figcaption>
                    <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">{review.username}</p>
                  </div>
                </div>
                <blockquote className="mt-3 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed italic">
                  &ldquo;{review.body}&rdquo;
                </blockquote>
              </figure>
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {reviews.slice(Math.ceil(reviews.length / 2)).map((review, idx) => (
              <figure
                key={idx}
                className={cn(
                  "relative h-full w-72 cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all duration-300 text-left",
                  "border-slate-200/80 bg-white hover:bg-slate-50/80 hover:shadow-md",
                  "dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:bg-zinc-850/50"
                )}
              >
                <div className="flex flex-row items-center gap-3">
                  <Image
                    className="rounded-full object-cover animate-none"
                    width={36}
                    height={36}
                    alt={review.name}
                    src={review.img}
                    unoptimized
                  />
                  <div className="flex flex-col">
                    <figcaption className="text-sm font-bold text-slate-900 dark:text-white">
                      {review.name}
                    </figcaption>
                    <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">{review.username}</p>
                  </div>
                </div>
                <blockquote className="mt-3 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed italic">
                  &ldquo;{review.body}&rdquo;
                </blockquote>
              </figure>
            ))}
          </Marquee>
          <div className="from-slate-50 dark:from-zinc-950 pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r"></div>
          <div className="from-slate-50 dark:from-zinc-950 pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l"></div>
        </div>
      </div>
    </div>

      {/* Extra Section 1: Top Locations */}
      <div className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-3">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
                <BlurInText
                  text="Top Rental Locations"
                  blurAmount={10}
                  duration={1.2}
                  stagger={0.06}
                  split="letter"
                  trigger="inView"
                />
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-md">
                Browse our highest concentration of premium rentals in major metropolises and vacation escapes.
              </p>
            </div>
            <Link
              href="/properties"
              className="mt-4 md:mt-0 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 flex items-center space-x-1"
            >
              <span>Explore All Cities &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "New York", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&auto=format&fit=crop&q=60", count: "12 Listings" },
              { name: "Miami", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop&q=60", count: "8 Listings" },
              { name: "Malibu", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&auto=format&fit=crop&q=60", count: "6 Listings" },
              { name: "Aspen", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&auto=format&fit=crop&q=60", count: "4 Listings" }
            ].map((city, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                onClick={() => {
                  router.push(`/properties?location=${city.name}`);
                }}
                className="group relative rounded-3xl h-80 overflow-hidden cursor-pointer shadow-md hover:shadow-2xl border border-slate-200/50 dark:border-zinc-800/50 hover:border-teal-500/50 dark:hover:border-teal-400/50 transition-all duration-300"
              >
                <Image
                  src={city.img}
                  alt={city.name}
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-left space-y-4">
                  <span className="w-fit px-3 py-1 bg-white/10 dark:bg-black/20 backdrop-blur-md text-white rounded-full text-xs font-semibold tracking-wide border border-white/20">
                    {city.count}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                      {city.name}
                    </h3>
                    <span className="inline-flex items-center text-xs font-semibold text-teal-400 group-hover:text-teal-300 transition-colors duration-200">
                      Explore listings
                      <span className="ml-1 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Statistics Section */}
      <div className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="relative z-10 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-teal-500/25 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" />
              <span>Platform Impact</span>
            </span>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
              <BlurInText
                text="Renterty by the Numbers"
                blurAmount={10}
                duration={1.2}
                stagger={0.06}
                split="letter"
                trigger="inView"
              />
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm font-medium">
              We're building the future of property rental. Here's a glance at our milestones and community trust.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: "99%",
                label: "Verification Rate",
                desc: "Vetted property profiles & documents for absolute safety.",
                icon: ShieldCheck,
                color: "from-teal-500 to-cyan-500"
              },
              {
                value: "1.2M+",
                label: "Paid Reservations",
                desc: "Secure transactions completed via Stripe integration.",
                icon: CreditCard,
                color: "from-teal-500 to-cyan-500"
              },
              {
                value: "4,500+",
                label: "Approved Properties",
                desc: "Premium houses, apartments, and villas around the globe.",
                icon: Building,
                color: "from-teal-500 to-cyan-500"
              },
              {
                value: "10K+",
                label: "Satisfied Renters",
                desc: "Happy tenants who found their dream living space.",
                icon: Users,
                color: "from-teal-500 to-cyan-500"
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 hover:border-teal-500/50 dark:hover:border-teal-400/50 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 dark:hover:shadow-teal-400/5 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
                >
                  {/* Subtle hover background highlight */}
                  <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="space-y-6 relative z-10">
                    {/* Header: Icon + Accent line */}
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="h-[2px] w-12 bg-linear-to-r from-teal-500 to-emerald-500 rounded-full opacity-60 group-hover:w-16 transition-all duration-300" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className={`text-4xl font-black bg-linear-to-r ${stat.color} bg-clip-text text-transparent tracking-tight`}>
                        {stat.value}
                      </h3>
                      <h4 className="text-base font-bold text-slate-800 dark:text-zinc-200 tracking-wide">
                        {stat.label}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
