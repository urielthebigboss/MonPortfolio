import { BrainCircuit, Box, CodeXml, PenTool, Sprout, type LucideIcon } from "lucide-react";
import type { DomainId } from "../../types/content";

export const domainIcons: Record<DomainId, LucideIcon> = {
  software: CodeXml,
  data: BrainCircuit,
  iot: Sprout,
  creative: PenTool,
  spatial: Box,
};

/** Teinte RGB (variable CSS) d'un domaine : rgb(var(--h-iot) / 0.3). */
export const hue = (id: DomainId, alpha = 1) => `rgb(var(--h-${id}) / ${alpha})`;
