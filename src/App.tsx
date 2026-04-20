import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profil from "./pages/Profil"; // Le code ci-dessous
import Accueil from "./pages/Acceuil";
import Contact from "./pages/Contact";
import Galerie from "./pages/Galerie";
//import Projets from "./pages/Projets";

import { ProjectsSection } from "./pages/Projets";
import "./styles/projects.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profil" element={<Profil />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/" element={<Accueil />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projets" element={<ProjectsSection />} />
      </Routes>
    </Router>
  );
}
