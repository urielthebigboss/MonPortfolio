import { techLogo } from "../../lib/techLogos";

/** Liste de technologies : logo officiel si disponible, sinon le nom. */
export function TechList({
  items,
  className = "",
  size = "md",
}: {
  items: string[];
  className?: string;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-9 min-w-9" : "h-10 min-w-10";
  const img = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((t) => {
        const logo = techLogo(t);
        return (
          <li
            key={t}
            title={t}
            className={`inline-flex items-center justify-center rounded-full bg-white ring-1 ring-ink/10 ${box} ${logo ? "px-2" : "px-3.5 text-sm"}`}
          >
            {logo ? (
              <>
                <img src={logo} alt="" width={24} height={24} decoding="async" className={img} />
                <span className="sr-only">{t}</span>
              </>
            ) : (
              t
            )}
          </li>
        );
      })}
    </ul>
  );
}
