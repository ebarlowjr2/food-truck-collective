import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VendorDashboard, { type DashboardVendor, type DashboardCheckIn } from "@/components/VendorDashboard";

export const metadata: Metadata = {
  title: "Your dashboard — OnTheCurb",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/vendors/login");
  }

  const { data: vendorRow } = await supabase.rpc("get_my_vendor", {});

  // Signed in, but no listing linked to this account.
  if (!vendorRow) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">No listing yet</h1>
        <p className="mt-2 text-ink/60">
          This account isn&apos;t linked to a truck. List your truck to get started.
        </p>
        <Link
          href="/vendors/join"
          className="mt-6 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          List your truck
        </Link>
      </div>
    );
  }

  const { data: checkInRows } = await supabase
    .from("check_ins")
    .select("address, when_text, geocoded, received_at")
    .eq("check_in_id", vendorRow.check_in_id)
    .order("received_at", { ascending: false })
    .limit(6);

  const vendor: DashboardVendor = {
    id: vendorRow.id,
    checkInId: vendorRow.check_in_id,
    ownerName: vendorRow.owner_name,
    businessName: vendorRow.business_name,
    vendorType: vendorRow.vendor_type,
    cuisine: vendorRow.cuisine,
    description: vendorRow.description,
    phone: vendorRow.phone,
    menuUrl: vendorRow.menu_url,
    website: vendorRow.website,
    facebook: vendorRow.facebook,
    instagram: vendorRow.instagram,
    x: vendorRow.x,
    wantsFreeWebsite: vendorRow.wants_free_website,
  };

  const checkIns: DashboardCheckIn[] = (checkInRows ?? []).map((c) => ({
    address: c.address,
    when: c.when_text,
    geocoded: c.geocoded,
    receivedAt: c.received_at,
  }));

  return <VendorDashboard vendor={vendor} checkIns={checkIns} />;
}
