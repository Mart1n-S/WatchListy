"use client";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animation";

export function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br ${gradient} backdrop-blur-sm`}
    >
      <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-xl bg-white dark:bg-gray-800 shadow-md">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </motion.div>
  );
}
