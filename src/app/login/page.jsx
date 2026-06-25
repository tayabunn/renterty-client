"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { MagicCard } from "../../components/ui/magic-card";

export default function Login() {
  
  const { user, login, loginWithGoogle, loading } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    try {
      await login(email, password);
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
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-linear-to-tr from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          {/* Header element kept clean and minimal */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0"
        >
          <Card className="w-full border-none p-0 shadow-none bg-transparent">
            <MagicCard
              mode="orb"
              glowFrom={theme === "dark" ? "#14b8a6" : "#99f6e4"}
              glowTo={theme === "dark" ? "#059669" : "#a7f3d0"}
              gradientFrom={theme === "dark" ? "#14b8a6" : "#2dd4bf"}
              gradientTo={theme === "dark" ? "#059669" : "#34d399"}
              className="p-0 bg-transparent shadow-xl shadow-slate-200/50 dark:shadow-black/50"
            >
              <CardHeader className="border-border border-b p-6 [.border-b]:pb-4 text-center">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Log In to Renterty</CardTitle>
                <CardDescription className="text-slate-500 dark:text-zinc-400">
                  Or{" "}
                  <Link
                    href="/register"
                    className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 underline"
                  >
                    create a new account
                  </Link>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || loading}
                      className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-150 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
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
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Social SignUp */}
                  <div className="mt-6">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={submitting || loading}
                      className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 dark:border-zinc-800 rounded-lg shadow-sm bg-white dark:bg-zinc-950 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all duration-150 cursor-pointer"
                    >
                      <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.36 6.277-6.36c1.497 0 2.87.547 3.93 1.543l3.2-3.2C18.96 2.217 15.82 1 12.24 1 5.866 1 .7 6.136.7 12.485c0 6.35 5.166 11.485 11.54 11.485 6.666 0 11.096-4.63 11.096-11.26 0-.768-.08-1.348-.22-1.925H12.24z"/>
                      </svg>
                      <span>Google</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </MagicCard>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
