'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, MapPin, CheckCircle2, XCircle, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTenantTours, getOwnerTours, updateTourStatus } from '../../lib/services';

export default function ToursView({ isOwner = false }) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingModal, setMeetingModal] = useState(null);
  const [meetingUrlInput, setMeetingUrlInput] = useState('');

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = isOwner ? await getOwnerTours() : await getTenantTours();
      setTours(data || []);
    } catch (err) {
      console.error('Error fetching tours:', err);
      toast.error('Failed to load tours');
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
      toast.error('Failed to update tour');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Completed':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Cancelled':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            {isOwner ? 'Property Tour Inquiries' : 'My Scheduled Tours'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            {isOwner ? 'Review and approve tenant walkthrough appointments' : 'Upcoming in-person and live video tour bookings'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
          <p className="text-xs text-slate-500">Loading tour schedule...</p>
        </div>
      ) : tours.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No Tours Scheduled</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {isOwner ? 'When tenants request viewing slots on your listings, they will appear here.' : 'You have not booked any property tours yet. Visit any listing to request a viewing.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((tour) => (
            <div
              key={tour._id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(tour.status)}`}>
                  {tour.status}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  {tour.tourType === 'Live Video Tour' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <MapPin className="w-3.5 h-3.5 text-emerald-500" />}
                  {tour.tourType}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {tour.propertyTitle}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> {tour.propertyLocation}
                </p>
              </div>

              {/* Date & Time Badge */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  {new Date(tour.tourDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-zinc-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {tour.tourTime}
                </span>
              </div>

              {/* Contact Info */}
              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  <strong className="text-slate-700 dark:text-zinc-300">{isOwner ? 'Tenant: ' : 'Host: '}</strong>
                  {isOwner ? `${tour.tenantName} (${tour.tenantEmail})` : tour.ownerEmail}
                </p>
                {tour.notes && (
                  <p className="italic text-slate-600 dark:text-zinc-400 line-clamp-2">
                    &ldquo;{tour.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Meeting Link if virtual */}
              {tour.meetingLink && (
                <a
                  href={tour.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  <Video className="w-3.5 h-3.5" /> Join Video Call <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                {isOwner && tour.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(tour._id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                    {tour.tourType === 'Live Video Tour' && (
                      <button
                        onClick={() => {
                          setMeetingModal(tour);
                          setMeetingUrlInput(tour.meetingLink || '');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      >
                        Set Call Link
                      </button>
                    )}
                  </>
                )}

                {tour.status !== 'Cancelled' && tour.status !== 'Completed' && (
                  <button
                    onClick={() => handleStatusChange(tour._id, 'Cancelled')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Set Call Link Modal */}
      {meetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Attach Video Call Meeting URL</h4>
            <p className="text-xs text-slate-500">Provide a Zoom, Google Meet, or Microsoft Teams URL for the tenant.</p>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={meetingUrlInput}
              onChange={(e) => setMeetingUrlInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMeetingModal(null)}
                className="px-3 py-1.5 text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(meetingModal._id, 'Confirmed', { meetingLink: meetingUrlInput })}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                Save & Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
