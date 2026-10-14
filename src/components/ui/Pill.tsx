import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { sound } from "../../lib/sound";
import { useHoverSound } from "../../lib/hooks";

type Variant = "solid" | "ghost" | "light" | "signal";

const variants: Record<Variant, string> = {
  solid: "btn-solid",
  ghost: "glass text-current hover:bg-white",
  light: "bg-white text-ink shadow-[0_10px_30px_-10px_rgb(0_0_0/0.4)] hover:bg-paper",
  signal: "bg-signal text-white hover:bg-ink",
};

const base =
  "group relative inline-flex min-h-[48px] items-center gap-3 overflow-hidden rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-[background,color,box-shadow,transform] duration-300 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

/** Icône qui glisse : la flèche sort par le haut, une autre entre par le bas. */
function SlideIcon({ icon }: { icon?: ReactNode }) {
  const glyph = icon ?? <ArrowUpRight size={18} strokeWidth={1.8} />;
  return (
    <span className="relative grid h-5 w-5 place-items-center overflow-hidden" aria-hidden>
      <span className="col-start-1 row-start-1 transition-transform duration-500 ease-out group-hover:-translate-y-full group-hover:translate-x-full">
        {glyph}
      </span>
      <span className="col-start-1 row-start-1 -translate-x-full translate-y-full transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0">
        {glyph}
      </span>
    </span>
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  icon?: ReactNode;
  noIcon?: boolean;
};

export const PillButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function PillButton(
    { variant = "solid", icon, noIcon, className = "", children, onClick, ...rest },
    ref,
  ) {
    const hover = useHoverSound();
    return (
      <button
        ref={ref}
        type="button"
        className={`${base} ${variants[variant]} ${className}`}
        onClick={(e) => {
          sound.play("click");
          onClick?.(e);
        }}
        {...hover}
        {...rest}
      >
        <span>{children}</span>
        {!noIcon && <SlideIcon icon={icon} />}
      </button>
    );
  },
);

type LinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  icon?: ReactNode;
  noIcon?: boolean;
};

export function PillLink({
  variant = "solid",
  icon,
  noIcon,
  className = "",
  children,
  onClick,
  ...rest
}: LinkProps) {
  const hover = useHoverSound();
  const external = rest.href?.startsWith("http");
  return (
    <a
      className={`${base} ${variants[variant]} ${className}`}
      onClick={(e) => {
        sound.play("click");
        onClick?.(e);
      }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...hover}
      {...rest}
    >
      <span>{children}</span>
      {!noIcon && <SlideIcon icon={icon} />}
      {external && <span className="sr-only">(nouvel onglet)</span>}
    </a>
  );
}
