"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { VendorType } from "@/lib/types";

export interface DashboardVendor {
  id: string;
  checkInId: string;
  ownerName: string;
  businessName: string;
  vendorType: VendorType;
  cuisine: string;
  description: string | null;
  phone: string;
  menuUrl: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  x: string | null;
  wantsFreeWebsite: boolean;
}

export interface DashboardCheckIn {
  address: string;
  when: string | null;
  geocoded: boolean;
  receivedAt: string;
}

const VENDOR_TYPES: { value: VendorType; label: string }[] = [
  { value: "truck", label: "Food truck" },
  { value: "trailer", label: "Trailer" },
  { value: "table", label: "Table / stand" },
  { value: "tent", label: "Tent / pop-up" },
];

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const cardClass = "rounded-2xl border border-black/10 bg-white p-6 shadow-sm";

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function VendorDashboard({
  vendor,
  checkIns,
}: {
  vendor: DashboardVendor;
  checkIns: DashboardCheckIn[];
}) {
  const [form, setForm] = useState({
    businessName: vendor.businessName,
    vendorType: vendor.vendorType,
    cuisine: vendor.cuisine,
    description: vendor.description ?? "",
    phone: vendor.phone,
    website: vendor.website ?? "",
    facebook: vendor.facebook ?? "",
    instagram: vendor.instagram ?? "",
    x: vendor.x ?? "",
    wantsFreeWebsite: vendor.wantsFreeWebsite,
  });
  const [menuUrl, setMenuUrl] = useState(vendor.menuUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuBusy, setMenuBusy] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function saveListing(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const supabase = createClient();
      const { error: updErr } = await supabase
        .from("vendors")
        .update({
          business_name: form.businessName.trim(),
          vendor_type: form.vendorType,
          cuisine: form.cuisine.trim(),
          description: form.description.trim() || null,
          phone: form.phone.trim(),
          website: form.website.trim() || null,
          facebook: form.facebook.trim() || null,
          instagram: form.instagram.trim() || null,
          x: form.x.trim() || null,
          wants_free_website: form.wantsFreeWebsite,
        })
        .eq("id", vendor.id);
      if (updErr) {
        setError(updErr.message);
        return;
      }
      setSaved(true);
    } catch {
      setError("Couldn't save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function replaceMenu(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMenuBusy(true);
    setMenuError(null);
    try {
      const supabase = createClient();
      const path = `${vendor.checkInId}/menu-${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("menus")
        .upload(path, file, { contentType: "application/pdf", upsert: false });
      if (upErr) {
        setMenuError(upErr.message);
        return;
      }
      const publicUrl = supabase.storage.from("menus").getPublicUrl(path).data.publicUrl;
      const { error: updErr } = await supabase
        .from("vendors")
        .update({ menu_url: publicUrl })
        .eq("id", vendor.id);
      if (updErr) {
        setMenuError(updErr.message);
        return;
      }
      setMenuUrl(publicUrl);
    } catch {
      setMenuError("Couldn't upload the menu. Try again.");
    } finally {
      setMenuBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="text-sm font-medium text-ink/50">Welcome back{vendor.ownerName ? `, ${vendor.ownerName}` : ""}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {vendor.businessName}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {/* Left column: check-in + history */}
        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand">
              Your check-in code
            </div>
            <div className="mt-1 font-mono text-3xl font-extrabold tracking-tight text-ink">
              {vendor.checkInId}
            </div>
            <p className="mt-2 text-xs text-ink/50">
              🔒 Keep it private — anyone with it can set your spot on the map.
            </p>
            <Link
              href={`/checkin?code=${vendor.checkInId}`}
              className="mt-4 inline-block w-full rounded-full bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              📍 Check in now
            </Link>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-bold text-ink">Recent check-ins</h2>
            {checkIns.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">
                No check-ins yet. Hit “Check in now” to put yourself on the map.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {checkIns.map((c, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">{c.address}</span>
                      <span className="text-xs text-ink/50">
                        {c.when ? `${c.when} · ` : ""}
                        {c.geocoded ? "on the map" : "not pinned"}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-ink/40">{timeAgo(c.receivedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right column: edit listing + menu */}
        <div className="flex flex-col gap-6">
          <form onSubmit={saveListing} className={cardClass}>
            <h2 className="text-lg font-extrabold tracking-tight text-ink">Your listing</h2>
            <p className="mt-1 text-sm text-ink/60">This is what customers see on the map and in the directory.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={labelClass} htmlFor="businessName">Business name</label>
                <input id="businessName" className={inputClass} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="vendorType">Rig type</label>
                  <select id="vendorType" className={inputClass} value={form.vendorType} onChange={(e) => set("vendorType", e.target.value as VendorType)}>
                    {VENDOR_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="cuisine">Cuisine</label>
                  <input id="cuisine" className={inputClass} value={form.cuisine} onChange={(e) => set("cuisine", e.target.value)} required />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="description">Short description</label>
                <textarea id="description" className={`${inputClass} min-h-24 resize-y`} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">Phone</label>
                <input id="phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
              </div>
              <div>
                <label className={labelClass} htmlFor="website">Website</label>
                <input id="website" type="url" className={inputClass} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="facebook">Facebook</label>
                  <input id="facebook" className={inputClass} value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="facebook.com/…" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="instagram">Instagram</label>
                  <input id="instagram" className={inputClass} value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@yourtruck" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="x">X (Twitter)</label>
                  <input id="x" className={inputClass} value={form.x} onChange={(e) => set("x", e.target.value)} placeholder="@yourtruck" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              {saved && <span className="text-sm font-medium text-emerald-600">✓ Saved</span>}
              {error && <span className="text-sm font-medium text-red-600">{error}</span>}
            </div>
          </form>

          <div className={cardClass}>
            <h2 className="text-lg font-extrabold tracking-tight text-ink">Menu</h2>
            <p className="mt-1 text-sm text-ink/60">A PDF menu shows on your truck&apos;s profile.</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {menuUrl ? (
                <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand hover:underline">
                  📄 View current menu
                </a>
              ) : (
                <span className="text-sm text-ink/50">No menu uploaded yet.</span>
              )}
              <label className="cursor-pointer rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand">
                {menuBusy ? "Uploading…" : menuUrl ? "Replace menu" : "Upload menu"}
                <input type="file" accept="application/pdf" className="hidden" onChange={replaceMenu} disabled={menuBusy} />
              </label>
            </div>
            {menuError && <p className="mt-3 text-sm font-medium text-red-600">{menuError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
