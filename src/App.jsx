import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectsGallery from "./pages/ProjectsGallery";
import GithubLinkGuard from "./components/GithubLinkGuard";
import WelcomeLoader from "./components/WelcomeLoader";
import { PROJECTS } from "./components/Projects";

export default function App() {
  // Prevents the page behind the intro from scrolling while it is on screen.
  const [isIntroActive, setIsIntroActive] = useState(true);

  useEffect(() => {
    if (!isIntroActive) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isIntroActive]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsGallery />} />
      </Routes>

      {/* Dev-only: warns if any project githubUrl is not publicly reachable. */}
      <GithubLinkGuard projects={PROJECTS} />

      <WelcomeLoader onComplete={() => setIsIntroActive(false)} />
    </>
  );
}
