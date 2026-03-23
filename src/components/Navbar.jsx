export default function Navbar({ solid }) {
  return (
    <header className="fixed left-0 right-0 top-5 z-50 px-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex max-w-[1260px] items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6 ${
          solid
            ? "border-brabant-black/10 bg-white text-brabant-black shadow-soft"
            : "border-brabant-black/10 bg-white text-brabant-black shadow-soft"
        }`}
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.22em] opacity-70">
              Datalek
            </p>
            <p className="font-display text-sm uppercase tracking-[0.18em]">
              Ernstbeoordeling
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 font-display text-xs uppercase tracking-[0.18em] md:flex">
          <a href="#intake" className="magnetic">
            Context
          </a>
          <a href="#assessment" className="magnetic">
            Criteria
          </a>
        </nav>

        <a
          href="#assessment"
          className={`magnetic inline-flex rounded-full px-4 py-2 font-display text-xs uppercase tracking-[0.18em] ${
            solid
              ? "bg-brabant-red text-white"
              : "bg-brabant-red text-white"
          }`}
        >
          Beoordeel nu
        </a>
      </div>
    </header>
  );
}
