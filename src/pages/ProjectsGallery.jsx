import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = ["All", "AI/ML", "Web App", "Tools"];

const projects = [
  {
    title: "AI Market Predictor",
    category: "AI/ML",
    description:
      "A machine learning model predicting stock market trends using historical data and sentiment analysis.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLoY9DSEwcQyXrf2Dd4Nrzv39-xVFGmoz4_yPmDAwaNqjJp1oVkCZHJEQ0eDeah0Xvv0iKUX8CpYuSCNO2fN1mu6RXyW39dInqOK1IPAL-WLlG6McWphd7Z9gFpUdC7OT54SD2xRZrHIIBU_OL64lY-Ox4EwvfxrWmmSq1XubLVQqv0Tt60Y213J41oxcWYAk950RWmIbCRl2s3snt88WC5Dz1VRIpHM_xIXSnDLLqfMKtCRObTNbM",
    alt: "A highly detailed, professional UI design presentation mockup showing a modern, dark-mode financial dashboard for an AI Market Predictor.",
    tech: ["Python", "TensorFlow", "Pandas"],
  },
  {
    title: "DevSync Workspace",
    category: "Web App",
    description:
      "A real-time collaborative workspace for developers featuring code sharing and instant messaging.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlm-r10ueQq8bPxzW4q8QjW08SYg3cTkHS9C5GWGusQuZzpIoKGRi6DiealLFPfYyix0E1bzrkHXHfYoz_ad9ZSp3BARjKzZHVa1K-_AZ94id_G99an1p-8x0biG9GuLKdBvJ81N0Ep1C-2u9S-dfMLCKKLZU_INzCHjq5opOvRwSW9-5Je_DvPsbcs6Ju2733RtdGSXo78ZvoKbcNHW2dWedwKX8hnELVV2DD9QonncU51vG_s_U6",
    alt: "A detailed, modern UI design mockup of a collaborative workspace application called DevSync.",
    tech: ["React", "Node.js", "Socket.io"],
  },
  {
    title: "Neural Style Transfer",
    category: "AI/ML",
    description:
      "Deep learning application that applies artistic styles to user-uploaded photographs in real-time.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYVl5zXIrFxTeMcOngIuVKTFldg6E5mklhB81fbN_BbZsQ6W_ISkiSRGz_57VXraDKOdKWNRl0YQ3IygzFmZr-VbifuMH1V0rs_zIiiUNXWoKGXIrY-o-KIZ7-0xNyknL-pPx6MUaEDv75B-q3fnfz4kNrefSN3gJdw1OEllW_G3WPEVF1Nc3-Lscd8n45OonPQOGRUKv1R3TDwSqJWBJhgfpfdbuBmoz-7ws0GFL_vhHvLzUuF6Zk",
    alt: "A visually striking representation of Neural Style Transfer.",
    tech: ["PyTorch", "OpenCV", "Flask"],
  },
];

export default function ProjectsGallery() {
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="font-body-md text-on-surface antialiased min-h-screen flex flex-col bg-[#d9d9d9]">
      <Navbar activeSection="projects" />

      <main className="max-w-container-max mx-auto px-gutter mb-24 mt-12 w-full flex-grow">
        <div className="text-center mb-16">
          <h1 className="font-display text-display text-on-surface mb-4">Projects Gallery</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            A collection of my work in AI, ML, and Software Engineering.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap gap-4 p-4 rounded-[28px] neumorphic-convex bg-[#d9d9d9]">
            {categories.map((category) => {
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-2 rounded-full font-label-mono text-label-mono bg-[#d9d9d9] transition-all ${
                    isActive
                      ? "text-primary neumorphic-concave-sm"
                      : "text-on-surface-variant neumorphic-convex-sm hover:text-primary active:neumorphic-concave-sm"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.title}
              className="rounded-[28px] p-6 neumorphic-convex bg-[#d9d9d9] flex flex-col"
            >
              <div className="w-full h-48 rounded-xl neumorphic-concave mb-6 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center opacity-80 mix-blend-multiply"
                  role="img"
                  aria-label={project.alt}
                  style={{ backgroundImage: `url('${project.image}')` }}
                ></div>
              </div>

              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
                {project.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-label-mono neumorphic-convex-sm text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-auto">
                <button className="flex-1 py-2 rounded-full font-label-mono text-sm neumorphic-convex-sm text-on-surface hover:text-primary transition-all active:neumorphic-concave-sm">
                  GitHub
                </button>
                <button className="flex-1 py-2 rounded-full font-label-mono text-sm neumorphic-convex-sm text-primary hover:text-primary-container transition-all active:neumorphic-concave-sm">
                  Live Demo
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
