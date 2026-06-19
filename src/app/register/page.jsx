"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { Lock, Mail, User, Image, Building2, Loader2 } from "lucide-react";

export default function Register() {
  const { user, register, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setSubmitting(true);
    try {
      await register(name, email, password, photo);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl text-white shadow-lg">
              <Building2 className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Create a New Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-zinc-400">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 underline"
            >
              log in to your account
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-black/50 sm:rounded-2xl sm:px-10 border border-slate-200/60 dark:border-zinc-800/60">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-150"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-150"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Photo URL (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Image className="h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-150"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-150"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-150"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-zinc-900 text-slate-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Google Social SignUp */}
              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={submitting || loading}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 dark:border-zinc-800 rounded-lg shadow-sm bg-white dark:bg-zinc-950 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all duration-150"
                >
                  <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.36 6.277-6.36c1.497 0 2.87.547 3.93 1.543l3.2-3.2C18.96 2.217 15.82 1 12.24 1 5.866 1 .7 6.136.7 12.485c0 6.35 5.166 11.485 11.54 11.485 6.666 0 11.096-4.63 11.096-11.26 0-.768-.08-1.348-.22-1.925H12.24z"/>
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
