# Portfolio — Uriel Jean-Bedel Dakaud

> **Du signal au système.** Un portfolio pensé comme un film en sept chapitres :
> on y navigue comme dans un montage vidéo.

## Lancer le projet

```bash
npm install
npm run dev       # serveur local (http://localhost:5173)
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
npm run lint
```

## Ce que vous modifiez le plus souvent

| Je veux…                                  | Fichier                                   |
| ----------------------------------------- | ----------------------------------------- |
| Changer e-mail, WhatsApp, réseaux, CV     | `src/config/site.ts`                      |
| Ajouter / modifier une réalisation        | `src/data/projects.ts`                    |
| Déposer les images d'un projet            | `src/assets/projects/<id-du-projet>/`     |
| Créations design / motion / 3D (Studio)   | `src/data/studio.ts` + `src/assets/studio/` |
| Compléter le parcours (dates, Master…)    | `src/data/journey.ts`                     |
| Ajuster domaines, outils, compétences     | `src/data/domains.ts`                     |
| Panneaux « Compétences » (défilement)     | `src/data/skills.ts`                      |
| Logos des technologies                    | `src/lib/techLogos.ts`                    |
| Équipe Gama Labs (membres, liens, logo)   | `src/data/team.ts` + `src/assets/team/`   |
| Gérer les photos « Coulisses »            | `src/data/gallery.ts`                     |
| Renommer / réordonner les chapitres       | `src/data/chapters.ts`                    |
| Couleurs, typo, espacements, courbes      | `src/styles/tokens.css`                   |

**Règle générale :** une valeur `null` ou vide masque proprement l'élément
(bouton, lien, date). Rien n'est inventé à l'affichage.

En développement (`npm run dev`), des étiquettes orange **« Dev · à compléter »**
signalent les informations manquantes. Elles n'apparaissent jamais en production.

### Ajouter une réalisation

1. Déposez `cover.webp` (et d'autres images) dans `src/assets/projects/mon-projet/`.
2. Dans `src/data/projects.ts`, importez-les puis copiez un bloc existant :

```ts
import cover from "../assets/projects/mon-projet/cover.webp";

{
  id: "mon-projet",
  title: "Mon projet",
  pitch: "Une phrase.",
  description: `Paragraphe 1.

Paragraphe 2.`,
  category: "iot",            // software | data | iot | creative | spatial
  year: "2026",
  role: "Conception & développement",
  technologies: ["React", "Python"],
  cover: { src: cover, alt: "Ce que montre l'image" },
  gallery: [],
  demoUrl: null,              // null = bouton masqué
  repoUrl: null,
  status: "publie",           // publie | en-cours | a-venir
  published: true,
  order: 3,
}
```

Sans image (`cover: null`), une couverture typographique est générée.

## Direction artistique

- **Concept :** relier le terrain (capteurs, agriculture), la donnée et l'écran.
  L'ouverture reprend la référence « Accenture Song » : texte à gauche et, à
  droite, une seule photo (le portrait sur fond ciel) découpée en continu à
  travers cinq cartes. Pour la changer, remplacez
  `src/assets/images/hero-uriel.webp` (ratio 5:4, 1600 px de large minimum ;
  une photo plus grande sera plus nette). Le portrait source est dans
  `src/assets/images/portrait-hd.jpeg`.
- **Palette :** un seul fond pour tout le site, le blanc du hero (`--c-paper`
  dans `tokens.css`), sans section sombre ni dégradé d'arrière-plan. Encre
  `#0B0B0C`, bleu signal `#2952FF` (dégradé bleu-violet-cyan réservé aux mots
  clés), une teinte par domaine (`--h-*`).
- **Matières :** verre translucide pour la navigation (`.glass`).
- **Typographies (auto-hébergées) :** Geist (titres & texte), Instrument Serif
  (monogramme « D »), Geist Mono (réserve).

## Navigation « montage vidéo »

- **Desktop & tablette :** une barre de navigation fixe en haut, avec un lien par
  chapitre et une pastille qui suit le chapitre affiché. Elle devient une
  « île » de verre dès qu'on fait défiler la page.
- **Mobile :** une barre d'onglets façon iOS en bas (pastille glissante,
  compactage au défilement, zone de sécurité, masquée avec le clavier).
- **Chapitre voisin →** *travelling* : la page glisse (Lenis).
- **Chapitre lointain →** *cut* : un volet blanc affiche le numéro et le titre,
  la page saute derrière, puis la scène d'arrivée fait un zoom de mise au point.
- **Sur desktop**, chaque scène s'ouvre dans un cadre qui s'élargit
  (effet désactivé sur mobile et tablette).
- `prefers-reduced-motion` : sauts directs, aucun effet, contenu intact.

## Identité sonore

`src/lib/sound.ts` reprend **à l'identique** les sons de l'ancien site (clic et
survol de la barre de navigation, arpège d'entrée, ouverture/fermeture,
jalons). Un seul AudioContext partagé (l'ancien en créait un par son), bus de
volume, anti-chevauchement. Ajouts : un *whoosh* de coupe et une note
d'arrivée par chapitre qui monte sur la gamme de l'arpège d'origine.
Pas de musique d'ambiance : uniquement des effets sonores, réglables
(on/off, volume) depuis le bouton « Son » en bas de page.

## Structure

```text
src/
├── config/site.ts            identité & coordonnées
├── data/                     contenus éditables (projets, parcours, domaines…)
├── lib/                      sound (audio), film (navigation), motion, hooks
├── components/
│   ├── film/                 FilmProvider, Scene, CutOverlay
│   ├── navigation/           TopBar, TabBar, SoundControl
│   ├── hero/ sections/ projects/ domains/ ui/
├── styles/tokens.css         design system
└── pages/Home.tsx            l'enchaînement des chapitres
```

Les anciennes adresses (`/profil`, `/projets`, `/galerie`, `/contact`)
redirigent vers le chapitre correspondant. Sur un hébergement statique,
configurez la réécriture de toutes les routes vers `index.html`.
