"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { generateCheckInId } from "@/lib/id";
import type { VendorType } from "@/lib/types";

type StepId = "account" | "rig" | "menu" | "links";

const STEPS: { id: StepId; label: string; hint: string }[] = [
  { id: "account", label: "Create account", hint: "Your login" },
  { id: "rig", label: "Your rig", hint: "Truck details" },
  { id: "menu", label: "Menu", hint: "Upload a PDF" },
  { id: "links", label: "Contact & links", hint: "How to reach you" },
];

const VENDOR_TYPES: { value: VendorType; label: string; emoji: string }[] = [
  { value: "truck", label: "Food truck", emoji: "🚚" },
  { value: "trailer", label: "Trailer", emoji: "🚛" },
  { value: "table", label: "Table / stand", emoji: "🪑" },
  { value: "tent", label: "Tent / pop-up", emoji: "⛺" },
];

interface FormState {
  ownerName: string;
  email: string;
  password: string;
  businessName: string;
  vendorType: VendorType | "";
  cuisine: string;
  description: string;
  menuFileName: string;
  phone: string;
  website: string;
  wantsFreeWebsite: boolean;
  facebook: string;
  instagram: string;
  x: string;
}

const EMPTY: FormState = {
  ownerName: "",
  email: "",
  password: "",
  businessName: "",
  vendorType: "",
  cuisine: "",
  description: "",
  menuFileName: "",
  phone: "",
  website: "",
  wantsFreeWebsite: false,
  facebook: "",
  instagram: "",
  x: "",
};

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

function validate(step: StepId, f: FormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === "account") {
    if (!f.ownerName.trim()) e.ownerName = "Tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email.";
    if (f.password.length < 6) e.password = "At least 6 characters.";
  }
  if (step === "rig") {
    if (!f.businessName.trim()) e.businessName = "Your truck needs a name.";
    if (!f.vendorType) e.vendorType = "Pick what you serve from.";
    if (!f.cuisine.trim()) e.cuisine = "What kind of food?";
  }
  if (step === "links") {
    if (!/\d{7,}/.test(f.phone.replace(/\D/g, ""))) e.phone = "Enter a valid phone number.";
  }
  return e;
}

export default function VendorOnboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    // The code we show the vendor; a DB trigger creates the listing with it on
    // signup (regenerating only on the rare collision).
    const code = generateCheckInId();
    try {
      const supabase = createClient();

      // Upload the menu PDF first (anonymous → public bucket), so its URL can
      // ride along in the signup metadata and land on the vendor row.
      let menuUrl = "";
      if (menuFile) {
        const path = `${code}/menu.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("menus")
          .upload(path, menuFile, { contentType: "application/pdf", upsert: false });
        if (uploadError) {
          setSubmitError(`Menu upload failed: ${uploadError.message}`);
          return;
        }
        menuUrl = supabase.storage.from("menus").getPublicUrl(path).data.publicUrl;
      }

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            check_in_id: code,
            menu_url: menuUrl,
            owner_name: form.ownerName,
            business_name: form.businessName,
            vendor_type: form.vendorType,
            cuisine: form.cuisine,
            description: form.description,
            phone: form.phone,
            website: form.website,
            wants_free_website: form.wantsFreeWebsite,
            facebook: form.facebook,
            instagram: form.instagram,
            x: form.x,
          },
        },
      });
      if (error) {
        setSubmitError(error.message);
        return;
      }
      setCheckInId(code);
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    const e = validate(step.id, form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (isLast) {
      void submit();
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function back() {
    setErrors({});
    setStepIndex((i) => Math.max(0, i - 1));
  }

  if (checkInId) {
    return <SuccessScreen form={form} checkInId={checkInId} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Checklist sidebar */}
      <aside className="lg:pt-2">
        <ol className="flex gap-3 overflow-x-auto lg:flex-col lg:gap-1">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <li key={s.id} className="flex shrink-0 items-center gap-3 py-2 lg:shrink">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-brand text-white"
                        : "bg-black/5 text-ink/40"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="leading-tight">
                  <span
                    className={`block text-sm font-semibold ${
                      active ? "text-ink" : "text-ink/60"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="hidden text-xs text-ink/40 lg:block">{s.hint}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Step body */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        {step.id === "account" && (
          <div className="space-y-4">
            <StepHeader title="Create your vendor account" subtitle="You'll use this to manage your listing and hours." />
            <Field label="Your name" error={errors.ownerName}>
              <input
                className={inputClass}
                value={form.ownerName}
                onChange={(e) => set("ownerName", e.target.value)}
                placeholder="Jordan Rivera"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                className={inputClass}
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@yourtruck.com"
              />
            </Field>
            <Field label="Password" error={errors.password}>
              <input
                className={inputClass}
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="At least 6 characters"
              />
            </Field>
          </div>
        )}

        {step.id === "rig" && (
          <div className="space-y-4">
            <StepHeader title="Tell us about your rig" subtitle="This is what customers see on the map and in the directory." />
            <Field label="Business name" error={errors.businessName}>
              <input
                className={inputClass}
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                placeholder="Magic City Tacos"
              />
            </Field>
            <Field label="What do you serve from?" error={errors.vendorType}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {VENDOR_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("vendorType", t.value)}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-medium transition ${
                      form.vendorType === t.value
                        ? "border-brand bg-brand/5 text-ink"
                        : "border-black/10 bg-white text-ink/70 hover:border-brand/40"
                    }`}
                  >
                    <span className="text-2xl" aria-hidden>
                      {t.emoji}
                    </span>
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Cuisine" error={errors.cuisine}>
              <input
                className={inputClass}
                value={form.cuisine}
                onChange={(e) => set("cuisine", e.target.value)}
                placeholder="Mexican / Street Tacos"
              />
            </Field>
            <Field label="Short description" hint="Optional">
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Slow-braised birria and mesquite-grilled al pastor…"
              />
            </Field>
          </div>
        )}

        {step.id === "menu" && (
          <div className="space-y-4">
            <StepHeader title="Upload your menu" subtitle="A PDF menu shows up on your truck's profile. You can skip and add it later." />
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/15 bg-cream/60 px-6 py-10 text-center transition hover:border-brand/50">
              <span className="text-3xl" aria-hidden>
                📄
              </span>
              {form.menuFileName ? (
                <span className="font-semibold text-ink">{form.menuFileName}</span>
              ) : (
                <>
                  <span className="font-semibold text-ink">Choose a PDF menu</span>
                  <span className="text-sm text-ink/50">PDF up to ~10 MB</span>
                </>
              )}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setMenuFile(file);
                  set("menuFileName", file?.name ?? "");
                }}
              />
            </label>
            {form.menuFileName && (
              <button
                type="button"
                onClick={() => {
                  setMenuFile(null);
                  set("menuFileName", "");
                }}
                className="text-sm font-medium text-brand hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        )}

        {step.id === "links" && (
          <div className="space-y-4">
            <StepHeader title="How can people reach you?" subtitle="A phone number is required. Everything else is optional." />
            <Field label="Phone number" error={errors.phone}>
              <input
                className={inputClass}
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(205) 555-0142"
              />
            </Field>
            <Field label="Website" hint="Optional">
              <input
                className={inputClass}
                type="url"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://yourtruck.com"
              />
            </Field>

            {form.website.trim() === "" && (
              <label className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-brand"
                  checked={form.wantsFreeWebsite}
                  onChange={(e) => set("wantsFreeWebsite", e.target.checked)}
                />
                <span className="text-sm">
                  <span className="font-semibold text-ink">No website? We&apos;ll build you one — free.</span>
                  <span className="mt-0.5 block text-ink/60">
                    Check this and the collective will reach out to set up a simple site for your truck at no cost.
                  </span>
                </span>
              </label>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Facebook" hint="Optional">
                <input
                  className={inputClass}
                  value={form.facebook}
                  onChange={(e) => set("facebook", e.target.value)}
                  placeholder="facebook.com/…"
                />
              </Field>
              <Field label="Instagram" hint="Optional">
                <input
                  className={inputClass}
                  value={form.instagram}
                  onChange={(e) => set("instagram", e.target.value)}
                  placeholder="@yourtruck"
                />
              </Field>
              <Field label="X (Twitter)" hint="Optional">
                <input
                  className={inputClass}
                  value={form.x}
                  onChange={(e) => set("x", e.target.value)}
                  placeholder="@yourtruck"
                />
              </Field>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink/60 transition enabled:hover:text-ink disabled:opacity-0"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={submitting}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLast ? (submitting ? "Creating your listing…" : "Finish & get my ID") : "Continue"}
          </button>
        </div>
        {submitError && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </p>
        )}
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-extrabold tracking-tight text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className={labelClass}>{label}</label>
        {hint && <span className="text-xs text-ink/40">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function SuccessScreen({ form, checkInId }: { form: FormState; checkInId: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">
        🎉
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight text-ink">
        {form.businessName || "Your truck"} is in!
      </h2>
      <p className="mt-2 text-ink/60">
        Your listing is created. Here&apos;s the check-in ID your truck uses to place itself
        on the live map.
      </p>

      <div className="mt-4 rounded-2xl border border-brand/20 bg-white p-4 text-left text-sm">
        <span className="font-semibold text-ink">📧 One more step — confirm your email.</span>{" "}
        <span className="text-ink/60">
          We sent a confirmation link to <span className="font-medium text-ink">{form.email}</span>.
          Click it to activate your account and sign in.
        </span>
      </div>

      {/* Check-in ID */}
      <div className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand">
          Your check-in ID
        </div>
        <div className="mt-1 font-mono text-4xl font-extrabold tracking-tight text-ink">
          {checkInId}
        </div>
        <p className="mt-2 text-xs text-ink/50">
          🔒 Keep this private — anyone with your code can set your truck&apos;s spot on the map.
        </p>
      </div>

      {/* Web check-in */}
      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6 text-left">
        <h3 className="font-bold text-ink">📍 Put yourself on the map</h3>
        <p className="mt-1 text-sm text-ink/60">
          When you know where you&apos;ll be parked, check in with your code and address. It
          takes a few seconds, and you can update it any time your truck moves.
        </p>
        <Link
          href={`/checkin?code=${checkInId}`}
          className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Check in now →
        </Link>
        <p className="mt-3 text-xs text-ink/40">
          Texting your spot is coming soon — for now, check in here on the web.
        </p>
      </div>

      {form.wantsFreeWebsite && (
        <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-left text-sm">
          <span className="font-semibold text-ink">✅ Free website requested.</span>{" "}
          <span className="text-ink/60">The collective will reach out to {form.email}.</span>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/#locate"
          className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          See the live map
        </Link>
        <Link
          href="/"
          className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
