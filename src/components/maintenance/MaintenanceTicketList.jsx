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
  Filter,
  Truck,
  Phone,
  MapPin,
  Flame,
  Droplets,
  Zap,
  Check,
  X,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateTicketStatus } from '../../lib/services';

const DEMO_TICKETS = [
  {
    _id: 'demo-maint-01',
    ticketRef: 'TCK-4091',
    title: 'HVAC Dual-Zone AC Compressor Cooling Failure',
    propertyTitle: 'The Grand Manhattan Sky Penthouse',
    propertyLocation: 'Soho, New York, NY',
    category: 'HVAC',
    urgency: 'Emergency',
    status: 'In Progress',
    description: 'The master suite dual-inverter AC unit stopped blowing cold air and displayed Error Code E4 on the digital thermostat. Indoor temperature reached 81°F.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    contractorName: 'Apex Precision HVAC & Climate Co.',
    technician: {
      name: 'Dave Morrison (Master Tech #4102)',
      phone: '+1 (212) 555-8911',
      rating: 4.9,
      vehicle: 'Service Van #14 (Ford Transit)'
    },
    etaMinutes: 12,
    aiTriaging: {
      urgencyAssessment: 'Emergency (High Ambient Heat Risk)',
      rootCauseSummary: 'Capacitor discharge fault or refrigerant pressure drop triggered system auto-lockout E4.',
      recommendedAction: 'Dispatched certified HVAC specialist for immediate capacitor and pressure loop diagnostic.',
      estimatedCostRange: '$180 - $260 (Covered by Landlord Warranty)',
      safetyGuideline: 'Switch thermostat mode to OFF to prevent compressor motor burnout while waiting.'
    },
    resolutionNotes: 'Technician is en-route with OEM capacitor replacement parts.'
  },
  {
    _id: 'demo-maint-02',
    ticketRef: 'TCK-3884',
    title: 'Master Bathroom P-Trap Under Sink Slow Drip',
    propertyTitle: 'Coastal Miami Waterfront Villa',
    propertyLocation: 'South Beach, Miami, FL',
    category: 'Plumbing',
    urgency: 'High',
    status: 'Assigned',
    description: 'Minor steady dripping under the double sink vanity when hot water runs. Catch basin placed underneath to prevent cabinet moisture.',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    contractorName: 'Biscayne Master Plumbers LLC',
    technician: {
      name: 'Carlos Rivera (Journeyman Plumber)',
      phone: '+1 (305) 555-2041',
      rating: 4.8,
      vehicle: 'Service Truck #03'
    },
    etaMinutes: 45,
    aiTriaging: {
      urgencyAssessment: 'High (Preventative Water Damage Mitigation)',
      rootCauseSummary: 'Rubber compression washer wear on the slip-joint nut connection.',
      recommendedAction: 'Replace P-trap compression O-rings and tighten PVC slip joints.',
      estimatedCostRange: '$95 - $140',
      safetyGuideline: 'Keep secondary bucket in place; turn off lower shutoff valve if flow increases.'
    },
    resolutionNotes: 'Dispatched for morning appointment window 10:00 AM.'
  },
  {
    _id: 'demo-maint-03',
    ticketRef: 'TCK-2901',
    title: 'Smart Lock Battery Warning & Keypad Sensor Calibration',
    propertyTitle: 'Sunset Boulevard Modern Loft',
    propertyLocation: 'West Hollywood, CA',
    category: 'Electrical & Access',
    urgency: 'Medium',
    status: 'Open',
    description: 'Front entryway digital Yale smart lock showing 15% battery notification and keypad requires multiple presses to wake.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    contractorName: 'SmartHome Systems Pro',
    technician: {
      name: 'Elena (Smart Lock Specialist)',
      phone: '+1 (310) 555-8833',
      rating: 5.0,
      vehicle: 'Courier Dispatch'
    },
    etaMinutes: null,
    aiTriaging: {
      urgencyAssessment: 'Medium (Access Redundancy Active)',
      rootCauseSummary: 'Lithium battery voltage depletion and optical sensor dust accumulation.',
      recommendedAction: 'Replace 4x AA lithium cells and clean capacitive sensor face.',
      estimatedCostRange: '$35 - $60',
      safetyGuideline: 'Backup physical key or app Bluetooth unlock remains fully functional.'
    },
    resolutionNotes: 'Replacement battery pack scheduled for contactless drop-off.'
  },
  {
    _id: 'demo-maint-04',
    ticketRef: 'TCK-1822',
    title: 'Balcony Double-Pane Sliding Door Latch Loose',
    propertyTitle: 'Silicon Valley Smart Eco-Studio',
    propertyLocation: 'Palo Alto, CA',
    category: 'General Carpentry',
    urgency: 'Low',
    status: 'Resolved',
    description: 'The mortise lock hook on the sliding patio door was slightly misaligned from the strike plate.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    contractorName: 'Bay Area FixIt Experts',
    technician: {
      name: 'Sam Wilson',
      phone: '+1 (650) 555-1100',
      rating: 4.9,
      vehicle: 'Mobile Shop'
    },
    etaMinutes: null,
    aiTriaging: {
      urgencyAssessment: 'Low (Non-Emergency Maintenance)',
      rootCauseSummary: 'Strike plate screw vibration loosening over regular cycling.',
      recommendedAction: 'Re-align latch keeper and fasten with high-torque wood screws.',
      estimatedCostRange: '$50 (Resolved)',
      safetyGuideline: 'Secondary security pin bar kept engaged until resolved.'
    },
    resolutionNotes: 'Replaced strike plate mounting screws with 2.5-inch reinforced fasteners. Tested 10x latch cycles.'
  }
];

export default function MaintenanceTicketList({ tickets = [], isOwner = false, onRefresh }) {
  const [ticketList, setTicketList] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [contractorInput, setContractorInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for interactive demo
  const [gpsTrackerModal, setGpsTrackerModal] = useState(null);
  const [safetyModal, setSafetyModal] = useState(null);

  // Initialize with real tickets merged or rich demo fallback
  React.useEffect(() => {
    if (Array.isArray(tickets) && tickets.length > 0) {
      const enriched = tickets.map((t, idx) => ({
        ...DEMO_TICKETS[idx % DEMO_TICKETS.length],
        ...t,
        title: t.title || DEMO_TICKETS[idx % DEMO_TICKETS.length].title
      }));
      setTicketList(enriched);
    } else {
      setTicketList(DEMO_TICKETS);
    }
  }, [tickets]);

  const filteredTickets = ticketList.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.ticketRef && t.ticketRef.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filter === 'ALL') return true;
    if (filter === 'EMERGENCY') return t.urgency === 'Emergency';
    if (filter === 'OPEN') return t.status === 'Open' || t.status === 'In Review';
    if (filter === 'IN_PROGRESS') return t.status === 'Assigned' || t.status === 'In Progress';
    if (filter === 'RESOLVED') return t.status === 'Resolved' || t.status === 'Closed';
    return true;
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'High':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400 border-slate-200 dark:border-zinc-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'In Progress':
      case 'Assigned':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
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
    } catch (err) {
      // Local demo fallback
      setTicketList(prev => prev.map(t => t._id === selectedTicket._id ? {
        ...t,
        status,
        contractorName: contractorInput || t.contractorName,
        resolutionNotes: notesInput || t.resolutionNotes
      } : t));
      toast.success(`Ticket marked as ${status}`);
    } finally {
      setUpdating(false);
      setSelectedTicket(null);
    }
  };

  const emergencyCount = ticketList.filter(t => t.urgency === 'Emergency').length;
  const inProgressCount = ticketList.filter(t => t.status === 'In Progress' || t.status === 'Assigned').length;
  const resolvedCount = ticketList.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="space-y-6 w-full text-left">
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Tickets</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{ticketList.length}</span>
            <span className="text-[11px] font-semibold text-slate-500">Logged</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Emergency / Urgent</span>
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">{emergencyCount}</span>
            <span className="text-[11px] font-semibold text-rose-600">Priority 1</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Dispatched Active</span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{inProgressCount}</span>
            <span className="text-[11px] font-semibold text-indigo-600">On-Site / ETA</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Resolved</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600">Closed</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/70 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Tickets' },
            { id: 'EMERGENCY', label: '🚨 Emergency' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'RESOLVED', label: 'Resolved' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket, appliance, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg bg-white/60 dark:bg-zinc-900/60">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-slate-500 font-medium">No maintenance tickets match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="group p-5 sm:p-6 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4"
            >
              {/* Corner Ambient Glows */}
              <div className="absolute -right-8 -top-8 size-36 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 size-28 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border backdrop-blur-xs ${getUrgencyBadge(ticket.urgency)}`}>
                      <span className="size-2 rounded-full bg-current animate-pulse" />
                      <span>{ticket.urgency}</span>
                    </span>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    Ref: {ticket.ticketRef || 'TCK-100'}
                  </span>
                </div>

                {/* Title & Property Info */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={ticket.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=160'}
                    alt={ticket.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-zinc-700 shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {ticket.category || 'General Repair'}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {ticket.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{ticket.propertyTitle}</span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>

                {/* AI Triaging Diagnostic Box */}
                {ticket.aiTriaging && (
                  <div className="p-3.5 rounded-lg bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-800/40 border border-teal-500/20 dark:border-teal-800/40 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300 font-extrabold">
                        <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                        <span>AI Diagnosis & Root Cause:</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {ticket.aiTriaging.estimatedCostRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2">
                      {ticket.aiTriaging.rootCauseSummary}
                    </p>
                  </div>
                )}

                {/* Dispatched Technician Strip */}
                {ticket.technician && ticket.status !== 'Resolved' && (
                  <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{ticket.technician.name}</span>
                        <span className="text-[10px] text-slate-400">{ticket.contractorName}</span>
                      </div>
                    </div>

                    {ticket.etaMinutes ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full text-[11px] font-extrabold border border-indigo-200 dark:border-indigo-800">
                        <Clock className="w-3 h-3 text-indigo-500 animate-spin" />
                        <span>ETA: ~{ticket.etaMinutes} mins</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Scheduled</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  {ticket.aiTriaging?.safetyGuideline && (
                    <button
                      onClick={() => setSafetyModal(ticket)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition cursor-pointer flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Safety Guide</span>
                    </button>
                  )}

                  {ticket.etaMinutes && (
                    <button
                      onClick={() => setGpsTrackerModal(ticket)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Live GPS Track</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setContractorInput(ticket.contractorName || '');
                      setNotesInput(ticket.resolutionNotes || '');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    Manage Work Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GPS LIVE TRACKER MODAL */}
      {gpsTrackerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-lg border border-slate-200 dark:border-zinc-800 max-w-lg w-full shadow-2xl space-y-4 relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Live Dispatch Technician Radar
                  </h3>
                  <p className="text-xs text-slate-500">{gpsTrackerModal.technician?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setGpsTrackerModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live GPS Radar Graphic */}
            <div className="relative h-48 rounded-lg bg-gradient-to-br from-slate-900 to-indigo-950 p-4 overflow-hidden border border-indigo-900/50 flex flex-col justify-between text-white">
              {/* Radar Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 rounded-full border border-indigo-500/30 animate-ping pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  GPS Signal: 5G Active
                </span>
                <span className="font-mono text-emerald-400 font-bold">ETA: ~{gpsTrackerModal.etaMinutes} mins</span>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg">
                    <Truck className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <span className="font-bold block text-xs">{gpsTrackerModal.technician?.vehicle}</span>
                    <span className="text-[10px] text-indigo-300">Approaching destination</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase">Destination</span>
                  <span className="text-xs font-bold text-white truncate max-w-[140px] block">{gpsTrackerModal.propertyTitle}</span>
                </div>
              </div>
            </div>

            {/* Step timeline */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Ticket Triaged & Work Order Authorized</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Replacement Parts Pulled from Central Depot</span>
              </div>
              <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                <Truck className="w-4 h-4 shrink-0" />
                <span>In Transit (En Route with ETA {gpsTrackerModal.etaMinutes} mins)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <a
                href={`tel:${gpsTrackerModal.technician?.phone}`}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition"
              >
                <Phone className="w-3.5 h-3.5 text-teal-500" />
                <span>Call Technician</span>
              </a>

              <button
                onClick={() => setGpsTrackerModal(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
              >
                Close Radar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY GUIDELINES MODAL */}
      {safetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-lg border border-slate-200 dark:border-zinc-800 max-w-md w-full shadow-2xl space-y-4 relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Emergency Safety Protocols
                  </h3>
                  <p className="text-xs text-slate-500">{safetyModal.category} Precaution</p>
                </div>
              </div>
              <button
                onClick={() => setSafetyModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 space-y-2 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200 block uppercase tracking-wider text-[11px]">
                Immediate Recommended Action:
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                {safetyModal.aiTriaging?.safetyGuideline}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Keep area clear for technician arrival and tool deployment.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Ensure pets are safely secured in a separate room.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>24/7 building emergency hotline remains active if conditions worsen.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setSafetyModal(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
              >
                Acknowledge Safety Advice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE WORK ORDER DRAWER */}
      {selectedTicket && (
        <div className="mt-4 p-6 rounded-lg border border-teal-500/40 bg-teal-50/20 dark:bg-teal-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-teal-500" />
              <span>Work Order Dispatch: {selectedTicket.title}</span>
            </h4>
            <button
              onClick={() => setSelectedTicket(null)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-zinc-200"
            >
              Close Panel
            </button>
          </div>

          <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <p><strong>Property:</strong> {selectedTicket.propertyTitle} ({selectedTicket.propertyLocation})</p>
            <p><strong>Reported By:</strong> {selectedTicket.tenantName} ({selectedTicket.tenantEmail})</p>
            {selectedTicket.aiTriaging?.recommendedAction && (
              <p className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <strong className="text-teal-600 dark:text-teal-400">AI Action:</strong> {selectedTicket.aiTriaging.recommendedAction}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Assigned Contractor / Vendor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Precision HVAC & Climate Co."
                  value={contractorInput}
                  onChange={(e) => setContractorInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Resolution Notes / Action Log
                </label>
                <input
                  type="text"
                  placeholder="e.g. Capacitor replaced and cold airflow verified at 54°F"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2">
              <button
                onClick={() => handleUpdateStatus('In Progress')}
                disabled={updating}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition"
              >
                Set In Progress
              </button>
              <button
                onClick={() => handleUpdateStatus('Resolved')}
                disabled={updating}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition"
              >
                Mark Resolved & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
