"use client";

import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Loader2, CreditCard, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

const StripePaymentForm = ({ amount, propertyId, bookingData, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe has not loaded yet
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("renterty_token");

      // 1. Create Payment Intent on backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment via Stripe client
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: bookingData.tenantName || "Renterty Tenant",
            email: bookingData.tenantEmail
          }
        }
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment processed successfully!");
          onSuccess(result.paymentIntent.id);
        }
      }
    } catch (err) {
      setErrorMessage(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800">
        <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block mb-2">
          RESERVATION FEES (Total Rent)
        </span>
        <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
          ${amount.toLocaleString()} USD
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
          CREDIT CARD DETAILS
        </label>
        <div className="p-3 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#0f172a",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  "::placeholder": {
                    color: "#94a3b8"
                  }
                },
                invalid: {
                  color: "#ef4444"
                }
              }
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center space-x-2 border border-red-200/50">
          <ShieldAlert className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl font-bold transition text-sm disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-1.5" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              <span>Pay & Book</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
