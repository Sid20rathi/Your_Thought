"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function PaymentModal({ onClose }: { onClose: () => void }) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(10); // Default ₹10

  const handlePayment = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Amount is in rupees, backend expects paise
      const orderRes = await fetch(`${apiUrl}/api/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amount * 100 }) 
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderRes.json();
      
      // Mock payment success for testing easily
      alert(`Razorpay checkout initiated for ₹${amount}. Order ID: ${orderData.order_id}`);
      
      // We will reload page directly to simulate successful payment hook
      window.location.reload();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="payment-modal bg-[#0D0D0D] border border-[#7C3AED]/20 rounded-md w-full max-w-[440px] p-10 shadow-[0_0_80px_rgba(124,58,237,0.12)] relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#52525B] hover:text-[#F4F4F5] transition-colors"
        >
          ✕
        </button>

        <div className="font-mono text-xs text-[#9D65FF] mb-6 tracking-widest uppercase">
          ◈ devthoughts
        </div>

        <h2 className="text-2xl font-mono text-[#F4F4F5] mb-4">Claim today's spotlight</h2>
        <p className="text-[#A1A1AA] font-ui text-sm mb-8 leading-relaxed">
          Your thought. Displayed globally.<br/>
          To every developer who opens devthoughts today.
        </p>

        <div className="w-full h-px bg-white/5 mb-6" />

        <div className="mb-8">
          <p className="font-mono text-xs text-[#52525B] uppercase tracking-wider mb-4">Choose your amount:</p>
          <div className="flex justify-between gap-3">
            {[10, 20, 50].map(val => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`flex-1 py-3 rounded-sm font-mono text-sm transition-all active:scale-95 ${
                  amount === val 
                    ? "border border-[#7C3AED] bg-[rgba(124,58,237,0.08)] text-[#9D65FF]" 
                    : "border border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:bg-white/[0.04]"
                }`}
              >
                ₹{val}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-white/5 mb-8" />

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="group w-full py-4 bg-[#7C3AED] hover:bg-[#9D65FF] text-white font-mono text-sm rounded-sm transition-all shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] disabled:opacity-50 relative overflow-hidden"
        >
          {/* Shimmer inside button */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="relative z-10">{isLoading ? "Processing..." : `Pay ₹${amount} with Razorpay`}</span>
        </button>

        <p className="text-center font-mono text-xs text-[#52525B] mt-4">
          🔒 Secured by Razorpay · INR only
        </p>
        {error && <p className="text-red-400 font-mono text-xs mt-4 text-center">{error}</p>}
      </motion.div>
    </div>
  );
}
