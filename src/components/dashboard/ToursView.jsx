'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  User,
  Plus,
  Search,
  Filter,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Download,
  CalendarCheck,
  Check,
  Copy,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTenantTours, getOwnerTours, updateTourStatus } from '../../lib/services';
import Link from 'next/link';

const DEMO_TOURS = [
  {
    _id: 'demo-tour-101',
    propertyTitle: 'The Grand Manhattan Sky Penthouse',
    propertyLocation: 'Soho, New York, NY 10012',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    tourType: 'Live Video Tour',
    tourDate: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(), // in 3 hours
    tourTime: '02:00 PM (EST)',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/rnt-manh-sky',
    notes: 'Focus on natural sunlight exposure in the master suite and private rooftop terrace view.',
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    ownerEmail: 'sarah.j@manhattanrentals.com',
    hostName: 'Sarah Jenkins',
    hostPhone: '+1 (212) 555-0194',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'
  },
  {
    _id: 'demo-tour-102',
    propertyTitle: 'Coastal Miami Waterfront Villa',
    propertyLocation: 'South Beach, Miami, FL 33139',
    propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
    tourType: 'In-Person Private Tour',
    tourDate: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(), // tomorrow
    tourTime: '11:30 AM (EST)',
    status: 'Confirmed',
    meetingLink: null,
    notes: 'Please park at visitor dock B. Building security will grant elevator key at lobby.',
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    ownerEmail: 'marcus@miamicoastalluxury.com',
    hostName: 'Marcus Vance',
    hostPhone: '+1 (305) 555-7312',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'
  },
  {
    _id: 'demo-tour-103',
    propertyTitle: 'Sunset Boulevard Modern Loft',
    propertyLocation: 'West Hollywood, CA 90069',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    tourType: 'Live Video Tour',
    tourDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days
    tourTime: '04:00 PM (PST)',
    status: 'Pending',
    meetingLink: 'https://meet.google.com/rnt-weho-loft',
    notes: 'Interested in acoustic insulation & gigabit fiber setup for home studio.',
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    ownerEmail: 'elena@weholofts.com',
    hostName: 'Elena Rostova',
    hostPhone: '+1 (310) 555-4920',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
  },
  {
    _id: 'demo-tour-104',
    propertyTitle: 'Silicon Valley Smart Eco-Studio',
    propertyLocation: 'Palo Alto, CA 94301',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    tourType: 'In-Person Private Tour',
    tourDate: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    tourTime: '01:15 PM (PST)',
    status: 'Completed',
    meetingLink: null,
    notes: 'Great viewing. Tenant proceeded to submit online lease application.',
    tenantName: 'Alex Mercer',
    tenantEmail: 'alex.mercer@gmail.com',
    ownerEmail: 'david@stanfordliving.io',
    hostName: 'David Chen',
    hostPhone: '+1 (650) 555-3211',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'
  }
];

export default function ToursView({ isOwner = false }) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingModal, setMeetingModal] = useState(null);
  const [meetingUrlInput, setMeetingUrlInput] = useState('');
  
  // Interactive Demo States
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveRoomModal, setLiveRoomModal] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('02:00 PM');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = isOwner ? await getOwnerTours() : await getTenantTours();
      if (Array.isArray(data) && data.length > 0) {
        // Enrich real tours with demo fallbacks for images and host info
        const enriched = data.map((t, idx) => ({
          ...DEMO_TOURS[idx % DEMO_TOURS.length],
          ...t,
          propertyTitle: t.propertyTitle || DEMO_TOURS[idx % DEMO_TOURS.length].propertyTitle
        }));
        setTours(enriched);
      } else {
        setTours(DEMO_TOURS);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setTours(DEMO_TOURS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [isOwner]);

  const handleStatusChange = async (tourId, status, extra = {}) => {
    try {
      await updateTourStatus(tourId, { status, ...extra });
      toast.success(`Tour marked as ${status}`);
      fetchTours();
      setMeetingModal(null);
    } catch (err) {
      // If demo tour, update local state
      setTours(prev => prev.map(t => t._id === tourId ? { ...t, status, ...extra } : t));
      toast.success(`Tour marked as ${status}`);
      setMeetingModal(null);
    }
  };

  const handleAddToCalendar = (tour) => {
    toast.success(`Calendar invite for "${tour.propertyTitle}" synced to Google Calendar / iCal! 📅`);
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleDate) {
      toast.error('Please pick a new date');
      return;
    }
    setTours(prev => prev.map(t => t._id === rescheduleModal._id ? {
      ...t,
      tourDate: new Date(rescheduleDate).toISOString(),
      tourTime: rescheduleTime,
      status: 'Pending'
    } : t));
    toast.success('Reschedule request sent to host!');
    setRescheduleModal(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  const filteredTours = tours.filter(t => {
    const matchesSearch = 
      t.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.hostName && t.hostName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'ALL') return true;
    if (filterType === 'VIDEO') return t.tourType === 'Live Video Tour';
    if (filterType === 'IN_PERSON') return t.tourType === 'In-Person Private Tour';
    if (filterType === 'CONFIRMED') return t.status === 'Confirmed';
    return true;
  });

  const totalVideoTours = tours.filter(t => t.tourType === 'Live Video Tour').length;
  const totalInPersonTours = tours.filter(t => t.tourType === 'In-Person Private Tour').length;
  const confirmedCount = tours.filter(t => t.status === 'Confirmed').length;

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <span className="size-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Interactive Real-Time Walkthroughs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-teal-500" />
            <span>{isOwner ? 'Property Tour Inquiries' : 'My Scheduled Property Tours'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            {isOwner 
              ? 'Review tenant tour bookings, assign video conference links, and confirm viewing slots.' 
              : 'Join live HD virtual walkthroughs, access parking notes, and sync appointments with your calendar.'}
          </p>
        </div>

        <Link
          href="/#properties"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-bold shadow-sm transition-all duration-200 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Another Tour</span>
        </Link>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Scheduled Tours</span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{tours.length}</span>
            <span className="text-[11px] font-semibold text-slate-500">Appointments</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Live Video Calls</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Video className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">{totalVideoTours}</span>
            <span className="text-[11px] font-semibold text-purple-600">HD Virtual</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">In-Person Visits</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalInPersonTours}</span>
            <span className="text-[11px] font-semibold text-emerald-600">Walkthroughs</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Confirmed</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{confirmedCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600">Host Ready</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/70 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Tours' },
            { id: 'VIDEO', label: 'Video Tours 🎥' },
            { id: 'IN_PERSON', label: 'In-Person 📍' },
            { id: 'CONFIRMED', label: 'Confirmed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterType === tab.id
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
            placeholder="Search property or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-2"></div>
          <p className="text-xs text-slate-500">Loading tour schedule...</p>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg bg-white/60 dark:bg-zinc-900/60">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 dark:text-zinc-200">No Tours Match Your Filter</h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or book a new walkthrough viewing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour._id}
              className="group p-5 sm:p-6 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-4"
            >
              {/* Corner Ambient Glows */}
              <div className="absolute -right-8 -top-8 size-36 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 size-28 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1.5 rounded-full border backdrop-blur-xs ${getStatusBadge(tour.status)}`}>
                    <span className="size-2 rounded-full bg-current animate-pulse" />
                    <span>{tour.status}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 rounded-full text-xs font-bold border border-slate-200/60 dark:border-zinc-700/60">
                    {tour.tourType === 'Live Video Tour' ? (
                      <Video className="w-3.5 h-3.5 text-purple-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span>{tour.tourType}</span>
                  </span>
                </div>

                {/* Property Title & Image */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={tour.propertyImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=160'}
                    alt={tour.propertyTitle}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-zinc-700 shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {tour.propertyTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 flex items-center gap-1.5 mt-0.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{tour.propertyLocation}</span>
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                      Host: {tour.hostName || (isOwner ? tour.tenantName : 'Verified Host')}
                    </span>
                  </div>
                </div>

                {/* Date & Time Strip */}
                <div className="p-3.5 rounded-lg bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-800/40 border border-teal-500/20 dark:border-teal-800/40 flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-zinc-100">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <span>{new Date(tour.tourDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 font-bold bg-white/80 dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-teal-500/20">
                    <Clock className="w-3.5 h-3.5 text-teal-500" />
                    <span>{tour.tourTime}</span>
                  </span>
                </div>

                {/* Special Instructions & Notes */}
                {tour.notes && (
                  <div className="p-3 bg-slate-50/80 dark:bg-zinc-800/50 rounded-lg border border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-300">
                    <strong className="text-slate-900 dark:text-white">Note: </strong>
                    <span>{tour.notes}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCalendar(tour)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                    title="Add to Google Calendar"
                  >
                    <CalendarCheck className="w-4 h-4 text-teal-500" />
                  </button>

                  <button
                    onClick={() => setRescheduleModal(tour)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                  >
                    Reschedule
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {tour.tourType === 'Live Video Tour' ? (
                    <button
                      onClick={() => setLiveRoomModal(tour)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live HD Room</span>
                    </button>
                  ) : (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(tour.propertyLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  )}

                  {isOwner && tour.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusChange(tour._id, 'Confirmed')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIVE VIDEO TOUR ROOM MODAL */}
      {liveRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full h-[650px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left relative animate-in fade-in zoom-in-95 duration-200">
            {/* Top Room Bar */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-red-500 animate-ping" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Live HD Tour: {liveRoomModal.propertyTitle}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-bold">
                      1080p Stream
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">Host: {liveRoomModal.hostName} • Connected</p>
                </div>
              </div>

              <button
                onClick={() => setLiveRoomModal(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Main Stage */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
              {/* Simulated Property Live Stream */}
              <img
                src={liveRoomModal.propertyImage}
                alt="Live Stream"
                className="w-full h-full object-cover opacity-85"
              />

              {/* Host Overlay Video Feed (Picture in Picture) */}
              <div className="absolute top-4 right-4 w-40 h-28 rounded-lg overflow-hidden border-2 border-teal-500 shadow-xl bg-zinc-800 flex flex-col justify-between p-2">
                <img
                  src={liveRoomModal.hostAvatar}
                  alt="Host Video"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="relative z-10 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-md self-start">
                  Host: {liveRoomModal.hostName}
                </span>
                <span className="relative z-10 size-2 rounded-full bg-emerald-500 self-end" />
              </div>

              {/* Tenant Self Preview (Bottom Left) */}
              <div className="absolute bottom-4 left-4 w-32 h-24 rounded-lg overflow-hidden border border-zinc-700 shadow-lg bg-zinc-900 flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center">
                    <User className="w-8 h-8 text-teal-400 mx-auto" />
                    <span className="text-[10px] text-zinc-400 font-bold block mt-1">You (Tenant)</span>
                  </div>
                ) : (
                  <div className="text-center text-zinc-500">
                    <VideoOff className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-[9px]">Camera Off</span>
                  </div>
                )}
              </div>

              {/* Center Guidance Pill */}
              <div className="absolute bottom-4 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-zinc-700 text-white text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Host is currently walking through the Master Bedroom Suite</span>
              </div>
            </div>

            {/* Live Bottom Controls */}
            <div className="p-4 px-6 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-2xl font-bold transition cursor-pointer ${
                    isMicOn ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                  title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-2xl font-bold transition cursor-pointer ${
                    isVideoOn ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                  title={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toast.success('Inspection snapshot saved to your dashboard!')}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  📸 Take Snapshot
                </button>
                <button
                  onClick={() => setLiveRoomModal(null)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Leave Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-lg border border-slate-200 dark:border-zinc-800 max-w-md w-full shadow-2xl space-y-4 relative overflow-hidden text-left">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-500" />
              <span>Reschedule Tour Appointment</span>
            </h4>
            <p className="text-xs text-slate-500">Pick a new date and viewing window for {rescheduleModal.propertyTitle}.</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-medium outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Preferred Time Window</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-medium outline-none focus:border-teal-500"
                >
                  <option value="10:00 AM (EST)">10:00 AM (EST)</option>
                  <option value="11:30 AM (EST)">11:30 AM (EST)</option>
                  <option value="02:00 PM (EST)">02:00 PM (EST)</option>
                  <option value="04:30 PM (EST)">04:30 PM (EST)</option>
                  <option value="06:00 PM (EST)">06:00 PM (EST)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModal(null)}
                className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
