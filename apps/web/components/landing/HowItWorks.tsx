"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "1",
    title: "Sign in with GitHub or Google",
    desc: "One tap. Zero friction.",
    sub: ""
  },
  {
    num: "2",
    title: "Pay ₹10–₹50 securely via Razorpay",
    desc: "Fast & safe.",
    sub: "INR only."
  },
  {
    num: "3",
    title: "Post your thought for the day",
    desc: "Your words.",
    sub: "World's screen."
  }
];

export function HowItWorks() {
  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-12 relative">
        
        {/* Connector Line (Desktop only) */}
        <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-[#7C3AED]/20 z-0">
          <motion.div 
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            className="w-full h-full bg-gradient-to-r from-transparent via-[#7C3AED]/40 to-transparent"
          />
        </div>

        {steps.map((step, index) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 bg-[#0D0D0D] border border-white/5 p-8 rounded-sm text-center relative z-10 hover:border-white/10 hover:bg-[#111111] transition-colors"
          >
            <div className="w-10 h-10 mx-auto border border-[#7C3AED]/40 bg-[rgba(124,58,237,0.08)] text-[#9D65FF] flex items-center justify-center rounded-sm font-mono text-base mb-6">
              {step.num}
            </div>
            <h4 className="font-mono text-base text-[#F4F4F5] mb-4 text-balance px-4 leading-relaxed">
              {step.title}
            </h4>
            <div className="font-ui text-sm text-[#A1A1AA] flex flex-col gap-1">
              <span>{step.desc}</span>
              {step.sub && <span>{step.sub}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
