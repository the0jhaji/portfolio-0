import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import CodingProfiles from "./components/CodingProfiles";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useScrollReveal, useActiveSection } from "./hooks/useReveal";

const NAV_SECTIONS = ["about", "skills", "projects", "contact"];

export default function App() {
  const containerRef = useScrollReveal();
  const activeSection = useActiveSection(NAV_SECTIONS);

  return (
    <div ref={containerRef} className="font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar activeSection={activeSection} />

      <main className="flex-grow pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-32">
        <Hero />
        <About />
        <Skills />
        <CodingProfiles />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
