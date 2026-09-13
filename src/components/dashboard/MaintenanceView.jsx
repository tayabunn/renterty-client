'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Sparkles, AlertCircle } from 'lucide-react';
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
      toast.error('Failed to load maintenance tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isOwner]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            {isOwner ? 'Property Maintenance & Repair Dispatch' : 'My Maintenance Requests'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            {isOwner
              ? 'AI-triaged repair tickets, vendor assignment, and urgent repairs tracking'
              : 'Submit issues, get instant AI diagnosis & safety advice, and track repair status'}
          </p>
        </div>

        {!isOwner && (
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Report Issue
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
          <p className="text-xs text-slate-500">Loading maintenance queue...</p>
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
          property={{ title: 'General Rental Property' }}
          onSuccess={() => {
            fetchTickets();
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}
