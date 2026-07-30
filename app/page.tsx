import Link from "next/link";
import LocateExperience from "@/components/LocateExperience";
import { getLiveTrucks } from "@/lib/liveData";
import { getLiveStatus } from "@/lib/live";

// The map reflects live check-ins, so render per request (never statically cached).
export const dynamic = "force-dynamic";

export default async function Home() {
  const trucks = await getLiveTrucks();
  const liveNow = trucks.filter((t) => getLiveStatus(t).open).length;
  const cuisines = new Set(trucks.map((t) => t.cuisine)).size;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-32 h-56 w-56 rounded-full bg-brand/15 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm">
              🛰️ Live map · Central Alabama
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Locate your <span className="text-brand">food truck</span>.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink/70">
              A collective for central Alabama&apos;s food-truck community. See where every
              truck is parked right now, book one for your party, and — if you run a truck —
              list it and stay compliant.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#locate"
                className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Find a truck near me
              </a>
              <Link
                href="/vendors/join"
                className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
              >
                List your truck
              </Link>
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-baseline gap-2">
                <dt className="text-2xl font-extrabold text-ink">{trucks.length}</dt>
                <dd className="text-ink/60">trucks on the map</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-2xl font-extrabold text-emerald-600">{liveNow}</dt>
                <dd className="text-ink/60">live right now</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-2xl font-extrabold text-ink">{cuisines}</dt>
                <dd className="text-ink/60">cuisines</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Locate — the defining feature */}
      <section id="locate" className="scroll-mt-20 bg-white/60 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Locate your food truck
            </h2>
            <p className="text-ink/60">
              Tap a truck to fly the map to its current spot and see today&apos;s hours.
            </p>
          </div>
          <LocateExperience trucks={trucks} />
        </div>
      </section>

      {/* Vendors / compliance */}
      <section id="vendors" className="scroll-mt-20 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                For vendors
              </span>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                List your truck. Stay compliant. Get found.
              </h2>
              <p className="mt-3 text-ink/70">
                Getting a food truck legal in Alabama means juggling health permits, fire
                inspections, and business licenses across counties. We put the checklists,
                forms, and renewal reminders in one place — then put your truck on the map.
              </p>
              <Link
                href="/vendors/join"
                className="mt-5 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Join the collective
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: "📋", title: "Compliance checklists", body: "Health, fire, and business license steps by county." },
                { icon: "⏰", title: "Renewal reminders", body: "Never miss a permit expiration again." },
                { icon: "📍", title: "Live map presence", body: "Broadcast your location and hours to customers." },
                { icon: "🤝", title: "Community support", body: "Share commissary kitchens, events, and referrals." },
              ].map((f) => (
                <li key={f.title} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                  <div className="text-2xl">{f.icon}</div>
                  <h3 className="mt-2 font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Events / booking */}
      <section id="events" className="scroll-mt-20 bg-ink py-14 text-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                Book an event
              </span>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Request a food truck for your party or private event.
              </h2>
              <p className="mt-3 max-w-xl text-cream/70">
                Weddings, office lunches, birthdays, block parties — tell us the date,
                headcount, and the food you&apos;re craving, and we&apos;ll match you with
                available trucks in your area.
              </p>
              <a
                href="#events"
                className="mt-5 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Request a truck
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-cream/80">Popular for</div>
              <ul className="mt-3 space-y-2 text-sm text-cream/70">
                <li>🎉 Birthday &amp; block parties</li>
                <li>💍 Weddings &amp; receptions</li>
                <li>🏢 Corporate &amp; office lunches</li>
                <li>🎓 Graduations &amp; tailgates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
