export default function Panel({
  eyebrow,
  title,
  description,
  children,
  accent,
}) {
  const dark = accent === "dark";

  return (
    <section
      className={`overflow-hidden rounded-[2.2rem] border p-6 shadow-soft sm:p-8 ${
        dark
          ? "border-brabant-black bg-brabant-black text-white"
          : "border-white/60 bg-white/75 backdrop-blur"
      }`}
    >
      <div className="max-w-2xl">
        <p
          className={`font-display text-xs uppercase tracking-[0.28em] ${
            dark ? "text-white/55" : "text-brabant-red"
          }`}
        >
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-[1.85rem] uppercase leading-[0.95] sm:text-[2.4rem]">
          {title}
        </h2>
        <p
          className={`mt-3 max-w-2xl text-sm leading-6 ${
            dark ? "text-white/74" : "text-brabant-black/70"
          }`}
        >
          {description}
        </p>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
