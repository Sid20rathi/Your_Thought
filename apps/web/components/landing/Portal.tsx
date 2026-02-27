"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PortalProps {
  children: ReactNode;
}

export function Portal({ children }: PortalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}
