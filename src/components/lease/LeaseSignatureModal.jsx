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
  Sparkles,
  Type,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createLease, getLeaseForProperty, signLease, getLeasePdfDownloadUrl } from '../../lib/services';

const SIGNATURE_FONTS = [
  { id: 0, name: "Classic Script", fontStyle: 'italic bold 42px "Brush Script MT", "Dancing Script", "Caveat", cursive', cssClass: 'font-serif italic text-3xl font-bold tracking-wide' },
  { id: 1, name: "Modern Calligraphy", fontStyle: 'italic 44px "Segoe Script", "Great Vibes", "Allura", cursive', cssClass: 'italic text-3xl font-normal tracking-wider' },
  { id: 2, name: "Formal Signature", fontStyle: 'italic bold 36px "Snell Roundhand", "Sacramento", "Lucida Handwriting", cursive', cssClass: 'font-mono italic text-2xl font-bold tracking-widest' },
];

export default function LeaseSignatureModal({ isOpen, onClose, property, user }) {
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Signature Mode: 'type' | 'draw'
  const [signatureMode, setSignatureMode] = useState('type');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(0);

  // Canvas Drawing States
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setTypedName(user.name);
    }
  }, [user]);

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

  const generateTypedSignatureDataUrl = (name, fontIndex) => {
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 600;
    textCanvas.height = 130;
    const ctx = textCanvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 130);
    
    const fontDef = SIGNATURE_FONTS[fontIndex] || SIGNATURE_FONTS[0];
    ctx.font = fontDef.fontStyle;
    ctx.fillStyle = '#059669';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.trim(), 300, 65);
    
    // Security underline
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 105);
    ctx.lineTo(480, 105);
    ctx.stroke();

    return textCanvas.toDataURL('image/png');
  };

  const handleSignLease = async () => {
    if (signatureMode === 'draw' && !hasDrawn) {
      toast.error('Please draw your signature or switch to "Type Legal Name"');
      return;
    }
    if (signatureMode === 'type' && !typedName.trim()) {
      toast.error('Please enter your full legal name to sign');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please agree to the lease terms and conditions');
      return;
    }

    setSigning(true);
    try {
      let signatureDataUrl;
      if (signatureMode === 'draw') {
        const canvas = canvasRef.current;
        signatureDataUrl = canvas.toDataURL('image/png');
      } else {
        signatureDataUrl = generateTypedSignatureDataUrl(typedName, selectedFont);
      }

      const res = await signLease(lease._id, signatureDataUrl);
      setLease(res.lease);
      toast.success('Lease agreement digitally signed & verified!');
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

  const isReadyToSign = termsAccepted && (
    (signatureMode === 'draw' && hasDrawn) || 
    (signatureMode === 'type' && typedName.trim().length > 0)
  );

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

              {/* Interactive E-Signature Pad & Alternatives (If not signed yet) */}
              {!isSignedByCurrent && (
                <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-4">
                  
                  {/* Signature Mode Switcher Tabs */}
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                    <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs">
                      <button
                        type="button"
                        onClick={() => setSignatureMode('type')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          signatureMode === 'type'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" />
                        Type Full Name (Easy)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignatureMode('draw')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          signatureMode === 'draw'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        Draw with Mouse/Touch
                      </button>
                    </div>

                    {signatureMode === 'draw' && (
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Clear Pad
                      </button>
                    )}
                  </div>

                  {/* Option 1: Type Legal Name (Generates Beautiful Digital Cursive Signature) */}
                  {signatureMode === 'type' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Your Full Legal Name
                        </label>
                        <input
                          type="text"
                          value={typedName}
                          onChange={(e) => setTypedName(e.target.value)}
                          placeholder="e.g. Tayabun Nesa Jannat"
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>

                      {/* Live Generated Signature Preview Box */}
                      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-700 p-4 text-center shadow-inner relative overflow-hidden min-h-[90px] flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider absolute top-2 left-3">
                          Signature Preview
                        </span>
                        <div className="my-2">
                          <p className={`text-emerald-600 dark:text-emerald-400 select-none ${SIGNATURE_FONTS[selectedFont].cssClass}`}>
                            {typedName.trim() || 'Your Signature Here'}
                          </p>
                          <div className="h-0.5 w-48 bg-emerald-400/40 mx-auto mt-1 rounded-full"></div>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Digital E-Signature Stamp
                        </span>
                      </div>

                      {/* Font Style Choice */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-slate-500 font-medium">Style:</span>
                        <div className="flex gap-2">
                          {SIGNATURE_FONTS.map((font) => (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => setSelectedFont(font.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                selectedFont === font.id
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                              }`}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Option 2: Canvas Drawing Pad */
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
                  )}

                  {/* Legal acknowledgment checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I certify that typing or drawing my name constitutes my legal electronic signature under the Electronic Signatures in Global and National Commerce Act (E-SIGN) and Uniform Electronic Transactions Act (UETA).
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                disabled={signing || !isReadyToSign}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
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
