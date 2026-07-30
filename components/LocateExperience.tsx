"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { LiveTruck } from "@/lib/live";
import { getLiveStatus } from "@/lib/live";

// Leaflet touches `window` on import, so the map is client-only.
const TruckMap = dynamic(() => import("./TruckMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-cream text-sm text-ink/50">
      Loading map…
    </div>
  ),
});

type Filter = "all" | "live";

export default function LocateExperience({ trucks }: { trucks: LiveTruck[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const decorated = useMemo(
    () =>
      trucks
        .map((t) => ({ truck: t, status: getLiveStatus(t) }))
        .sort((a, b) => Number(b.status.open) - Number(a.status.open)),
    [trucks]
  );

  const visible = useMemo(
    () => (filter === "live" ? decorated.filter((d) => d.status.open) : decorated),
    [decorated, filter]
  );

  const liveCount = decorated.filter((d) => d.status.open).length;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* Map */}
      <div className="relative order-2 h-[420px] overflow-hidden rounded-2xl border border-black/10 shadow-sm sm:h-[560px] lg:order-1 lg:h-[640px]">
        <TruckMap trucks={trucks} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* Truck list */}
      <div className="order-1 flex flex-col lg:order-2 lg:h-[640px]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="inline-flex rounded-full border border-black/10 bg-white p-1 text-sm font-medium shadow-sm">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1 transition ${
                filter === "all" ? "bg-brand text-white" : "text-ink/70"
              }`}
            >
              All {trucks.length}
            </button>
            <button
              onClick={() => setFilter("live")}
              className={`rounded-full px-3 py-1 transition ${
                filter === "live" ? "bg-brand text-white" : "text-ink/70"
              }`}
            >
              Live now {liveCount}
            </button>
          </div>
        </div>

        <ul className="flex flex-col gap-2 overflow-y-auto pr-1 lg:min-h-0 lg:flex-1">
          {visible.map(({ truck, status }) => {
            const active = truck.id === selectedId;
            return (
              <li key={truck.id}>
                <button
                  onClick={() => setSelectedId(truck.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-brand bg-brand/5 shadow-sm"
                      : "border-black/10 bg-white hover:border-brand/40 hover:shadow-sm"
                  }`}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl"
                    style={{ backgroundColor: `${truck.color}1a` }}
                    aria-hidden
                  >
                    {truck.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold text-ink">{truck.name}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink/60">
                      {truck.cuisine} · {truck.address}
                    </span>
                    <span
                      className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        status.open ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-ink/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          status.open ? "bg-emerald-500" : "bg-ink/40"
                        }`}
                      />
                      {status.label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="rounded-xl border border-dashed border-black/15 p-6 text-center text-sm text-ink/50">
              No trucks checked in right now. Check back soon!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
