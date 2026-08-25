import type { Metadata } from "next";
import Link from "next/link";
import CheckInForm from "@/components/CheckInForm";

export const metadata: Metadata = {
  title: "Check in — OnTheCurb",
  description: "Put your food truck on the live map. Enter your check-in code and where you're parked.",
};

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="text-sm font-medium text-ink/50 transition hover:text-brand"
      >
        ← Back home
      </Link>

      <div className="mt-8 text-center">
        <span className="drop-pin" aria-hidden>
          <span className="drop-pin__glyph">🚚</span>
        </span>
        <div className="drop-pin-ground" aria-hidden />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Vendor check-in
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Drop your pin
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-ink/60">
          Tell customers where your truck is parked right now. Update it any time you move.
        </p>
      </div>

      <div className="mt-8">
        <CheckInForm initialCode={code ?? ""} />
      </div>
    </div>
  );
}
