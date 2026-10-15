import { FilmProvider } from "../components/film/FilmProvider";
import { TopBar } from "../components/navigation/TopBar";
import { TabBar } from "../components/navigation/TabBar";
import { Hero } from "../components/hero/Hero";
import { Profile } from "../components/sections/Profile";
import { Domains } from "../components/sections/Domains";
import { Projects } from "../components/sections/Projects";
import { Studio } from "../components/sections/Studio";
import { Journey } from "../components/sections/Journey";
import { Backstage } from "../components/sections/Backstage";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/sections/Footer";

export default function Home() {
  return (
    <FilmProvider>
      <a
        href="#profil"
        className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>
      <TopBar />
      <main>
        <Hero />
        <Profile />
        <Domains />
        <Projects />
        <Studio />
        <Journey />
        <Backstage />
        <Contact />
      </main>
      <Footer />
      <TabBar />
    </FilmProvider>
  );
}
