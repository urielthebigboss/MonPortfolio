import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Home from "./pages/Home";

/**
 * Une seule page « film ». Les anciennes routes (/profil, /projets,
 * /galerie, /contact) affichent la même page et sautent directement
 * au chapitre correspondant (voir FilmProvider).
 */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
