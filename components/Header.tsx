import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/#locate", label: "Locate a Truck" },
  { href: "/vendors/join", label: "For Vendors" },
  { href: "/#events", label: "Book an Event" },
];

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-[1000] border-b border-black/5 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg shadow-sm">
            🚚
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] text-ink">Central AL</span>
            <span className="-mt-1 block text-[13px] text-brand">Food Trucks</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-brand">
              {item.label}
            </a>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink/60 sm:inline" title={user.email ?? undefined}>
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/vendors/login"
              className="hidden text-sm font-medium text-ink/70 transition hover:text-brand sm:inline"
            >
              Vendor login
            </Link>
            <Link
              href="/vendors/join"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              List your truck
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
