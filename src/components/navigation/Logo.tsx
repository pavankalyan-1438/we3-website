import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={cn(
        "flex items-center justify-center px-4 py-2 rounded-full",
        "transition-colors hover:bg-white/5",
        className
      )}
    >
      <span className="font-display text-lg font-bold tracking-tight text-neutral-800 dark:text-white">
        WE3
      </span>
    </Link>
  );
}
