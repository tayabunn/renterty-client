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
  FileSpreadsheet,
  ChevronDown
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
    if (!title.trim() || !description.trim()) {
      toast.error('Please enter an Issue Summary and Detailed Description first to run AI diagnostics', {
        icon: 'ℹ️',
        duration: 4000
      });
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
      toast.error(err.message || 'AI preview unavailable');
    } finally {
      setAnalyzing(false);
    }
  };

  const applySampleIssue = (sampleTitle, sampleCategory, sampleDesc) => {
    setTitle(sampleTitle);
    setCategory(sampleCategory);
    setDescription(sampleDesc);
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
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="maint-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 id="maint-modal-title" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Report Maintenance Issue
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-500" /> AI Triage
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {property?.title || 'Property Maintenance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Preset Samples */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">Quick Test Examples:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applySampleIssue('Water leaking from kitchen sink pipe', 'Plumbing', 'Significant water dripping constantly under the sink cabinet, pooling on the floor since this morning.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-950/40 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
              >
                💧 Kitchen Leak
              </button>
              <button
                type="button"
                onClick={() => applySampleIssue('Sparking wall outlet in living room', 'Electrical', 'When plugging in lamps, visible sparks and a burning smell occurred. Stopped using the socket.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-950/40 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
              >
                ⚡ Sparking Outlet
              </button>
              <button
                type="button"
                onClick={() => applySampleIssue('AC blowing hot air continuously', 'HVAC / Heating', 'The central air conditioning is blowing warm air and the indoor temperature is 85°F.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-950/40 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
              >
                ❄️ AC Malfunction
              </button>
            </div>
          </div>

          {/* Category & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-1.5">
                Urgency Level
              </label>
              <div className="relative">
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="Low">Low (Convenience / Minor)</option>
                  <option value="Medium">Medium (Standard Repair)</option>
                  <option value="High">High (Impairs Living Quality)</option>
                  <option value="Emergency">Emergency (Immediate Safety/Flood Risk)</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-1.5">
              Issue Summary
            </label>
            <input
              type="text"
              placeholder="e.g., Water leaking under kitchen sink pipe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Detailed Description
              </label>
              <button
                type="button"
                onClick={handleRunAiTriage}
                disabled={analyzing}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer px-2 py-0.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/40"
              >
                <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                {analyzing ? 'Diagnosing with AI...' : 'Run AI Diagnostics'}
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Describe what happened, when it started, and if any active damage is occurring..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
            />
          </div>

          {/* AI Diagnostic Preview Card */}
          {aiPreview && (
            <div className="p-4 rounded-lg border border-teal-200/80 dark:border-teal-800/60 bg-teal-50/40 dark:bg-teal-950/20 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  AI Triage &amp; Safety Diagnostic
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                  Est. Cost: {aiPreview.estimatedCostRange}
                </span>
              </div>

              {aiPreview.isSafetyRisk && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Safety Flag: Immediate attention recommended.</span>
                </div>
              )}

              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                {aiPreview.summary}
              </p>

              {aiPreview.troubleshootingTip && (
                <div className="text-xs p-3 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex items-start gap-2 text-slate-600 dark:text-zinc-300">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Tenant DIY Advice: </span>
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
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
            >
              {loading ? 'Submitting...' : 'Dispatch Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
