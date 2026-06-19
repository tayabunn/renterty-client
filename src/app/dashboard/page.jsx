"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Import modular dashboard sub-components
import ProfileView from "../../components/dashboard/ProfileView";
import TenantBookings from "../../components/dashboard/TenantBookings";
import TenantFavorites from "../../components/dashboard/TenantFavorites";
import OwnerAnalytics from "../../components/dashboard/OwnerAnalytics";
import AddProperty from "../../components/dashboard/AddProperty";
import OwnerProperties from "../../components/dashboard/OwnerProperties";
import OwnerRequests from "../../components/dashboard/OwnerRequests";
import AdminUsers from "../../components/dashboard/AdminUsers";
import AdminProperties from "../../components/dashboard/AdminProperties";
import AdminBookings from "../../components/dashboard/AdminBookings";
import AdminTransactions from "../../components/dashboard/AdminTransactions";

import { motion } from "framer-motion";
import {
  User, ClipboardCheck, Heart, LayoutDashboard, Plus, Building, Calendar,
  Users, Landmark, BookOpen, Loader2, ArrowRight
} from "lucide-react";

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine initial tab based on search param or defaults
  const getInitialTab = (role) => {
    const paramTab = searchParams.get("tab");
    if (paramTab) return paramTab;

    if (role === "Admin") return "users";
    if (role === "Owner") return "analytics";
    return "bookings"; // Tenant default
  };

  const [activeTab, setActiveTab] = useState("");

  // Guard routing and loading
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setActiveTab(getInitialTab(user.role));
      }
    }
  }, [user, loading, router]);

  // Sync tab with URL queries
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.replace(`/dashboard?tab=${tabName}`, { scroll: false });
  };

  if (loading || !activeTab) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
        <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
          Loading your dashboard profile...
        </span>
      </div>
    );
  }

  // Sidebar Links based on role
  const getSidebarLinks = () => {
    if (user.role === "Admin") {
      return [
        { id: "users", name: "All Users", icon: Users },
        { id: "admin-properties", name: "All Properties", icon: Building },
        { id: "admin-bookings", name: "All Bookings", icon: BookOpen },
        { id: "transactions", name: "Transactions", icon: Landmark },
        { id: "profile", name: "My Profile", icon: User }
      ];
    }
    if (user.role === "Owner") {
      return [
        { id: "analytics", name: "Analytics Overview", icon: LayoutDashboard },
        { id: "add-property", name: "Add Property", icon: Plus },
        { id: "properties", name: "My Properties", icon: Building },
        { id: "requests", name: "Booking Requests", icon: Calendar },
        { id: "profile", name: "My Profile", icon: User }
      ];
    }
    // Tenant default
    return [
      { id: "bookings", name: "My Bookings", icon: ClipboardCheck },
      { id: "favorites", name: "Favorites", icon: Heart },
      { id: "profile", name: "My Profile", icon: User }
    ];
  };

  // Render view depending on active tab
  const renderActiveView = () => {
    switch (activeTab) {
      // Shared
      case "profile":
        return <ProfileView user={user} />;
      // Tenant
      case "bookings":
        return <TenantBookings />;
      case "favorites":
        return <TenantFavorites />;
      // Owner
      case "analytics":
        return <OwnerAnalytics />;
      case "add-property":
        return <AddProperty />;
      case "properties":
        return <OwnerProperties />;
      case "requests":
        return <OwnerRequests />;
      // Admin
      case "users":
        return <AdminUsers />;
      case "admin-properties":
        return <AdminProperties />;
      case "admin-bookings":
        return <AdminBookings />;
      case "transactions":
        return <AdminTransactions />;
      default:
        return <ProfileView user={user} />;
    }
  };

  const sidebarLinks = getSidebarLinks();

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[85vh] bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Sidebar Panel */}
      <div className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-b md:border-b-0 border-slate-200/80 dark:border-zinc-800/80 py-6 px-4 space-y-4">
        {/* User Bio Header */}
        <div className="flex items-center space-x-3 px-3 pb-4 border-b border-slate-100 dark:border-zinc-800/60">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-teal-505 text-white bg-teal-500 flex items-center justify-center font-bold">
              {user.name[0].toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{user.name}</h4>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider block w-fit">
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <ul className="space-y-1.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = activeTab === link.id;
            return (
              <li key={link.id}>
                <button
                  onClick={() => handleTabChange(link.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 text-left ${
                    active
                      ? "bg-slate-100 dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shadow-sm"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{link.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Dynamic Workspace Panel */}
      <div className="flex-1 p-6 sm:p-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="h-full"
        >
          {renderActiveView()}
        </motion.div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 dark:bg-zinc-950">
          <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
          <span className="text-sm font-semibold text-slate-500">Loading Dashboard Context...</span>
        </div>
      }>
        <DashboardContent />
      </Suspense>
      <Footer />
    </>
  );
}
