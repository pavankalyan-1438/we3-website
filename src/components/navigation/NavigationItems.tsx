import Link from "next/link";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
];

export function NavigationItems() {
  return (
    <div className="flex items-center gap-1 px-4">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium",
            "text-neutral-700 dark:text-neutral-200",
            "transition-all duration-300",
            "hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
