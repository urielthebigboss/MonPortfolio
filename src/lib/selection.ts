import type { DomainId } from "../types/content";
import { createStore } from "./store";

/** Domaine sélectionné — partagé entre le hero et le chapitre Domaines. */
export const selectedDomain = createStore<DomainId>("software");
