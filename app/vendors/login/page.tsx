import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Vendor login — Central Alabama Food Trucks",
  description: "Sign in to manage your food-truck listing.",
};

export default function VendorLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-6">
        <Link href="/" className="text-sm font-medium text-ink/50 transition hover:text-brand">
          ← Back home
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Vendor login</h1>
        <p className="mt-2 text-ink/60">Sign in to manage your listing.</p>
      </div>
      <LoginForm />
    </div>
  );
}
