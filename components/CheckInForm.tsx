"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

interface LiveSpot {
  message: string;
  address: string;
  when: string;
}

export default function CheckInForm({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [address, setAddress] = useState("");
  const [when, setWhen] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [live, setLive] = useState<LiveSpot | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/checkin/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, address, when }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        geocoded?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (!data.geocoded) {
        // Saved, but we couldn't place it — keep the form so they can fix the address.
        setNotice(data.message ?? "We couldn't pin that address. Try adding a city + state.");
        return;
      }
      setLive({
        message: data.message ?? "You're on the map!",
        address: address.trim(),
        when: when.trim(),
      });
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (live) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <span className="drop-pin" aria-hidden>
          <span className="drop-pin__glyph">📍</span>
        </span>
        <div className="drop-pin-ground" aria-hidden />
        <h2 className="mt-5 text-xl font-extrabold tracking-tight text-ink">{live.message}</h2>
        <p className="mt-1 text-sm text-ink/60">
          You&apos;re parked at <span className="font-semibold text-ink">{live.address}</span>
          {live.when ? ` · ${live.when}` : ""}. Customers can find you now.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/#locate"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            See yourself on the map
          </Link>
          <button
            type="button"
            onClick={() => setLive(null)}
            className="rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Move my pin
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
      <div className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="code">
            Your check-in code
          </label>
          <input
            id="code"
            className={`${inputClass} text-center font-mono text-lg uppercase tracking-[0.25em] placeholder:tracking-normal`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="AL-7K9Q"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            required
          />
          <p className="mt-1.5 text-xs text-ink/40">
            🔒 The code you got when you listed your truck. Keep it private — it&apos;s how you
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
          <p className="mt-1.5 text-xs text-ink/40">
            A landmark or full address both work — just include the city + state so we can pin it.
          </p>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label className={labelClass} htmlFor="when">
              How long are you there?
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

      {notice && (
        <p className="mt-4 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm font-medium text-ink/80">
          {notice}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Putting you on the map…" : "Put me on the map"}
      </button>
    </form>
  );
}
