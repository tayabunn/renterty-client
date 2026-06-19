"use client";

import React from "react";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfileView({ user }) {
  if (!user) return null;

  return (
    <div className="max-w-xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 p-8 rounded-3xl shadow-sm text-left space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* User photo */}
        {user.photo ? (
          <img
            src={user.photo}
            alt={user.name}
            className="h-24 w-24 rounded-full border-2 border-teal-500/20 object-cover shadow-sm"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center font-black text-4xl shadow-md">
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

          <div className="space-y-1.5 pt-2 text-sm text-slate-600 dark:text-zinc-400 font-medium">
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
    </div>
  );
}
