"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ThoughtCard } from "@/components/thought/ThoughtCard";
import { ThoughtEditor } from "@/components/dashboard/ThoughtEditor";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { 
  StatusBannerAvailable, 
  StatusBannerClaimed, 
  StatusBannerYours 
} from "@/components/dashboard/StatusBanners";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [currentThought, setCurrentThought] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoadingThought, setIsLoadingThought] = useState(true);

  useEffect(() => {
    async function fetchThought() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/thought/today`);
        if (res.ok) {
          const data = await res.json();
          setCurrentThought(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingThought(false);
      }
    }
    fetchThought();
  }, []);

  if (!isLoaded || isLoadingThought) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="font-mono text-sm text-[#52525B]">Loading dashboard...</div>
      </div>
    );
  }

  // Determine state logic
  const today = new Date().toISOString().split("T")[0];
  const lastPaidDate = user?.publicMetadata?.last_paid_date as string;
  const hasPaidToday = lastPaidDate === today;

  let isYours = false;
  if (currentThought && user) {
    // If the backend returns author_id which matches clerk_id, we know it's theirs
    // We didn't necessarily expose author_id in the thought payload directly before
    // Assume if they paid today and there's a thought, it probably is theirs. Next iteration: backend should return is_mine
    isYours = currentThought.author_name === user.firstName || hasPaidToday; 
  }

  const RenderBanner = () => {
    if (!currentThought) {
      if (hasPaidToday) {
        // Edge case: Paid, but hasn't posted yet
        return (
          <div className="border border-green-500/20 bg-green-500/[0.04] rounded-sm p-6 mb-8 flex gap-4 items-center">
            <span className="text-green-500 text-xl font-mono leading-none">✔</span>
            <p className="font-ui text-sm text-[#F4F4F5]">Payment verified. You own the spotlight. Post your thought below.</p>
          </div>
        );
      }
      return <StatusBannerAvailable onClaimClick={() => setShowPayment(true)} />;
    }

    if (isYours) {
      return <StatusBannerYours thoughtObj={currentThought} />;
    }

    return <StatusBannerClaimed thoughtObj={currentThought} />;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      
      {/* 1. Status Banner Header */}
      <RenderBanner />

      {/* 2. Today's Thought Preview / Skeleton */}
      <div className="w-full max-w-[640px] mb-8">
        <h4 className="font-mono text-xs text-[#52525B] uppercase tracking-widest mb-4">
          Live Preview
        </h4>
        
        {currentThought ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="-ml-8 md:ml-0 scale-95 md:scale-100 origin-top-left">
             <ThoughtCard thought={currentThought} />
          </motion.div>
        ) : (
          <div className="w-full bg-[#0D0D0D] border border-white/5 rounded-sm p-12 flex flex-col items-center justify-center relative overflow-hidden h-[300px]">
             <div className="absolute inset-0 skeleton-thought opacity-60" />
             <div className="relative z-10 w-full max-w-[80%] flex flex-col gap-4 items-center">
                <div className="h-6 w-full bg-white/5 rounded-sm" />
                <div className="h-6 w-[90%] bg-white/5 rounded-sm" />
                <div className="h-6 w-[60%] bg-white/5 rounded-sm" />
             </div>
          </div>
        )}
      </div>

      {/* 3. Post Editor (if paid and haven't posted yet) */}
      {hasPaidToday && !currentThought && (
        <ThoughtEditor />
      )}

      {/* Modals */}
      <AnimatePresence>
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      </AnimatePresence>
      
    </div>
  );
}
