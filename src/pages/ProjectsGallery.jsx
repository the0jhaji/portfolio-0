import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  PROJECTS,
  ProjectFilters,
  ProjectResults,
} from "../components/Projects";

export default function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      <Navbar activeSection="projects" />

      <main className="mx-auto mt-12 w-full max-w-container-max flex-grow px-margin-mobile pb-24 md:px-margin-desktop">
        <div className="reveal active mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3 font-label-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary/40" />
            Project archive
            <span className="h-px w-8 bg-primary/40" />
          </div>
          <h1 className="font-display text-display text-on-surface">Projects Gallery</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg text-on-surface-variant">
            A recruiter-friendly collection of AI systems, machine-learning experiments,
            full-stack applications, and innovation prototypes.
          </p>
          <p className="mt-4 font-label-mono text-xs text-secondary">
            {PROJECTS.length} projects · Source-verified where publicly available
          </p>
        </div>

        <div className="reveal active stagger-1 rounded-[28px] p-3 sm:p-4">
          <ProjectFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <ProjectResults activeCategory={activeCategory} />
      </main>

      <Footer />
    </div>
  );
}
