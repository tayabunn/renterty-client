'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Sparkles, AlertCircle, ShieldAlert, CheckCircle2, Clock, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTenantTickets, getOwnerTickets } from '../../lib/services';
import MaintenanceTicketList from '../maintenance/MaintenanceTicketList';
import MaintenanceRequestModal from '../maintenance/MaintenanceRequestModal';

export default function MaintenanceView({ isOwner = false, user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = isOwner ? await getOwnerTickets() : await getTenantTickets();
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      // Fallback handled in MaintenanceTicketList
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isOwner]);

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Automated Triaging & Vendor Dispatch Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-amber-500" />
            <span>{isOwner ? 'Property Maintenance & Repair Dispatch' : 'Maintenance & Emergency Requests'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {isOwner
              ? 'Real-time AI diagnostic triaging, contractor dispatch assignments, and invoice approvals.'
              : 'Submit repair tickets, receive instant AI safety guidance, and track technician arrival in real-time.'}
          </p>
        </div>

        {!isOwner && (
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-bold shadow-sm transition-all duration-200 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Issue</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
          <p className="text-xs text-slate-500">Connecting to maintenance dispatch engine...</p>
        </div>
      ) : (
        <MaintenanceTicketList
          tickets={tickets}
          isOwner={isOwner}
          onRefresh={fetchTickets}
        />
      )}

      {showNewModal && (
        <MaintenanceRequestModal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          property={{ title: 'The Grand Manhattan Sky Penthouse' }}
          onSuccess={() => {
            fetchTickets();
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}
