import { useEffect, useRef, useState } from "react";

// TODO: keep this accurate. `startDate` drives the live duration chip, so it is
// the only field you must not leave blank.
const experiences = [
  {
    id: "inamigos-webdev",
    role: "Web Developer Intern",
    organization: "InAmigos Foundation",
    location: "Bilaspur, Chhattisgarh · Remote",
    startDate: "2026-09-27",
    // null means the role is current.
    endDate: null,
    icon: "terminal",
    summary:
      "Contributing to the Foundation's web presence as part of its Project VIKAS skill-development track — building and maintaining features for an NGO-driven platform and supporting it with responsive, accessible front-end work.",
    highlights: [
      "Build and maintain responsive front-end features for the Foundation's web platform.",
      "Apply UI and design principles to improve usability, accessibility and page performance.",
      "Collaborate with the Foundation team on feature requirements, reviews and iterative feedback.",
      "Document work and contribute to internship deliverables for certification and review.",
    ],
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Git"],
  },
];

const MS_PER_DAY = 86_400_000;

function monthsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  // Don't count a partial month until the anniversary day is reached.
  const anniversary = new Date(
    end.getFullYear(),
    end.getMonth(),
    Math.min(start.getDate(), new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()),
  );
  if (anniversary > end) {
    months -= 1;
  }

  return Math.max(0, months);
}

function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  return Math.max(0, Math.round((end - start) / MS_PER_DAY));
}

function formatDuration(startDate, endDate) {
  if (!startDate) return null;

  const months = monthsBetween(startDate, endDate);
  const days = daysBetween(startDate, endDate);

  if (months >= 12) {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return rest ? `${years} yr ${rest} mo` : `${years} yr`;
  }
  if (months >= 1) return `${months} mo`;
  if (days >= 14) return `${Math.floor(days / 7)} wks`;
  if (days === 1) return "1 day";
  if (days > 1) return `${days} days`;
  return "Just started";
}

function formatPeriod(startDate, endDate) {
  if (!startDate) return "Add start date";

  const format = (value) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  return endDate ? `${format(startDate)} – ${format(endDate)}` : `${format(startDate)} – Present`;
}

function ExperienceCard({ experience, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isOngoing = !experience.endDate;
  const duration = formatDuration(experience.startDate, experience.endDate);
  const panelId = `experience-panel-${experience.id}`;
  const toggleId = `experience-toggle-${experience.id}`;

  return (
    <li className="relative pl-16 md:pl-20">
      {/* Timeline node */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 flex h-14 w-14 items-center justify-center rounded-2xl neu-recessed text-primary transition-transform duration-500 hover:scale-110 hover:-rotate-3"
      >
        <span className="material-symbols-outlined text-2xl">{experience.icon}</span>
      </span>

      <article className="neu-raised group rounded-3xl p-7 transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1.5 md:p-9">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-on-surface transition-colors duration-300 group-hover:text-primary">
              {experience.role}
            </h3>
            <p className="mt-1.5 font-medium text-secondary">{experience.organization}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-secondary">
              <span className="material-symbols-outlined text-base">location_on</span>
              {experience.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
            {isOngoing && (
              <span className="flex w-max items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-label-mono text-xs font-semibold text-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Ongoing
              </span>
            )}
            <span className="rounded-full bg-secondary/10 px-3 py-1.5 font-label-mono text-xs font-medium text-secondary">
              {formatPeriod(experience.startDate, experience.endDate)}
            </span>
            {duration && (
              <span className="w-max rounded-full bg-secondary/10 px-3 py-1.5 font-label-mono text-xs font-medium text-secondary">
                {duration}
              </span>
            )}
          </div>
        </div>

        <p className="mt-5 leading-7 text-on-surface-variant">{experience.summary}</p>

        {/* Expandable details */}
        <div
          id={panelId}
          role="region"
          aria-labelledby={toggleId}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-6 flex flex-col gap-6">
              <ul className="flex flex-col gap-3">
                {experience.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-lg text-primary">
                      check_circle
                    </span>
                    <span className="min-w-0 break-words leading-6 text-on-surface-variant">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>

              <div>
                <p className="mb-3 font-label-mono text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {experience.tech.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-hairline bg-surface px-3 py-1.5 font-label-mono text-xs font-medium text-secondary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-primary hover:shadow-md"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          id={toggleId}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="-ml-3 mt-6 flex min-h-[44px] items-center gap-1.5 rounded-full py-2 pl-3 pr-4 font-label-mono text-xs font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <span
            className="material-symbols-outlined text-lg transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            expand_more
          </span>
          {isOpen ? "Hide details" : `Show ${experience.highlights.length} responsibilities`}
        </button>
      </article>
    </li>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);

  // Drives the vertical rail fill, so the timeline "draws itself" as you scroll.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height + window.innerHeight;
      const scrolled = window.innerHeight - rect.top;
      const progress = travel > 0 ? Math.min(1, Math.max(0, scrolled / travel)) : 1;
      section.style.setProperty("--timeline-fill", `${(progress * 100).toFixed(2)}%`);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // No point animating a line for someone who asked us not to animate.
    if (reducedMotion.matches) {
      section.style.setProperty("--timeline-fill", "100%");
      return undefined;
    }

    let frame = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeCount = experiences.filter((experience) => !experience.endDate).length;

  return (
    <section className="section scroll-mt-32" id="experience" ref={sectionRef}>
      <div className="reveal active mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3 font-label-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span>Where I've worked</span>
            <span className="h-px w-8 bg-primary/40" />
            <span>
              {experiences.length.toString().padStart(2, "0")}{" "}
              {experiences.length === 1 ? "role" : "roles"}
            </span>
          </div>
          <h2 className="font-headline-lg text-4xl font-bold text-on-surface">
            Work Experience
          </h2>
        </div>

        {activeCount > 0 && (
          <span className="flex w-max items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-label-mono text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {activeCount} active {activeCount === 1 ? "role" : "roles"} right now
          </span>
        )}
      </div>

      {experiences.length > 0 ? (
        <div className="relative">
          {/* Rail track + scroll-driven fill */}
          <div
            aria-hidden="true"
            className="absolute bottom-3 left-[27px] top-3 w-[2px] rounded-full bg-primary/15"
          />
          <div
            aria-hidden="true"
            className="absolute left-[27px] top-3 w-[2px] rounded-full bg-gradient-to-b from-primary to-primary/30"
            style={{
              height: "var(--timeline-fill, 0%)",
              maxHeight: "calc(100% - 1.5rem)",
              transition: "height 120ms linear",
            }}
          />

          <ul className="relative flex flex-col gap-8">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                defaultOpen={index === 0}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="neu-recessed rounded-3xl p-8 text-center text-secondary">
          No roles added yet.
        </p>
      )}
    </section>
  );
}
