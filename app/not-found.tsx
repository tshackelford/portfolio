import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[60ch] px-6 py-32 text-center">
      <p className="text-canyon text-xs uppercase tracking-[0.14em] font-semibold">
        404
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] font-extrabold text-5xl text-ink">
        Off the trail.
      </h1>
      <p className="mt-4 text-lg text-ink/85">
        That page isn&rsquo;t here. Head back to the map.
      </p>
      <ul className="mt-8 flex justify-center gap-6 text-canyon">
        <li><Link href="/" className="underline underline-offset-4">Home</Link></li>
        <li><Link href="/#about" className="underline underline-offset-4">About</Link></li>
        <li><Link href="/#work" className="underline underline-offset-4">Work</Link></li>
        <li><Link href="/#contact" className="underline underline-offset-4">Contact</Link></li>
      </ul>
    </section>
  );
}
