"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user state from Better Auth session
  const fetchSession = async () => {
    try {
      if (typeof window === "undefined") return;
      const res = await authClient.getSession();
      if (res && res.data && res.data.user) {
        if (res.data.session?.token) {
          localStorage.setItem("renterty_token", res.data.session.token);
        }
        setUser({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role || "Tenant",
          photo: res.data.user.photo || res.data.user.image || "",
        });
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authClient.signIn.email({
        email,
        password,
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to log in");
      }

      if (response.data) {
        const token = response.data.token || response.data.session?.token;
        if (token) {
          localStorage.setItem("renterty_token", token);
        }
        if (response.data.user) {
          setUser({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role || "Tenant",
            photo: response.data.user.photo || response.data.user.image || "",
          });
        }
      }

      toast.success("Welcome back!");
      return response.data?.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, photo, role) => {
    setLoading(true);
    try {
      const response = await authClient.signUp.email({
        email,
        password,
        name,
        image: photo, // Map photo to image field
        role: role || "Tenant",
      });

      if (response.error) {
        throw new Error(response.error.message || "Registration failed");
      }

      if (response.data) {
        const token = response.data.token || response.data.session?.token;
        if (token) {
          localStorage.setItem("renterty_token", token);
        }
        if (response.data.user) {
          setUser({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role || "Tenant",
            photo: response.data.user.photo || response.data.user.image || "",
          });
        }
      }

      toast.success("Account created successfully!");
      return response.data?.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Login handler
  const loginWithGoogle = async () => {
    try {
      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard`
      });

      if (response?.error) {
        throw new Error(response.error.message || "Google sign-in failed");
      }

      return response?.data;
    } catch (error) {
      toast.error(error.message || "Failed to connect to Google");
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      localStorage.removeItem("renterty_token");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
