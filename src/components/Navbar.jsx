"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Building2, LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { InteractiveHoverButton } from "@/registry/magicui/interactive-hover-button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const {data: session} = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Desktop user menu dropdown state & click-outside
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const navLinks = [
    { name: "All Properties", href: "/properties" },
    { name: "Explore Map", href: "/map" },
    { name: "AI Estimator", href: "/estimator" },
    { name: "For Landlords", href: "/landlords" },
    { name: "How It Works", href: "/how-it-works" },
  ];

  const handleLogout = async() => {
    await logout();
    router.push("/");
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Skip to Main Content Link for Screen Readers & Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-bold transition-all"
      >
        Skip to main content
      </a>

      <nav aria-label="Main Navigation" className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 transition-all duration-300">
        <div className="w-[90%] mx-auto">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Official Logo */}
            <Link href="/" aria-label="Renterty Homepage" className="flex items-center group shrink-0">
              <Image
                src="/logo.png"
                alt="Renterty"
                width={120}
                height={32}
                className="h-6 md:h-7 w-auto object-contain dark:brightness-0 dark:invert transition-all group-hover:opacity-90"
                priority
              />
            </Link>

            {/* Desktop & Laptop Nav Links */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-6 min-w-0">
              <div className="flex items-center space-x-0.5 xl:space-x-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        active
                          ? "bg-slate-100 dark:bg-zinc-800 text-teal-600 dark:text-teal-400"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 xl:space-x-3.5 border-l border-slate-200 dark:border-zinc-800 pl-2.5 xl:pl-5 shrink-0">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    {/* User Pill Button */}
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      aria-label="User profile menu"
                      className="flex items-center space-x-2 pl-1.5 pr-3.5 py-1.5 bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                    >
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="h-6 w-6 rounded-full object-cover ring-2 ring-white/40 shrink-0"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-black/30 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <span className="truncate">
                        {user.name ? user.name.trim().split(" ")[0] : "Account"}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-white/80 transition-transform duration-200 ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Popover Card */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 top-11 w-64 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800 rounded-lg shadow-2xl p-4 z-50 space-y-3"
                        >
                          {/* User Info Header */}
                          <div className="space-y-0.5 pb-2.5 border-b border-slate-100 dark:border-zinc-800/80 text-left">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                              {user.email}
                            </p>
                          </div>

                          {/* Navigation Items */}
                          <div className="space-y-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-2 w-full px-2.5 py-2.5 rounded-xl text-xs xl:text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                            >
                              <LayoutDashboard className="h-4 w-4 text-teal-500 shrink-0" />
                              <span>Dashboard</span>
                            </Link>
                          </div>

                          {/* Red Sign Out Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-[#ff334b] hover:bg-rose-600 active:scale-[0.98] transition-all text-center text-xs xl:text-sm cursor-pointer"
                          >
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 shrink-0">
                    <InteractiveHoverButton
                      onClick={() => router.push("/login")}
                    >
                      Book now
                    </InteractiveHoverButton>
                  </div>
                )}

                {/* Theme Toggle */}
                <AnimatedThemeToggler
                  className="p-1.5 xl:p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 shrink-0 cursor-pointer"
                  aria-label="Toggle Theme"
                />
              </div>
            </div>

          {/* Mobile and Tablet menu button */}
          <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2">
            <AnimatedThemeToggler
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg transition"
              aria-label="Toggle Theme"
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-all cursor-pointer min-h-[40px] min-w-[40px]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Dropdown Menu */}
      {isOpen && (
        <div id="mobile-menu" role="region" aria-label="Mobile Navigation" className="lg:hidden px-3 pt-2 pb-4 space-y-1.5 bg-white/98 dark:bg-zinc-950/98 border-b border-slate-200 dark:border-zinc-800 backdrop-blur-xl shadow-xl">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all ${
                  active
                    ? "bg-slate-100 dark:bg-zinc-900 text-teal-600 dark:text-teal-400 font-bold"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-100"
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
          {user ? (
            <div className="pt-3 pb-1 border-t border-slate-200 dark:border-zinc-800 mt-3 px-1">
              <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="h-10 w-10 rounded-full object-cover shrink-0 ring-2 ring-teal-500/20" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {user.name ? user.name[0].toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user.email}</div>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 w-full px-3 py-2.5 text-sm sm:text-base font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-4.5 w-4.5 text-teal-500 shrink-0" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  aria-label="Sign Out"
                  className="flex items-center space-x-2.5 w-full px-3 py-2.5 text-sm sm:text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none transition-colors"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-col space-y-2 px-1 mt-3">
              <InteractiveHoverButton
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
                className="w-full text-center justify-center py-3 text-sm font-bold"
              >
                Book now
              </InteractiveHoverButton>
            </div>
          )}
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;