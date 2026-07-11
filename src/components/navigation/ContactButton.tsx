import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContactButtonProps {
  className?: string;
}

export function ContactButton({ className }: ContactButtonProps) {
  return (
    <Link
      href="/#contact"
      className={cn(
        "relative flex items-center justify-center rounded-full px-6 py-2.5",
        "bg-white/20 dark:bg-white/10",
        "border border-white/30",
        "text-sm font-semibold text-neutral-900 dark:text-white",
        "transition-all duration-300",
        "hover:bg-white/30 dark:hover:bg-white/20",
        "shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      Contact
    </Link>
  );
}
