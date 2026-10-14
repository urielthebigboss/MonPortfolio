import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "../../lib/film";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Fenêtre modale accessible, sans style imposé. À rendre dans un
 * <AnimatePresence> : montée = ouverte, démontée = fermée.
 * Portail, focus piégé, Échap pour fermer, focus restitué,
 * défilement de la page bloqué (Lenis compris).
 */
export function Dialog({
  onClose,
  label,
  children,
}: {
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    lockScroll();
    const t = window.setTimeout(() => {
      const first = ref.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        ref.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus({ preventScroll: true });
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      previous?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={label}>
      {children}
    </div>,
    document.body,
  );
}
