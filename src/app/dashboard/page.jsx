"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";

// Modular dashboard components
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
import AdminOverview from "../../components/dashboard/AdminOverview";
import AdminAiHub from "../../components/dashboard/AdminAiHub";
import AdminSettings from "../../components/dashboard/AdminSettings";
import ToursView from "../../components/dashboard/ToursView";
import MaintenanceView from "../../components/dashboard/MaintenanceView";
import ChatList from "../../components/chat/ChatList";

import { motion, AnimatePresence } from "framer-motion";
import {
  User, ClipboardCheck, Heart, LayoutDashboard, Plus, Building, Building2, Calendar,
  Users, Landmark, BookOpen, Loader2, ArrowRight, Wrench, MessageSquare,
  LogOut, Bell, ShieldCheck, Sparkles, TrendingUp, DollarSign, Zap,
  CheckCheck, X, CheckCircle2, Clock, Bot, Sliders
} from "lucide-react";

function DashboardContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Notifications State
  const notifRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Determine initial tab based on search param or defaults
  const getInitialTab = (role) => {
    const paramTab = searchParams.get("tab");
    if (paramTab) return paramTab;

    if (role === "Admin") return "overview";
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

  // Role-tailored initial notifications
  useEffect(() => {
    if (!user) return;
    if (user.role === "Owner") {
      setNotifications([
        {
          id: 1,
          title: "New Tour Request",
          desc: "A tenant requested a live video tour for Miami Coastal Villa.",
          time: "10m ago",
          unread: true,
          tab: "tours",
          type: "tour"
        },
        {
          id: 2,
          title: "Booking Payment Received",
          desc: "New booking reservation fee of $2,400 received via Stripe.",
          time: "1h ago",
          unread: true,
          tab: "requests",
          type: "payment"
        },
        {
          id: 3,
          title: "Maintenance Ticket",
          desc: "New electrical repair ticket submitted for Unit 4B.",
          time: "4h ago",
          unread: false,
          tab: "maintenance",
          type: "maintenance"
        }
      ]);
    } else if (user.role === "Admin") {
      setNotifications([
        {
          id: 1,
          title: "Listing Awaiting Moderation",
          desc: "Modern Studio in Manhattan submitted for administrative review.",
          time: "5m ago",
          unread: true,
          tab: "admin-properties",
          type: "property"
        },
        {
          id: 2,
          title: "New User Registered",
          desc: "Jane Doe completed account verification & tenant onboarding.",
          time: "2h ago",
          unread: true,
          tab: "users",
          type: "user"
        },
        {
          id: 3,
          title: "Transaction Logged",
          desc: "$4,500 security escrow deposit processed.",
          time: "1d ago",
          unread: false,
          tab: "transactions",
          type: "payment"
        }
      ]);
    } else {
      // Tenant
      setNotifications([
        {
          id: 1,
          title: "Tour Confirmed",
          desc: "In-person tour for Manhattan Luxury Loft confirmed for tomorrow at 2:00 PM.",
          time: "15m ago",
          unread: true,
          tab: "tours",
          type: "tour"
        },
        {
          id: 2,
          title: "Payment Processed",
          desc: "Reservation fee of $1,200 successfully completed via Stripe.",
          time: "2h ago",
          unread: true,
          tab: "bookings",
          type: "payment"
        },
        {
          id: 3,
          title: "Maintenance Triaged",
          desc: "Plumbing issue #102 assigned to a licensed technician.",
          time: "1d ago",
          unread: false,
          tab: "maintenance",
          type: "maintenance"
        },
        {
          id: 4,
          title: "New Direct Message",
          desc: "Property manager sent check-in instructions.",
          time: "2d ago",
          unread: false,
          tab: "messages",
          type: "message"
        }
      ]);
    }
  }, [user]);

  // Click outside to close notification popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = (item) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
    if (item.tab) {
      handleTabChange(item.tab);
    }
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user || !activeTab) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] bg-slate-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
        <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
          Loading your dashboard...
        </span>
      </div>
    );
  }

  // Grouped Sidebar Categories based on role
  const getSidebarCategories = () => {
    if (user.role === "Admin") {
      return [
        {
          category: "EXECUTIVE & OVERVIEW",
          links: [
            { id: "overview", name: "Platform Overview", icon: LayoutDashboard },
            { id: "users", name: "All Users", icon: Users },
            { id: "admin-properties", name: "All Properties", icon: Building },
            { id: "add-property", name: "Add Property", icon: Plus },
          ]
        },
        {
          category: "OPERATIONS & AI",
          links: [
            { id: "admin-bookings", name: "All Bookings", icon: BookOpen },
            { id: "transactions", name: "Transactions", icon: Landmark },
            { id: "ai-hub", name: "AI Operations Hub", icon: Bot },
          ]
        },
        {
          category: "CONFIGURATION & ACCOUNT",
          links: [
            { id: "settings", name: "Platform Settings", icon: Sliders },
            { id: "messages", name: "Messages", icon: MessageSquare },
            { id: "profile", name: "My Profile", icon: User },
          ]
        }
      ];
    }

    if (user.role === "Owner") {
      return [
        {
          category: "OVERVIEW",
          links: [
            { id: "analytics", name: "Analytics", icon: LayoutDashboard },
            { id: "properties", name: "My Properties", icon: Building },
            { id: "add-property", name: "Add Property", icon: Plus },
          ]
        },
        {
          category: "MANAGEMENT",
          links: [
            { id: "requests", name: "Booking Requests", icon: Calendar },
            { id: "tours", name: "Property Tours", icon: Calendar },
            { id: "maintenance", name: "Maintenance Dispatch", icon: Wrench },
          ]
        },
        {
          category: "ACCOUNT",
          links: [
            { id: "messages", name: "Messages", icon: MessageSquare },
            { id: "profile", name: "My Profile", icon: User },
          ]
        }
      ];
    }

    // Tenant Default
    return [
      {
        category: "OVERVIEW",
        links: [
          { id: "bookings", name: "My Bookings", icon: ClipboardCheck },
          { id: "tours", name: "Scheduled Tours", icon: Calendar },
        ]
      },
      {
        category: "SERVICES",
        links: [
          { id: "maintenance", name: "Maintenance", icon: Wrench },
          { id: "messages", name: "Messages", icon: MessageSquare },
        ]
      },
      {
        category: "SAVED & PROFILE",
        links: [
          { id: "favorites", name: "Favorites", icon: Heart },
          { id: "profile", name: "My Profile", icon: User },
        ]
      }
    ];
  };

  // Render view depending on active tab
  const renderActiveView = () => {
    switch (activeTab) {
      // Shared
      case "profile":
        return <ProfileView user={user} />;
      case "messages":
        return <ChatList currentUser={user} />;
      case "tours":
        return <ToursView isOwner={user.role === "Owner"} />;
      case "maintenance":
        return <MaintenanceView isOwner={user.role === "Owner"} user={user} />;
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
      case "overview":
        return <AdminOverview onNavigateTab={handleTabChange} />;
      case "users":
        return <AdminUsers />;
      case "admin-properties":
        return <AdminProperties />;
      case "admin-bookings":
        return <AdminBookings />;
      case "transactions":
        return <AdminTransactions />;
      case "ai-hub":
        return <AdminAiHub />;
      case "settings":
        return <AdminSettings />;
      default:
        return <ProfileView user={user} />;
    }
  };

  const sidebarCategories = getSidebarCategories();

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen bg-slate-50/80 dark:bg-zinc-950 transition-colors duration-300">
      {/* Left Sidebar Layout Inspired by Reference Design */}
      <aside className="w-full lg:w-64 xl:w-72 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800/80 p-4 lg:p-6 flex flex-col justify-between shrink-0 z-30 lg:sticky lg:top-0 lg:h-screen">
        {/* Top Mini Brand / Quick Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/70 shrink-0">
          <Link
            href="/"
            className="flex items-center group cursor-pointer"
            title="Return to Renterty Homepage"
          >
            <Image
              src="/logo.png"
              alt="Renterty"
              width={115}
              height={28}
              className="h-6 w-auto object-contain dark:brightness-0 dark:invert transition-all group-hover:opacity-90"
              priority
            />
          </Link>

          <div className="flex items-center space-x-1">
            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative h-8 w-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-11 lg:left-full lg:right-auto lg:top-0 lg:ml-4 w-80 sm:w-88 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800 rounded-lg shadow-2xl z-50 overflow-hidden"
                  >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Notifications
                          </h4>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-[11px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline flex items-center space-x-1 cursor-pointer"
                              title="Mark all as read"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              <span>Mark read</span>
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            aria-label="Close"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Notification Items List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/50">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center px-4">
                            <div className="h-10 w-10 mx-auto rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-2">
                              <Bell className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                              No notifications
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                              You are all caught up!
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const getIcon = () => {
                              switch (notif.type) {
                                case "tour":
                                  return (
                                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                      <Calendar className="h-4 w-4" />
                                    </div>
                                  );
                                case "payment":
                                  return (
                                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                      <DollarSign className="h-4 w-4" />
                                    </div>
                                  );
                                case "maintenance":
                                  return (
                                    <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                      <Wrench className="h-4 w-4" />
                                    </div>
                                  );
                                case "message":
                                  return (
                                    <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                                      <MessageSquare className="h-4 w-4" />
                                    </div>
                                  );
                                case "property":
                                  return (
                                    <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                      <Building2 className="h-4 w-4" />
                                    </div>
                                  );
                                case "user":
                                  return (
                                    <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                      <User className="h-4 w-4" />
                                    </div>
                                  );
                                default:
                                  return (
                                    <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                      <Sparkles className="h-4 w-4" />
                                    </div>
                                  );
                              }
                            };

                            return (
                              <button
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`w-full text-left p-3.5 flex items-start space-x-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group relative ${
                                  notif.unread
                                    ? "bg-teal-50/30 dark:bg-teal-950/20"
                                    : ""
                                }`}
                              >
                                {getIcon()}
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="flex items-center justify-between">
                                    <p
                                      className={`text-xs truncate ${
                                        notif.unread
                                          ? "font-bold text-slate-900 dark:text-white"
                                          : "font-medium text-slate-700 dark:text-zinc-300"
                                      }`}
                                    >
                                      {notif.title}
                                    </p>
                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 whitespace-nowrap ml-2 flex items-center space-x-0.5">
                                      <Clock className="h-2.5 w-2.5 mr-0.5" />
                                      {notif.time}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                                    {notif.desc}
                                  </p>
                                </div>
                                {notif.unread && (
                                  <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0 self-center"></span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Footer Actions */}
                      {notifications.length > 0 && (
                        <div className="p-2 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between px-3">
                          <button
                            onClick={clearNotifications}
                            className="text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            Clear all
                          </button>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                            {notifications.length} updates
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatedThemeToggler
                className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
                iconClassName="h-4 w-4"
                aria-label="Toggle Theme"
              />
            </div>
        </div>

        {/* Scrollable Middle Area: Profile Card & Categorized Menu */}
        <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar py-3">
          {/* User Profile Card (Centered Avatar & Name) */}
          <div className="flex flex-col items-center text-center space-y-2.5 py-2">
            <div className="relative">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-teal-500/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-teal-500/30 ring-4 ring-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center font-extrabold text-3xl shadow-sm">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium truncate max-w-[200px]">
                {user.email}
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>

          {/* Categorized Navigation Menu */}
          <nav className="space-y-4">
            {sidebarCategories.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase px-3 block">
                  {group.category}
                </span>
                <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const active = activeTab === link.id;
                    return (
                      <li key={link.id} className="shrink-0 lg:shrink">
                        <button
                          onClick={() => handleTabChange(link.id)}
                          className={`flex items-center space-x-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left whitespace-nowrap cursor-pointer ${
                            active
                              ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-bold"
                              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 border border-transparent"
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-teal-500" : "text-slate-400 dark:text-zinc-500"}`} />
                          <span>{link.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Sign Out Button Inspired by Reference Design */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/70 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dynamic Workspace Panel */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden space-y-6">
        {/* Top Metric Cards Row (Only shown when not on comprehensive Admin Overview) */}
        {!(user.role === "Admin" && activeTab === "overview") && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {/* KPI Card 1: Verified Tenant / Listing Status */}
            <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
              <div className="absolute -right-6 -top-6 size-28 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {user.role === "Owner" ? "100%" : "Active"}
                  </span>
                  <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    {user.role === "Owner" ? "Listing Status" : "Verified Tenant"}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                    {user.role === "Owner" ? "Verified & Published" : "ID Approved & Trusted"}
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
            </div>

            {/* KPI Card 2: Secure Payments */}
            <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
              <div className="absolute -right-6 -top-6 size-28 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {user.role === "Owner" ? "Stripe" : "Instant"}
                  </span>
                  <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Secure Payments
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                    Encrypted Checkout
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
            </div>

            {/* KPI Card 3: Maintenance & AI */}
            <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
              <div className="absolute -right-6 -top-6 size-28 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    24/7
                  </span>
                  <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Maintenance &amp; AI
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                    Automated Dispatch
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
            </div>

            {/* KPI Card 4: Interactive Tours */}
            <div className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-teal-500/5 relative overflow-hidden text-left flex flex-col justify-between">
              <div className="absolute -right-6 -top-6 size-28 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Live
                  </span>
                  <div className="size-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Interactive Tours
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                    Video &amp; In-Person
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-4 h-1.5 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-xs shadow-teal-500/30" />
            </div>
          </section>
        )}

        {/* Selected Workspace View */}
        <div className="w-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {renderActiveView()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin h-10 w-10 text-teal-500 mb-4" />
        <span className="text-sm font-semibold text-slate-500">Loading Dashboard...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
