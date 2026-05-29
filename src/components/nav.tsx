"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Matches" },
  { href: "/bar", label: "My Bar" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl italic tracking-tight text-amber-700 dark:text-amber-500"
        >
          Behind the Bar
        </Link>
        <div className="flex gap-1 text-sm font-medium">
          {LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "rounded-full bg-amber-100 px-3 py-1.5 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
                    : "rounded-full px-3 py-1.5 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
