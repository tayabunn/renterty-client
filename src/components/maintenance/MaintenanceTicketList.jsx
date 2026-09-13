'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateTicketStatus } from '../../lib/services';

export default function MaintenanceTicketList({ tickets = [], isOwner = false, onRefresh }) {
  const [filter, setFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [contractorInput, setContractorInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const filteredTickets = tickets.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'OPEN') return t.status === 'Open' || t.status === 'In Review';
    if (filter === 'IN_PROGRESS') return t.status === 'Assigned' || t.status === 'In Progress';
    if (filter === 'RESOLVED') return t.status === 'Resolved' || t.status === 'Closed';
    return true;
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900';
      case 'High':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'Medium':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400';
      case 'In Progress':
      case 'Assigned':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400';
      default:
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400';
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      await updateTicketStatus(selectedTicket._id, {
        status,
        contractorName: contractorInput || selectedTicket.contractorName,
        resolutionNotes: notesInput || selectedTicket.resolutionNotes
      });
      toast.success(`Ticket marked as ${status}`);
      if (onRefresh) onRefresh();
      setSelectedTicket(prev => prev ? { ...prev, status, contractorName: contractorInput || prev.contractorName } : null);
    } catch (err) {
      toast.error('Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
        </span>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">No maintenance tickets found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => {
                setSelectedTicket(ticket);
                setContractorInput(ticket.contractorName || '');
                setNotesInput(ticket.resolutionNotes || '');
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedTicket?._id === ticket._id
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getUrgencyBadge(ticket.urgency)}`}>
                    {ticket.urgency}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {ticket.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {ticket.propertyTitle} • {ticket.category}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2">
                {ticket.description}
              </p>

              {/* AI Badge Summary */}
              {ticket.aiTriaging && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" /> AI Recommended:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-semibold truncate max-w-[200px]">
                    {ticket.aiTriaging.estimatedCostRange || 'Standard dispatch'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected Ticket Management Drawer / Details Modal */}
      {selectedTicket && (
        <div className="mt-4 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-500" />
              Ticket Management: {selectedTicket.title}
            </h4>
            <button
              onClick={() => setSelectedTicket(null)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Close Details
            </button>
          </div>

          <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <p><strong>Property:</strong> {selectedTicket.propertyTitle} ({selectedTicket.propertyLocation})</p>
            <p><strong>Reported By:</strong> {selectedTicket.tenantName} ({selectedTicket.tenantEmail})</p>
            {selectedTicket.aiTriaging?.recommendedAction && (
              <p className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong>AI Recommended Action:</strong> {selectedTicket.aiTriaging.recommendedAction}
              </p>
            )}
          </div>

          {isOwner && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Assigned Contractor / Vendor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Plumbing Co."
                    value={contractorInput}
                    onChange={(e) => setContractorInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Resolution Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Valve replaced on Tuesday"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-2">
                <button
                  onClick={() => handleUpdateStatus('In Progress')}
                  disabled={updating}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus('Resolved')}
                  disabled={updating}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
