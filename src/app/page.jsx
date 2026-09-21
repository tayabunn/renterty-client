"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Search, MapPin, Building, DollarSign, BedDouble, Bath, Maximize, Star, ShieldCheck, CreditCard, Sparkles, Heart, Users, ArrowRight, ChevronDown, TrendingUp, CheckCircle2, Zap, Lock, Globe2 } from "lucide-react";
import { BlurInText } from "@/components/ui/blur-in-text";
import { Marquee } from "@/components/ui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import { TypingAnimation } from "@/registry/magicui/typing-animation";
import VoiceSearchButton from "@/components/ui/VoiceSearchButton";

import { API_URL } from "@/lib/config";

const DEFAULT_REVIEWS = [
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
];

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

const FALLBACK_PROPERTIES = [
  {
    _id: "prop-1",
    title: "Modern Oceanview Luxury Villa",
    location: "Miami, FL",
    description: "Stunning waterfront property featuring private infinity pool, direct beach access, high-speed WiFi, and panoramic floor-to-ceiling ocean views.",
    propertyType: "Villa",
    rent: 4200,
    rentType: "Monthly",
    bedrooms: 4,
    bathrooms: 3,
    size: 2800,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80"]
  },
  {
    _id: "prop-2",
    title: "Secluded Mountain Ridge Cabin",
    location: "Aspen, CO",
    description: "A peaceful alpine cabin retreat surrounded by towering pines with hot tub, stone wood-burning fireplace, modern kitchen, and scenic mountain vistas.",
    propertyType: "Cabin",
    rent: 2850,
    rentType: "Monthly",
    bedrooms: 3,
    bathrooms: 2,
    size: 1750,
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80"]
  },
  {
    _id: "prop-3",
    title: "Skyline Penthouse with Rooftop Terrace",
    location: "New York, NY",
    description: "Ultra-sleek Manhattan penthouse offering 360-degree skyline views, chef-grade appliances, hardwood flooring, and 24/7 concierge security.",
    propertyType: "Apartment",
    rent: 5500,
    rentType: "Monthly",
    bedrooms: 3,
    bathrooms: 2.5,
    size: 2100,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80"]
  },
  {
    _id: "prop-4",
    title: "Contemporary Minimalist Townhome",
    location: "Austin, TX",
    description: "Bright open-concept townhome in central Austin with private courtyard, solar energy, dedicated EV charger, and smart home automation.",
    propertyType: "House",
    rent: 2400,
    rentType: "Monthly",
    bedrooms: 3,
    bathrooms: 2,
    size: 1850,
    images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80"]
  },
  {
    _id: "prop-5",
    title: "Coastal Sunset Beach House",
    location: "Malibu, CA",
    description: "Direct beachfront access with spacious sunset viewing deck, modern kitchen with quartz countertops, and serene oceanfront bedrooms.",
    propertyType: "House",
    rent: 6200,
    rentType: "Monthly",
    bedrooms: 4,
    bathrooms: 3,
    size: 2600,
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop&q=80"]
  },
  {
    _id: "prop-6",
    title: "Downtown Artist Studio Loft",
    location: "Chicago, IL",
    description: "Historic loft with exposed brick walls, 14-foot timber ceilings, oversized industrial windows, and close proximity to galleries.",
    propertyType: "Studio",
    rent: 1750,
    rentType: "Monthly",
    bedrooms: 1,
    bathrooms: 1,
    size: 950,
    images: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop&q=80"]
  },
  {
    _id: "prop-7",
    title: "Tropical Palms Garden Residence",
    location: "Honolulu, HI",
    description: "Tranquil Hawaiian residence with lush landscaped gardens, covered lanai patio, ocean breezes, and walking distance to the beach.",
    propertyType: "House",
    rent: 3900,
    rentType: "Monthly",
    bedrooms: 3,
    bathrooms: 2,
    size: 1900,
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80"]
  },
  {
    _id: "prop-8",
    title: "Nordic Lakefront Chalet",
    location: "Seattle, WA",
    description: "Scenic lakeside retreat with private cedar dock, sauna, floor-to-ceiling lake views, and warm Scandinavian interior design.",
    propertyType: "Cabin",
    rent: 3200,
    rentType: "Monthly",
    bedrooms: 3,
    bathrooms: 2,
    size: 1650,
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80"]
  }
];

function PropertyCardImage({ property }) {
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
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      onError={() => setImgSrc(defaultImg)}
    />
  );
}

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
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);

  // Fetch featured properties on mount with graceful error fallback
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const propRes = await fetch(`${API_URL}/properties/featured`).catch(() => null);
        if (propRes && propRes.ok) {
          const data = await propRes.json().catch(() => null);
          if (isMounted && data) {
            const rawProps = Array.isArray(data) ? data : (data.properties || []);
            if (rawProps.length > 0) {
              setFeatured(rawProps.map(sanitizePropertyData));
              return;
            }
          }
        }
        if (isMounted) {
          setFeatured(FALLBACK_PROPERTIES);
        }
      } catch {
        if (isMounted) {
          setFeatured(FALLBACK_PROPERTIES);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
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

      <main id="main-content" className="flex-1">
        {/* Hero Banner Section Wrapper */}
        <div className="relative w-[90%] mx-auto pt-4 sm:pt-6 pb-6 sm:pb-10 md:pb-12">
          {/* Rounded Hero Card (acts as background container) */}
          <div className="relative w-full min-h-[50vh] sm:min-h-[58vh] flex items-center justify-center rounded-lg overflow-hidden shadow-2xl bg-linear-to-t from-slate-950 to-slate-800/50">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&auto=format&fit=crop&q=80"
                alt="Renterty Hero"
                className="object-cover opacity-45 dark:opacity-25"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/50 to-slate-950" />
            </div>

            {/* Hero Content (Centered) */}
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 px-3.5 sm:px-6 py-10 sm:py-16 md:py-20">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-3 sm:space-y-4"
              >
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-teal-500/25 backdrop-blur-xs">
                  <Sparkles className="h-3 w-3 animate-spin text-teal-400" />
                  <span>PREMIUM HOME RENTAL MARKETPLACE</span>
                </span>
                <h1 className="scroll-m-20 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Find Your Next
                  <br />
                  <span className="text-teal-400">
                    <TypingAnimation
                      words={["Dream Living Space", "Perfect Rental Home", "Cozy Smart Apartment"]}
                      loop
                    />
                  </span>
                </h1>
                <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-slate-200 dark:text-zinc-300 font-medium leading-relaxed">
                  Renterty connects property owners and tenants through a secure, transparent, and beautiful portal. Browse vetted rentals, secure booking slots, and pay reservation fees online
                </p>
              </motion.div>
            </div>
          </div>

          {/* Search Bar Panel - Responsive: flows naturally below card on mobile, overlaps on desktop */}
          <div className="relative md:absolute bottom-auto md:-bottom-3 left-0 md:left-1/2 md:-translate-x-1/2 w-full max-w-5xl px-0 md:px-8 z-20 mt-4 md:mt-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-2xl shadow-slate-950/20 border border-white/10 dark:border-zinc-800/10"
            >
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 items-end">
                {/* Location */}
                <div className="text-left space-y-1.5 sm:space-y-2 col-span-1 sm:col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      <span>LOCATION</span>
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="e.g. New York, Miami"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none pl-3.5 pr-10 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <VoiceSearchButton
                        size="sm"
                        onResult={(transcript) => {
                          setSearchLocation(transcript);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div className="text-left space-y-1.5 sm:space-y-2 col-span-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                    <Building className="h-3.5 w-3.5 text-teal-500" />
                    <span>TYPE</span>
                  </label>
                  <div className="relative">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-2.5 sm:py-3 pr-10 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="All" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">All Types</option>
                      <option value="Apartment" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Apartment</option>
                      <option value="House" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">House</option>
                      <option value="Villa" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Villa</option>
                      <option value="Studio" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Studio</option>
                      <option value="Cabin" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Cabin</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Min Price */}
                <div className="text-left space-y-1.5 sm:space-y-2 col-span-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                    <DollarSign className="h-3.5 w-3.5 text-teal-500" />
                    <span>MIN PRICE</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Min ($)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
                  />
                </div>

                {/* Max Price */}
                <div className="text-left space-y-1.5 sm:space-y-2 col-span-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center space-x-1.5 uppercase tracking-wider">
                    <DollarSign className="h-3.5 w-3.5 text-teal-500" />
                    <span>MAX PRICE</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Max ($)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-750 focus:outline-none px-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 transition-all duration-200"
                  />
                </div>

                {/* Search Button */}
                <div className="flex items-end col-span-1 sm:col-span-2 md:col-span-1">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all duration-200 cursor-pointer h-[42px] sm:h-[46px] text-xs sm:text-sm"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Featured Properties Section */}
        <div className="relative w-[90%] pt-8 sm:pt-12 md:pt-20 pb-10 sm:pb-14 md:pb-16 mx-auto overflow-hidden">
          <div className="relative z-10">
            <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-10 md:mb-12">
              <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
                <BlurInText
                  text="Featured Rental Properties"
                  blurAmount={10}
                  duration={1.2}
                  stagger={0.06}
                  split="letter"
                  trigger="inView"
                />
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 max-w-full mx-auto text-base font-medium">
                Explore our curated selection of verified, highly-rated rental properties available for instant reservation
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-zinc-900 rounded-lg h-[450px] border border-slate-200 dark:border-zinc-800"></div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {featured.slice(0, 8).map((property) => (
                  <motion.div
                    key={property._id}
                    variants={itemVariants}
                    className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative transition-all duration-300 flex flex-col justify-between h-full text-left"
                  >
                    {/* Image Wrap */}
                    <div className="relative h-52 overflow-hidden">
                      <PropertyCardImage property={property} />
                      <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                        {property.propertyType}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-lg font-bold shadow-sm">
                        ${property.rent.toLocaleString()}
                        <span className="text-xs font-normal">/{property.rentType === "Monthly" ? "mo" : property.rentType === "Weekly" ? "wk" : "day"}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center space-x-1.5 text-slate-500 dark:text-zinc-400 text-xs font-semibold">
                          <MapPin className="h-3.5 w-3.5 text-teal-500" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                          {property.title}
                        </h3>
                        <p className="text-slate-500 dark:text-zinc-400 text-base leading-relaxed line-clamp-2">
                          {property.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3.5">
                        {/* Specs info */}
                        <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-zinc-400">
                          <span className="flex items-center space-x-1">
                            <BedDouble className="h-3.5 w-3.5 text-teal-500" />
                            <span>{property.bedrooms} Beds</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Bath className="h-3.5 w-3.5 text-teal-500" />
                            <span>{property.bathrooms} Baths</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Maximize className="h-3.5 w-3.5 text-teal-500" />
                            <span>{property.size} sqft</span>
                          </span>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleViewDetails(property._id)}
                          className="w-full py-2.5 bg-slate-900 hover:bg-teal-500 dark:bg-zinc-800 dark:hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Explore More Button */}
            <div className="text-center mt-10 sm:mt-12">
              <Link
                href="/properties"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl font-bold text-sm sm:text-base hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Explore More</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="relative w-[90%] max-w-7xl py-10 sm:py-16 md:py-24 mx-auto">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-linear-to-r from-teal-500/15 via-emerald-500/15 to-teal-500/15 text-teal-700 dark:text-teal-300 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-teal-500/30 shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                </span>
                <span>Trust & Transparency</span>
              </div>

              <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white first:mt-0">
                <BlurInText
                  text="Why Book With Renterty"
                  blurAmount={10}
                  duration={1.2}
                  stagger={0.06}
                  split="letter"
                  trigger="inView"
                />
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 max-w-full mx-auto text-base font-medium">
                We make renting homes secure, transparent, and pleasant for both renters and property managers
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, staggerChildren: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
            >
              {/* Card 1: Verified Properties */}
              <div className="group relative p-5 sm:p-7 md:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden">
                {/* Corner Ambient Glow Orb */}
                <div className="absolute -right-8 -top-8 size-32 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                {/* MagicUI Border Beam on Hover */}
                <BorderBeam
                  size={240}
                  duration={10}
                  delay={0}
                  borderWidth={2}
                  colorFrom="#14b8a6"
                  colorTo="#10b981"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <div className="space-y-4 sm:space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="size-12 sm:size-14 text-white rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-xl sm:text-2xl shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 dark:text-zinc-700 tracking-widest uppercase">
                      01
                    </span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Verified Properties
                    </h3>
                    <p className="text-base text-slate-500 dark:text-zinc-400 leading-relaxed">
                      All property listings undergo administrative review and moderation. No spam, no scams, just legitimate and gorgeous spaces.
                    </p>
                  </div>
                </div>

                {/* Interactive micro pill badge */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 rounded-full px-3.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    <span>Admin Moderated & Vetted</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Secure Payments */}
              <div className="group relative p-5 sm:p-7 md:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden">
                {/* Corner Ambient Glow Orb */}
                <div className="absolute -right-8 -top-8 size-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                {/* MagicUI Border Beam on Hover */}
                <BorderBeam
                  size={240}
                  duration={10}
                  delay={2.5}
                  borderWidth={2}
                  colorFrom="#14b8a6"
                  colorTo="#10b981"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <div className="space-y-4 sm:space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="size-12 sm:size-14 text-white rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl sm:text-2xl shadow-md shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 dark:text-zinc-700 tracking-widest uppercase">
                      02
                    </span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Secure Payments
                    </h3>
                    <p className="text-base text-slate-500 dark:text-zinc-400 leading-relaxed">
                      Pay reservation booking fees safely using Stripe. Transactions are encrypted, keeping your money secure until approvals.
                    </p>
                  </div>
                </div>

                {/* Interactive micro pill badge */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Stripe PCI-DSS Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Transparent Reviews */}
              <div className="group relative p-5 sm:p-7 md:p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden">
                {/* Corner Ambient Glow Orb */}
                <div className="absolute -right-8 -top-8 size-32 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                {/* MagicUI Border Beam on Hover */}
                <BorderBeam
                  size={240}
                  duration={10}
                  delay={5}
                  borderWidth={2}
                  colorFrom="#14b8a6"
                  colorTo="#10b981"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <div className="space-y-4 sm:space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="size-12 sm:size-14 text-white rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-xl sm:text-2xl shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Star className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 dark:text-zinc-700 tracking-widest uppercase">
                      03
                    </span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Transparent Reviews
                    </h3>
                    <p className="text-base text-slate-500 dark:text-zinc-400 leading-relaxed">
                      Honest ratings and reviews from real tenants. Gain insights into properties, hosts, and neighborhoods before signing.
                    </p>
                  </div>
                </div>

                {/* Interactive micro pill badge */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 rounded-full px-3.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    <span>100% Genuine Tenant Feedback</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <div className="relative w-full py-12 md:py-16 overflow-hidden">
          <div className="relative z-10">
            <div className="text-center space-y-3 mb-10 md:mb-12 px-4">
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
              <p className="text-slate-500 dark:text-zinc-400 max-w-full mx-auto text-base font-medium">
                Hear from tenants who found their perfect homes and apartments on Renterty
              </p>
            </div>

            <div
              className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
              }}
            >
              <Marquee pauseOnHover className="[--duration:40s]">
                {reviews.slice(0, Math.ceil(reviews.length / 2)).map((review, idx) => (
                  <figure
                    key={idx}
                    className={cn(
                      "relative h-full w-80 cursor-pointer overflow-hidden rounded-lg border p-4 transition-all duration-300 text-left",
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
                      "relative h-full w-80 cursor-pointer overflow-hidden rounded-lg border p-4 transition-all duration-300 text-left",
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
            </div>
          </div>
        </div>

        {/* Extra Section 1: Top Locations */}
        <div className="relative w-[90%] py-12 md:py-16 mx-auto overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12">
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
                <p className="text-slate-500 dark:text-zinc-400 text-base max-w-full">
                  Browse our highest concentration of premium rentals in major metropolises and vacation escapes
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
                <div
                  key={idx}
                  onClick={() => {
                    router.push(`/properties?location=${city.name}`);
                  }}
                  className="group relative rounded-lg h-80 overflow-hidden cursor-pointer border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all duration-300"
                >
                  <Image
                    src={city.img}
                    alt={city.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Statistics Section */}
        <div className="relative w-[90%] max-w-[1600px] py-14 md:py-20 mx-auto px-1 sm:px-2">
          {/* Ambient Dynamic Background Glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

          <div className="relative z-10 space-y-10 md:space-y-14">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-linear-to-r from-teal-500/15 via-emerald-500/15 to-teal-500/15 text-teal-700 dark:text-teal-300 rounded-full text-xs font-semibold uppercase tracking-wider border border-teal-500/30 shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                </span>
                <span>Platform Impact</span>
              </div>

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

              <p className="text-slate-500 dark:text-zinc-400 max-w-full mx-auto text-base font-medium">
                We're building the future of property rental. Here's a glance at our milestones and community trust
              </p>
            </div>

            {/* Dynamic Stats Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  value: "99%",
                  label: "Verification Rate",
                  desc: "Vetted property profiles & documents for absolute safety",
                  icon: ShieldCheck,
                  badge: "Zero-Fraud Audited",
                  badgeIcon: CheckCircle2,
                  progress: 99,
                  color: "from-teal-500 via-emerald-400 to-cyan-500",
                  iconBg: "from-teal-500 to-emerald-500",
                  glowColor: "rgba(20, 184, 166, 0.15)"
                },
                {
                  value: "1.2M+",
                  label: "Paid Reservations",
                  desc: "Secure transactions completed via Stripe integration",
                  icon: CreditCard,
                  badge: "Stripe Protected",
                  badgeIcon: Lock,
                  progress: 96,
                  color: "from-emerald-500 via-teal-400 to-cyan-400",
                  iconBg: "from-emerald-500 to-teal-500",
                  glowColor: "rgba(16, 185, 129, 0.15)"
                },
                {
                  value: "4,500+",
                  label: "Approved Properties",
                  desc: "Premium houses, apartments, and villas around the globe",
                  icon: Building,
                  badge: "50+ Global Cities",
                  badgeIcon: Globe2,
                  progress: 92,
                  color: "from-cyan-500 via-teal-400 to-emerald-400",
                  iconBg: "from-cyan-500 to-teal-500",
                  glowColor: "rgba(6, 182, 212, 0.15)"
                },
                {
                  value: "10K+",
                  label: "Satisfied Renters",
                  desc: "Happy tenants who found their dream living space",
                  icon: Users,
                  badge: "4.9★ Community Score",
                  badgeIcon: Star,
                  progress: 98,
                  color: "from-teal-400 via-emerald-500 to-teal-600",
                  iconBg: "from-teal-500 to-cyan-500",
                  glowColor: "rgba(20, 184, 166, 0.15)"
                }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                const BadgeIcon = stat.badgeIcon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 sm:p-7 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden text-left"
                  >
                    {/* MagicUI Border Beam on Hover */}
                    <BorderBeam
                      size={240}
                      duration={10}
                      delay={idx * 2.5}
                      borderWidth={2}
                      colorFrom="#14b8a6"
                      colorTo="#10b981"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {/* Radial Spotlight on Hover */}
                    <div
                      className="absolute -inset-px rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(600px circle at top left, ${stat.glowColor}, transparent 70%)`
                      }}
                    />

                    {/* Top Ambient Light Strip */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-teal-500/40 dark:via-teal-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="space-y-6 relative z-10">
                      {/* Header: Dynamic Icon + Live Micro-Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="relative">
                          <div className={`p-3.5 bg-linear-to-tr ${stat.iconBg} text-white rounded-2xl shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex items-center justify-center`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          {/* Glow halo */}
                          <div className={`absolute inset-0 bg-linear-to-tr ${stat.iconBg} rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10`} />
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-500/20 rounded-full text-[11px] font-bold tracking-tight">
                          <BadgeIcon className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                          <span>{stat.badge}</span>
                        </span>
                      </div>

                      {/* Metric Display */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-baseline justify-between">
                          <h3 className={`text-4xl sm:text-[42px] font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent tracking-tight leading-none group-hover:scale-[1.02] origin-left transition-transform duration-300`}>
                            {stat.value}
                          </h3>
                          <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <TrendingUp className="h-3 w-3" /> Live
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-800 dark:text-zinc-100 tracking-tight pt-1">
                          {stat.label}
                        </h4>

                        <p className="text-base text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                          {stat.desc}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Progress & Activity Track */}
                    <div className="pt-6 relative z-10 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        <span>Benchmark</span>
                        <span className="text-teal-600 dark:text-teal-400">{stat.progress}% Certified</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800/80 h-1.5 rounded-full overflow-hidden p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 + idx * 0.1 }}
                          className={`h-full rounded-full bg-linear-to-r ${stat.color} shadow-xs group-hover:brightness-110 transition-all`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Interactive Live Trust Banner Ribbon */}
            <div className="relative bg-linear-to-r from-teal-500/5 via-emerald-500/10 to-teal-500/5 dark:from-teal-950/30 dark:via-emerald-950/40 dark:to-teal-950/30 border border-teal-500/20 dark:border-teal-500/15 rounded-lg p-4 sm:p-5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-teal-500 text-white rounded-xl shadow-md shadow-teal-500/20 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    Real-Time Verified Infrastructure
                  </h5>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Every transaction and property on Renterty is backed by 256-bit encryption, instant leases, and identity screening
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                  <span>Instant Escrow</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 shadow-2xs">
                  <Lock className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Stripe Verified</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
                  <span>100% Host Audited</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
