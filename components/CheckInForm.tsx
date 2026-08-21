"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export default function CheckInForm({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [address, setAddress] = useState("");
  const [when, setWhen] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/checkin/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, address, when }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(data.message ?? "You're on the map!");
      setAddress("");
      setWhen("");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-2xl">
          📍
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-ink">{success}</h2>
        <p className="mt-1 text-sm text-ink/60">
          Your spot is live for anyone looking at the map.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/#locate"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            See the live map
          </Link>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Check in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="code">
            Your check-in code
          </label>
          <input
            id="code"
            className={`${inputClass} font-mono uppercase tracking-wide`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="AL-7K9Q"
            autoCapitalize="characters"
            required
          />
          <p className="mt-1 text-xs text-ink/40">
            The code you got when you listed your truck. Keep it private — it&apos;s how you
            control your spot on the map.
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="address">
            Where are you parked?
          </label>
          <input
            id="address"
            className={inputClass}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Railroad Park, Birmingham, AL"
            required
          />
          <p className="mt-1 text-xs text-ink/40">
            A landmark or full address works. Add the city + state so we can pin it.
          </p>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label className={labelClass} htmlFor="when">
              When
            </label>
            <span className="text-xs text-ink/40">Optional</span>
          </div>
          <input
            id="when"
            className={inputClass}
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="Today 11am–8pm"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Putting you on the map…" : "Put me on the map"}
      </button>
    </form>
  );
}
