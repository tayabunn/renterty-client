"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Calendar, Edit2, Loader2, X, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { uploadImage } from "../../utils/uploadimage";
import toast from "react-hot-toast";
import Image from "next/image";
import { API_URL } from "@/lib/config";

export default function ProfileView({ user: propUser }) {
  const { user: authUser, setUser } = useAuth();
  const user = authUser || propUser;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize form fields when editing state changes or user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      const photoUrl = user.photo || user.image || "";
      setPhoto(photoUrl);
      setPreviewUrl(photoUrl);
      setSelectedFile(null);
    }
  }, [user, isEditing]);

  if (!user) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    setSaving(true);
    let uploadedPhotoUrl = photo;

    try {
      // 1. Upload image if a file was selected
      if (selectedFile) {
        toast.loading("Uploading profile image...", { id: "profile-image-upload" });
        try {
          uploadedPhotoUrl = await uploadImage(selectedFile);
          toast.success("Image uploaded successfully!", { id: "profile-image-upload" });
        } catch (uploadErr) {
          toast.error("Failed to upload profile image", { id: "profile-image-upload" });
          throw uploadErr;
        }
      }

      // 2. Call backend profile update endpoint
      const token = localStorage.getItem("renterty_token");
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          photo: uploadedPhotoUrl
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        // Update local context user state
        setUser({
          ...user,
          name: data.user.name,
          email: data.user.email,
          photo: data.user.photo || data.user.image || ""
        });
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group w-full max-w-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 p-8 sm:p-10 rounded-3xl hover:border-teal-500/40 dark:hover:border-teal-500/40 text-left relative overflow-hidden transition-all duration-300">
      {/* Corner Ambient Glow Orb */}
      <div className="absolute -right-10 -top-10 size-40 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

      {!isEditing ? (
        <>
          {/* Edit button in the "red mark area" */}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 p-2.5 bg-slate-50 hover:bg-teal-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-300 rounded-xl transition-all duration-200 border border-slate-200/80 dark:border-zinc-700 cursor-pointer z-10"
            title="Edit Profile"
          >
            <Edit2 className="h-4.5 w-4.5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* User photo */}
            {user.photo ? (
              <Image
                src={user.photo}
                alt={user.name}
                className="h-24 w-24 rounded-full border-2 border-teal-500/20 object-cover"
                width={96}
                height={96}
                unoptimized
              />
            ) : (
              <div className="h-24 w-24 rounded-full linear-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center font-black text-4xl">
                {user.name[0].toUpperCase()}
              </div>
            )}

            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </h2>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 mt-1 border border-teal-500/10">
                  <Shield className="h-3 w-3" />
                  <span>{user.role} Account</span>
                </span>
              </div>

              <div className="space-y-1.5 pt-2 text-sm text-slate-600 dark:text-zinc-400 .font-semibold font-medium">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile Details</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Edit User photo */}
            <div className="relative group">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="h-24 w-24 rounded-full border-2 border-teal-500/20 object-cover shadow-sm group-hover:opacity-75 transition-opacity duration-200"
                  width={96}
                  height={96}
                  unoptimized
                />
              ) : (
                <div className="h-24 w-24 rounded-full linear-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center font-black text-4xl shadow-md group-hover:opacity-75 transition-opacity duration-200">
                  {name ? name[0].toUpperCase() : "U"}
                </div>
              )}
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 text-[10px] font-bold">
                <Camera className="h-5 w-5 mb-1" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex-1 w-full space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-150 text-slate-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-150 text-slate-900 dark:text-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              disabled={saving}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 dark:border-zinc-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-850 focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
