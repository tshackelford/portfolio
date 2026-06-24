import { siteMeta } from "@/content/meta";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-canyon/10">
      <div className="mx-auto max-w-[1280px] px-6 py-10 text-center text-sm text-dust">
        <p>© {year} {siteMeta.name}</p>
      </div>
    </footer>
  );
}
