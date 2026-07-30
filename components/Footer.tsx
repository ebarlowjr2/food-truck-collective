export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5 bg-ink text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-extrabold text-cream">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-base">
              🚚
            </span>
            Central Alabama Food Trucks
          </div>
          <p className="mt-3 max-w-sm text-sm text-cream/60">
            A collective for central Alabama&apos;s food-truck community — find trucks in
            real time, book them for events, and get help staying compliant.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cream">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/60">
            <li>
              <a href="#locate" className="hover:text-brand">
                Locate a truck
              </a>
            </li>
            <li>
              <a href="#events" className="hover:text-brand">
                Book an event
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cream">For Vendors</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/60">
            <li>
              <a href="/vendors/join" className="hover:text-brand">
                List your truck
              </a>
            </li>
            <li>
              <a href="/#vendors" className="hover:text-brand">
                Compliance resources
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Central Alabama Food Trucks. Built for the local
        food-truck community.
      </div>
    </footer>
  );
}
