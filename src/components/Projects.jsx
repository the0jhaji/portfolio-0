import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import GitHubIcon from "./GitHubIcon";

export const PROJECTS = [
  {
    id: "astra",
    title: "ASTRA",
    category: "AI / Computer Vision",
    description:
      "An offline astronaut-assistance system that monitors space-station activity, detects people, tools, and equipment, and recognizes procedures and hazards. It combines pose estimation, object tracking, event recognition, and offline voice alerts without cloud connectivity.",
    tech: [
      "Python",
      "YOLOv8",
      "PyTorch",
      "OpenCV",
      "ONNX",
      "FastAPI",
      "React",
      "TypeScript",
      "WebSockets",
      "Pose Estimation",
      "Object Tracking",
      "Event Recognition",
      "Offline TTS",
    ],
    githubUrl: null,
    demoUrl: "https://sih-2026-prototype-nine.vercel.app/",
    featured: true,
    icon: "deployed_code",
    accent: "from-stone-950 via-amber-950 to-orange-700",
    image: "/astra.png",
  },
  {
    id: "maruti",
    title: "Maruti — Hyperlocal Weather & Agricultural/Construction Advisory System",
    tagline:
      "Micro-level rainfall forecasting and decision support powered by Machine Learning and GIS data.",
    category: "AI / Geospatial Intelligence",
    description:
      "Maruti is a full-stack weather intelligence platform that delivers Panchayat-level forecasts and industry advisories for agriculture and construction. Powered by a Node.js/Express backend, Python ML models (Random Forest/HGB), and real-time GIS & IMD weather streams, it translates raw climate data into interactive risk analytics and spatial visualizations via a React + Vite dashboard.",
    tech: [
      "React",
      "Vite",
      "Node.js",
      "Express",
      "Python",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "GIS",
      "Recharts",
      "Leaflet",
      "Random Forest",
      "Gradient Boosting",
      "Quantile Regression",
      "ECMWF HRES",
      "WRF-ARW",
      "IMD GFS",
      "SRTM",
      "IMD AWS",
      "LGD Boundaries",
    ],
    githubUrl: null,
    demoUrl: "https://sih-ps2-prototype.vercel.app/",
    featured: true,
    icon: "satellite_alt",
    accent: "from-neutral-950 via-emerald-950 to-lime-800",
    image: "/maruti.png",
  },
  {
    id: "know-your-leader",
    title: "Know Your Leader",
    category: "Full Stack / Web Development",
    description:
      "A political information and candidate research platform that makes publicly available information about political leaders easier to discover and understand. Know Your Leader organises candidate profiles into a structured interface covering election and constituency details, publicly declared assets and liabilities, criminal-case disclosures and party affiliation, with search and explore views for browsing across leaders. All content is drawn from publicly available sources such as election commission records and candidate affidavits, and is presented without endorsement.",
    tech: ["React", "JavaScript", "Node.js", "MongoDB"],
    githubUrl: null,
    demoUrl: "https://client-seven-alpha-20.vercel.app/",
    featured: true,
    icon: "leaderboard",
    accent: "from-stone-950 via-rose-950 to-pink-700",
    image: "/know-your-leader.png",
  },
  {
    id: "sweety",
    title: "Sweety",
    category: "AI Assistant",
    description:
      "An AI assistant project currently in development. Its public source and implementation details are not yet available, so no unverified features or technologies are represented here.",
    tech: [],
    githubUrl: null,
    demoUrl: null,
    featured: true,
    icon: "smart_toy",
    accent: "from-stone-950 via-fuchsia-950 to-rose-600",
    stackNote: "Technology stack not public",
  },
  {
    id: "spam-mail-detection",
    title: "Spam Mail Detection",
    category: "Machine Learning",
    description:
      "An email classifier that converts message text into TF-IDF features and predicts spam or ham with Logistic Regression. A Flask endpoint loads the serialized model and vectorizer, while a browser form submits text and displays the result.",
    tech: [
      "Python",
      "scikit-learn",
      "TF-IDF",
      "Logistic Regression",
      "Flask",
      "Pandas",
      "Pickle",
    ],
    githubUrl: "https://github.com/the0jhaji/spam_mail_detection",
    demoUrl: null,
    featured: false,
    icon: "mark_email_unread",
    accent: "from-neutral-950 via-amber-950 to-yellow-700",
  },
  {
    id: "library-website",
    title: "Library Website",
    category: "Full Stack / Web Development",
    description:
      "A central-library portal with a React interface and Express API for authentication, catalog search, issued loans, fines, and password-reset requests. JWT-protected routes, bcrypt hashing, MongoDB persistence, seeded data, and dark-mode support complete the full-stack prototype.",
    tech: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "JWT",
      "bcrypt",
    ],
    githubUrl: "https://github.com/the0jhaji/libraryWebsite",
    demoUrl: null,
    featured: false,
    icon: "local_library",
    accent: "from-emerald-950 via-green-900 to-lime-700",
  },
  {
    id: "car-price-prediction",
    title: "Car Price Prediction",
    category: "Machine Learning",
    description:
      "A regression experiment that predicts used-car selling prices from year, mileage, fuel, seller, and transmission features. It compares Linear and Lasso Regression with R² evaluation and actual-versus-predicted visualizations.",
    tech: [
      "Python",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "Linear Regression",
      "Lasso Regression",
      "Matplotlib",
      "Seaborn",
    ],
    githubUrl: "https://github.com/the0jhaji/Car-Price-Prediction-with-ML",
    demoUrl: null,
    featured: false,
    icon: "directions_car",
    accent: "from-stone-950 via-neutral-800 to-amber-700",
  },
  {
    id: "parkinsons-prediction",
    title: "Parkinson's Disease Prediction with ML",
    category: "Machine Learning",
    description:
      "A binary classification experiment on a tabular Parkinson's disease dataset using feature standardization and a linear-kernel SVM. It reports training and test accuracy from an 80/20 split as a training experiment rather than a clinical application.",
    tech: [
      "Python",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "SVM",
      "StandardScaler",
    ],
    githubUrl:
      "https://github.com/the0jhaji/Parkinson-s-disease-Prediction-ML-project",
    demoUrl: null,
    featured: false,
    icon: "neurology",
    accent: "from-neutral-950 via-rose-950 to-orange-700",
  },
  {
    id: "calories-burn-prediction",
    title: "Calories Burn Prediction",
    category: "Machine Learning",
    description:
      "An exploratory regression workflow that combines exercise and calorie datasets, encodes user attributes, and visualizes distributions and correlations. It trains an XGBoost regressor on an 80/20 split and evaluates predictions with mean absolute error.",
    tech: [
      "Python",
      "Pandas",
      "NumPy",
      "XGBoost",
      "scikit-learn",
      "Matplotlib",
      "Seaborn",
    ],
    githubUrl: "https://github.com/the0jhaji/Calories_Burnt_model",
    demoUrl: null,
    featured: false,
    icon: "local_fire_department",
    accent: "from-orange-950 via-rose-900 to-amber-700",
  },
  {
    id: "idea-ignition",
    title: "Idea Ignition",
    category: "Innovation",
    description:
      "The team behind WellCore, a mental-health web platform with an assistant chat, mood tracking, self-assessment, relaxation tools, counselling, and resource pages. Mood entries are stored locally in the browser.",
    tech: ["HTML5", "CSS3", "JavaScript", "localStorage"],
    githubUrl: "https://github.com/the0jhaji/project-prototype",
    demoUrl: "https://project-prototype-one.vercel.app/",
    featured: false,
    icon: "lightbulb",
    accent: "from-amber-950 via-orange-900 to-yellow-600",
  },
];

// Each badge carries a light and a dark treatment. The pale `*-50` backgrounds
// and `*-200` rings are invisible against a dark surface, so dark mode swaps
// to a translucent fill with a bright text tone.
const CATEGORY_STYLES = {
  "AI / Computer Vision":
    "bg-orange-50 text-orange-800 ring-orange-200/80 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-400/25",
  "AI / Geospatial Intelligence":
    "bg-emerald-50 text-emerald-800 ring-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25",
  "AI Assistant":
    "bg-pink-50 text-pink-800 ring-pink-200/80 dark:bg-pink-500/15 dark:text-pink-300 dark:ring-pink-400/25",
  "Full Stack / Web Development":
    "bg-amber-50 text-amber-800 ring-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25",
  "Machine Learning":
    "bg-lime-50 text-lime-800 ring-lime-200/80 dark:bg-lime-500/15 dark:text-lime-300 dark:ring-lime-400/25",
  Innovation:
    "bg-yellow-50 text-yellow-800 ring-yellow-200/80 dark:bg-yellow-500/15 dark:text-yellow-300 dark:ring-yellow-400/25",
};

const ACTION_BASE_CLASS =
  "flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

// Featured builds that get a full-width, two-column card treatment.
const WIDE_PROJECT_IDS = new Set(["astra", "maruti"]);

function ProjectVisual({ project, featured, wide, index }) {
  const heightClass = wide
    ? "h-72 lg:h-full lg:min-h-[500px]"
    : featured
      ? "h-56"
      : "h-44";

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-gradient-to-br ${project.accent} ${heightClass}`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      {project.image ? (
        <>
          <img
            src={project.image}
            alt={`${project.title} project interface preview`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-orange-950/10" />
          <div className="absolute left-6 top-6 z-10 flex items-center gap-2">
            {/* The plate has to be opaque enough on its own: a 45% wash let the
                screenshot show through and dropped the white label to 3.9:1. */}
            <span className="rounded-full border border-white/20 bg-slate-950/75 px-3 py-1.5 font-label-mono text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              Featured build
            </span>
          </div>
        </>
      ) : (
        <div
          className="relative z-10 flex h-full flex-col justify-between p-6 text-white"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between font-label-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            <span>Project {String(index + 1).padStart(2, "0")}</span>
            <span>{featured ? "Featured" : project.category}</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
              <span className="material-symbols-outlined text-4xl">{project.icon}</span>
            </div>
            <span className="material-symbols-outlined text-5xl text-white/20 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
              arrow_outward
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function DemoNotice({ project, onClose }) {
  const titleId = `${project.id}-demo-title`;
  const descriptionId = `${project.id}-demo-description`;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/35 p-5 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-[28px] bg-surface p-7 text-on-surface neu-raised sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="neu-recessed flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
            <span className="material-symbols-outlined text-3xl">construction</span>
          </div>
          <button
            className="neu-raised neu-interactive flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            type="button"
            onClick={onClose}
            aria-label="Close live demo notice"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <h3 id={titleId} className="mt-6 text-2xl font-bold text-on-surface">
          Live demo coming soon
        </h3>
        <p id={descriptionId} className="mt-3 text-sm leading-6 text-on-surface-variant">
          We’re currently working on {project.title} and preparing a live demo. It isn’t
          available yet, but we’ll share it here as soon as it’s ready.
        </p>
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          {project.githubUrl
            ? "You can explore the source code on GitHub in the meantime."
            : "We’ll share updates here when the project is ready to preview."}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {project.githubUrl && (
            <a
              className={`${ACTION_BASE_CLASS} neu-raised neu-interactive text-primary`}
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon className="h-4 w-4" />
              View GitHub
            </a>
          )}
          <button
            className={`${ACTION_BASE_CLASS} neu-recessed neu-interactive text-on-surface`}
            type="button"
            onClick={onClose}
            autoFocus
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ProjectActions({ project }) {
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  useEffect(() => {
    if (!showDemoNotice) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowDemoNotice(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDemoNotice]);

  return (
    <>
      <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
        {project.githubUrl ? (
          <a
            className={`${ACTION_BASE_CLASS} neu-raised neu-interactive text-primary`}
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} GitHub repository`}
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
            <span className="material-symbols-outlined text-sm">arrow_outward</span>
          </a>
        ) : (
          <button
            className={`${ACTION_BASE_CLASS} neu-recessed cursor-not-allowed text-secondary`}
            type="button"
            disabled
            title="A public GitHub repository is not available for this project"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
            {/* The disabled state is carried by the recessed shadow, the
                not-allowed cursor and this chip — not by fading the label out,
                which made it unreadable rather than merely inactive. */}
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-secondary">
              Soon
            </span>
          </button>
        )}

        {project.demoUrl ? (
          <a
            className={`${ACTION_BASE_CLASS} neu-recessed neu-interactive text-on-surface`}
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} live demo`}
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            Live Demo
          </a>
        ) : (
          <button
            className={`${ACTION_BASE_CLASS} neu-recessed neu-interactive text-on-surface`}
            type="button"
            onClick={() => setShowDemoNotice(true)}
            aria-haspopup="dialog"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            Live Demo
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-primary">
              Soon
            </span>
          </button>
        )}
      </div>

      {showDemoNotice && (
        <DemoNotice project={project} onClose={() => setShowDemoNotice(false)} />
      )}
    </>
  );
}

export function ProjectCard({ project, featured = false, wide = false, index = 0 }) {
  return (
    <article
      className={`project-card group neu-raised flex flex-col overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-2 ${
        wide ? "lg:col-span-2 lg:grid lg:grid-cols-[1.05fr_.95fr]" : ""
      }`}
    >
      <ProjectVisual
        project={project}
        featured={featured}
        wide={wide}
        index={index}
      />

      <div className={`flex flex-1 flex-col ${wide ? "p-7 sm:p-9" : "p-6"}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1.5 font-label-mono text-xs font-semibold ring-1 ring-inset ${
              CATEGORY_STYLES[project.category]
            }`}
          >
            {project.category}
          </span>
          {featured && (
            <span className="flex items-center gap-1.5 font-label-mono text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-base">star</span>
              Featured
            </span>
          )}
        </div>

        <h3
          className={`font-headline-lg text-on-surface ${
            wide ? "text-3xl sm:text-4xl" : "text-2xl"
          }`}
        >
          {project.title}
        </h3>
        {project.tagline && (
          <p className="mt-2 border-l-2 border-primary/40 pl-3 text-sm font-medium italic leading-6 text-secondary">
            {project.tagline}
          </p>
        )}
        <p
          className={`mt-3 text-on-surface-variant ${
            featured ? "text-base leading-7" : "text-sm leading-6"
          }`}
        >
          {project.description}
        </p>

        <div className="my-6 flex flex-wrap gap-2">
          {project.tech.length > 0 ? (
            project.tech.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-hairline bg-surface px-3 py-1.5 font-label-mono text-xs font-medium text-secondary shadow-sm"
              >
                {technology}
              </span>
            ))
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-dashed border-secondary/30 px-3 py-1.5 font-label-mono text-xs text-secondary">
              <span className="material-symbols-outlined text-sm">lock</span>
              {project.stackNote}
            </span>
          )}
        </div>

        <ProjectActions project={project} />
      </div>
    </article>
  );
}

export function ProjectResults({ limit }) {
  const visibleProjects = limit ? PROJECTS.slice(0, limit) : PROJECTS;
  const featuredProjects = visibleProjects.filter((project) => project.featured);
  const supportingProjects = visibleProjects.filter((project) => !project.featured);

  // The home page showcases a short, fixed-size selection, so only the lead card
  // spans the full width. The gallery keeps its own hand-tuned wide-card set.
  const wideProjectIds = limit
    ? new Set(visibleProjects[0] ? [visibleProjects[0].id] : [])
    : WIDE_PROJECT_IDS;

  return (
    <div className="flex flex-col gap-12">
      {featuredProjects.length > 0 && (
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-label-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Featured work
              </p>
              <h3 className="mt-2 text-2xl font-bold text-on-surface">
                Selected projects
              </h3>
            </div>
            <span className="hidden font-label-mono text-xs text-secondary sm:block">
              {featuredProjects.length.toString().padStart(2, "0")} featured
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured
                wide={wideProjectIds.has(project.id)}
                index={PROJECTS.findIndex((item) => item.id === project.id)}
              />
            ))}
          </div>
        </div>
      )}

      {supportingProjects.length > 0 && (
        <div>
          {featuredProjects.length > 0 && (
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="font-label-mono text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  More projects
                </p>
                <h3 className="mt-2 text-2xl font-bold text-on-surface">
                  Experiments &amp; prototypes
                </h3>
              </div>
              <span className="hidden font-label-mono text-xs text-secondary sm:block">
                {supportingProjects.length.toString().padStart(2, "0")} projects
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {supportingProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                wide={wideProjectIds.has(project.id)}
                index={PROJECTS.findIndex((item) => item.id === project.id)}
              />
            ))}
          </div>
        </div>
      )}

      {limit && (
        <div className="flex justify-center pt-4">
          <Link
            to="/projects"
            className={`${ACTION_BASE_CLASS} neu-raised neu-interactive px-7 py-4 text-primary`}
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            See all {PROJECTS.length} projects
            <span className="material-symbols-outlined text-base">arrow_outward</span>
          </Link>
        </div>
      )}
    </div>
  );
}

// Number of projects previewed on the home page before the "see all" CTA.
const HOME_PROJECT_LIMIT = 3;

export default function Projects() {
  return (
    <section className="scroll-mt-32 section" id="projects">
      <div className="mb-10 flex flex-col gap-6 reveal active md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3 font-label-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span>Selected work</span>
            <span className="h-px w-8 bg-primary/40" />
            <span>{PROJECTS.length} projects</span>
          </div>
          <h2 className="font-headline-lg text-4xl font-bold text-on-surface sm:text-5xl">
            Projects
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-on-surface-variant">
            AI systems, machine-learning experiments, and full-stack products—built to solve
            practical problems and demonstrate thoughtful engineering.
          </p>
        </div>

        <Link
          to="/projects"
          className="neu-raised neu-interactive flex w-max items-center gap-2 rounded-full px-5 py-3 font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Open full gallery
          <span className="material-symbols-outlined text-base">arrow_outward</span>
        </Link>
      </div>

      <ProjectResults limit={HOME_PROJECT_LIMIT} />
    </section>
  );
}
