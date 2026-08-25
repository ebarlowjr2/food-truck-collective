import Link from "next/link";

/** Consistent shell for legal/policy pages. */
export default function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="text-sm font-medium text-ink/50 transition hover:text-brand">
        ← Back home
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink/50">Last updated {updated}</p>
      <div className="legal mt-8">{children}</div>
    </div>
  );
}
