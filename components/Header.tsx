import Link from "next/link";

const NAV = [
  { href: "#locate", label: "Locate a Truck" },
  { href: "#vendors", label: "For Vendors" },
  { href: "#events", label: "Book an Event" },
];

export default function Header() {
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

        <a
          href="#locate"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Find food near me
        </a>
      </div>
    </header>
  );
}
