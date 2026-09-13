'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  Sparkles, 
  X, 
  CheckCircle2, 
  DollarSign, 
  ShieldAlert, 
  Lightbulb,
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createMaintenanceTicket, triageMaintenancePreview } from '../../lib/services';

const CATEGORIES = [
  'Plumbing', 
  'Electrical', 
  'HVAC / Heating', 
  'Appliance', 
  'Structural / Doors & Windows', 
  'Pest Control', 
  'Safety / Lock', 
  'Other'
];

export default function MaintenanceRequestModal({ isOpen, onClose, property, onSuccess }) {
  const [category, setCategory] = useState('Plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);

  if (!isOpen) return null;

  const handleRunAiTriage = async () => {
    if (!title || !description) {
      toast.error('Please enter a title and description first');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await triageMaintenancePreview({ title, description, category });
      setAiPreview(res.triaging);
      if (res.triaging?.suggestedUrgency) {
        setUrgency(res.triaging.suggestedUrgency);
      }
      if (res.triaging?.suggestedCategory) {
        setCategory(res.triaging.suggestedCategory);
      }
      toast.success('AI Diagnostics Completed!');
    } catch (err) {
      toast.error('AI preview unavailable');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in title and description');
      return;
    }

    setLoading(true);
    try {
      await createMaintenanceTicket({
        propertyId: property?._id,
        category,
        title,
        description,
        urgency
      });
      toast.success('Maintenance ticket submitted!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="maint-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 id="maint-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Report Maintenance Issue
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Triage
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {property?.title || 'Property Maintenance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Category & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Low">Low (Convenience / Minor)</option>
                <option value="Medium">Medium (Standard Repair)</option>
                <option value="High">High (Impairs Living Quality)</option>
                <option value="Emergency">Emergency (Immediate Safety/Flood Risk)</option>
              </select>
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Issue Summary
            </label>
            <input
              type="text"
              placeholder="e.g., Water leaking under kitchen sink pipe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Detailed Description
              </label>
              <button
                type="button"
                onClick={handleRunAiTriage}
                disabled={analyzing || !title || !description}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 disabled:opacity-40 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {analyzing ? 'Diagnosing...' : 'Run AI Diagnostics'}
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Describe what happened, when it started, and if any active damage is occurring..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* AI Diagnostic Preview Card */}
          {aiPreview && (
            <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  AI Triage & Safety Diagnostic
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                  Est. Cost: {aiPreview.estimatedCostRange}
                </span>
              </div>

              {aiPreview.isSafetyRisk && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Safety Flag: Immediate attention recommended.</span>
                </div>
              )}

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {aiPreview.summary}
              </p>

              {aiPreview.troubleshootingTip && (
                <div className="text-xs p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Tenant DIY Advice: </span>
                    {aiPreview.troubleshootingTip}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md hover:shadow-emerald-600/20"
            >
              {loading ? 'Submitting...' : 'Dispatch Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
