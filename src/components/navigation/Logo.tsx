import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/">
      <motion.div
        className={cn(
          "flex items-center justify-center px-4 py-2 rounded-full",
          "transition-colors hover:bg-white/10",
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <span className="font-display text-lg font-bold tracking-tight text-neutral-800 dark:text-white">
          WE3
        </span>
      </motion.div>
    </Link>
  );
}
