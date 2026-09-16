'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  UserCheck, 
  X, 
  CheckCircle2, 
  Sparkles,
  Phone,
  FileText,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { scheduleTour } from '../../lib/services';

const TIME_SLOTS = [
  '09:00 AM', '10:30 AM', '11:30 AM', 
  '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
];

export default function ScheduleTourModal({ isOpen, onClose, property, user }) {
  const [tourType, setTourType] = useState('In-Person');
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState(TIME_SLOTS[1]);
  const [tenantPhone, setTenantPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!tourDate) {
      toast.error('Please select a preferred tour date');
      return;
    }

    setLoading(true);
    try {
      await scheduleTour({
        propertyId: property._id,
        tourDate,
        tourTime,
        tourType,
        tenantPhone,
        notes
      });
      setConfirmed(true);
      toast.success('Tour scheduled successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to schedule tour');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setConfirmed(false);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 id="tour-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                Schedule a Property Tour
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {property?.title}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {confirmed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Tour Request Dispatched!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                The property host has been notified for {tourDate} at {tourTime} ({tourType}). You can view status in your dashboard.
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSchedule} className="p-6 space-y-5">
            {/* Tour Type Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Tour Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTourType('In-Person')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    tourType === 'In-Person'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs">In-Person</div>
                    <div className="text-[10px] text-slate-400">Walkthrough on-site</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTourType('Live Video Tour')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    tourType === 'Live Video Tour'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs">Live Video Call</div>
                    <div className="text-[10px] text-slate-400">Virtual tour via link</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Date and Time Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  min={minDateString}
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Time Slot
                </label>
                <select
                  value={tourTime}
                  onChange={(e) => setTourTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Questions / Notes */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Special Requests or Questions
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Interested in pet policy, parking spots..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all"
              >
                {loading ? 'Confirming...' : 'Request Tour'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
