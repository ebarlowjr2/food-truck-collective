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
      <div className="mb-6">
        <Link href="/" className="text-sm font-medium text-ink/50 transition hover:text-brand">
          ← Back home
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
          Put yourself on the map
        </h1>
        <p className="mt-2 text-ink/60">
          Tell customers where you&apos;re parked. Update it any time your truck moves.
        </p>
      </div>
      <CheckInForm initialCode={code ?? ""} />
    </div>
  );
}
