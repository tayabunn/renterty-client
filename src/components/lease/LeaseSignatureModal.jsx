'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  PenTool, 
  CheckCircle2, 
  Download, 
  X, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createLease, getLeaseForProperty, signLease, getLeasePdfDownloadUrl } from '../../lib/services';

export default function LeaseSignatureModal({ isOpen, onClose, property, user }) {
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (!isOpen || !property?._id) return;

    const fetchOrCreateLease = async () => {
      setLoading(true);
      try {
        let existing = await getLeaseForProperty(property._id);
        if (!existing) {
          // Auto generate lease draft
          const res = await createLease({
            propertyId: property._id,
            tenantId: user?.id,
            tenantName: user?.name,
            tenantEmail: user?.email,
            monthlyRent: property.rent,
            securityDeposit: property.rent,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString()
          });
          existing = res.lease;
        }
        setLease(existing);
      } catch (err) {
        console.error('Error fetching lease:', err);
        toast.error('Failed to load lease document');
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateLease();
  }, [isOpen, property?._id, user]);

  // Canvas Drawing Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#059669';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSignLease = async () => {
    if (!hasDrawn) {
      toast.error('Please sign on the canvas pad before submitting');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please agree to the lease terms and conditions');
      return;
    }

    setSigning(true);
    try {
      const canvas = canvasRef.current;
      const signatureDataUrl = canvas.toDataURL('image/png');
      const res = await signLease(lease._id, signatureDataUrl);
      setLease(res.lease);
      toast.success('Lease agreement digitally signed!');
    } catch (err) {
      toast.error(err.message || 'Failed to sign lease');
    } finally {
      setSigning(false);
    }
  };

  if (!isOpen) return null;

  const isSignedByCurrent = user?.role === 'Owner' 
    ? !!lease?.landlordSignature?.signedAt 
    : !!lease?.tenantSignature?.signedAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lease-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 id="lease-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Digital Residential Lease
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> E-Signature Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {property?.title} — Certified Legal Tenancy Contract
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-3"></div>
              <p className="text-xs text-slate-500">Preparing customized lease document...</p>
            </div>
          ) : (
            <>
              {/* Document Overview Card */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Monthly Rent</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    ${lease?.monthlyRent?.toLocaleString()}/mo
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Security Deposit</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    ${lease?.securityDeposit?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Start Date</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {lease?.startDate ? new Date(lease.startDate).toLocaleDateString() : 'Immediate'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Status</span>
                  <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
                    lease?.status === 'Signed' 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  }`}>
                    {lease?.status === 'Signed' ? 'Fully Executed' : 'Awaiting Signatures'}
                  </span>
                </div>
              </div>

              {/* Lease Agreement Clauses */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Standard Terms & Tenancy Obligations
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {lease?.terms?.map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">{index + 1}.</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signatures Status Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tenant Signature</span>
                    {lease?.tenantSignature?.signedAt ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {lease?.tenantSignature?.signedAt 
                      ? `Signed on ${new Date(lease.tenantSignature.signedAt).toLocaleDateString()}` 
                      : `${lease?.tenantName || 'Tenant'} has not signed yet`}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Landlord Signature</span>
                    {lease?.landlordSignature?.signedAt ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {lease?.landlordSignature?.signedAt 
                      ? `Signed on ${new Date(lease.landlordSignature.signedAt).toLocaleDateString()}` 
                      : `${lease?.landlordName || 'Owner'} has not signed yet`}
                  </p>
                </div>
              </div>

              {/* Interactive E-Signature Pad (If not signed yet) */}
              {!isSignedByCurrent && (
                <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Draw Your E-Signature Below
                      </h4>
                    </div>
                    <button
                      onClick={clearSignature}
                      className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 font-medium transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear Pad
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner overflow-hidden cursor-crosshair">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={120}
                      className="w-full h-[120px] touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I understand that this digital signature is legally binding under the Electronic Signatures in Global and National Commerce Act (E-SIGN).
                    </span>
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          {lease?._id && (
            <a
              href={getLeasePdfDownloadUrl(lease._id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download Official PDF
            </a>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            {!isSignedByCurrent && (
              <button
                onClick={handleSignLease}
                disabled={signing || !hasDrawn || !termsAccepted}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md hover:shadow-emerald-600/20"
              >
                {signing ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                    Signing...
                  </>
                ) : (
                  <>
                    <PenTool className="w-3.5 h-3.5" />
                    Submit Legal E-Signature
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
