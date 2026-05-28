import Link from "next/link";

export function Nav() {
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
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
          >
            Matches
          </Link>
          <Link
            href="/bar"
            className="rounded-full px-3 py-1.5 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
          >
            My Bar
          </Link>
        </div>
      </div>
    </nav>
  );
}
