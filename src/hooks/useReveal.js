import { useEffect, useRef, useState } from "react";

export function useScrollReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const reveals = containerRef.current?.querySelectorAll(".reveal");

    if (!reveals || reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    reveals.forEach((reveal) => observer.observe(reveal));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("id"));
          }
        });
      },
      {
        root: null,
        threshold: 0.3,
        rootMargin: "-20% 0px -60% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
