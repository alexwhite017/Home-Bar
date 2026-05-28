import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          What&apos;s Behind the Bar
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-amber-600">
            Matches
          </Link>
          <Link href="/bar" className="hover:text-amber-600">
            My Bar
          </Link>
        </div>
      </div>
    </nav>
  );
}
