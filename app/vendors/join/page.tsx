import type { Metadata } from "next";
import Link from "next/link";
import VendorOnboarding from "@/components/VendorOnboarding";

export const metadata: Metadata = {
  title: "List your truck — OnTheCurb",
  description:
    "Join the central Alabama food-truck collective. Add your truck, upload a menu, and get a check-in ID to place yourself on the live map by text.",
};

export default function VendorJoinPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium text-ink/50 transition hover:text-brand">
          ← Back home
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          List your truck
        </h1>
        <p className="mt-2 max-w-2xl text-ink/60">
          Four quick steps to join the collective, get found on the live map, and start
          checking in your location by text.
        </p>
      </div>
      <VendorOnboarding />
    </div>
  );
}
