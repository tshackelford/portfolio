import { siteMeta } from "@/content/meta";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-mesa/15">
      <div className="mx-auto max-w-[1280px] px-6 py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-sm text-dust">
        <p>© {year} {siteMeta.name}</p>
        <ul className="flex gap-6">
          <li>
            <a
              href="https://github.com/thomasshackelford"
              className="hover:text-canyon transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/thomas-shackelford"
              className="hover:text-canyon transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="mailto:thomas.shackelford1@gmail.com"
              className="hover:text-canyon transition-colors"
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
