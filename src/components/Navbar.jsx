"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Home, Building2, LayoutDashboard, LogOut, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { InteractiveHoverButton } from "@/registry/magicui/interactive-hover-button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const {data: session} = useSession()
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "All Properties", href: "/properties", icon: Building2 },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand Name */}
            <Link href="/" aria-label="Renterty Homepage" className="flex items-center space-x-2 group">
            <div className="p-2 bg-linear-to-tr from-teal-500 to-emerald-500 rounded-xl text-white transform group-hover:scale-105 transition-all duration-300 shadow-md shadow-teal-500/20">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent group-hover:opacity-90">
              Renterty
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-slate-100 dark:bg-zinc-800 text-teal-600 dark:text-teal-400"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-zinc-800 pl-6">
              {/* Theme Toggle */}
              <AnimatedThemeToggler
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200"
                aria-label="Toggle Theme"
              />

              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Dashboard link */}
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1 px-4 py-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-semibold shadow-sm hover:from-teal-600 hover:to-emerald-600 hover:shadow-md transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Profile & Logout */}
                  <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-zinc-800 pl-4">
                    {user.photo ? (
                      <img
                        width={32}
                        height={32}
                        src={user.photo}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border border-slate-200 dark:border-zinc-700 object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                        {user.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200"
                      title="Log Out"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-all"
                  >
                    Log In
                  </Link>
                  <InteractiveHoverButton
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </InteractiveHoverButton>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <AnimatedThemeToggler
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg transition"
              aria-label="Toggle Theme"
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-all cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" role="region" aria-label="Mobile Navigation" className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-zinc-950/95 border-b border-slate-200 dark:border-zinc-800 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all ${
                  active
                    ? "bg-slate-100 dark:bg-zinc-900 text-teal-600 dark:text-teal-400"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          {user ? (
            <div className="pt-4 pb-2 border-t border-slate-200 dark:border-zinc-800 mt-4 px-3">
              <div className="flex items-center space-x-3 mb-3">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg">
                    {user.name ? user.name[0].toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">{user.email}</div>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-100 rounded-md"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md text-left cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col space-y-2 px-3 mt-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition"
              >
                Log In
              </Link>
              <InteractiveHoverButton
                onClick={() => {
                  setIsOpen(false);
                  router.push("/register");
                }}
                className="w-full text-center justify-center"
              >
                Register
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