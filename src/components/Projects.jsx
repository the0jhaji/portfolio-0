const projects = [
  {
    title: "Aura Analytics",
    tag: "Web Dev",
    tagColor: "text-primary bg-primary/10",
    description:
      "A high-fidelity dashboard interface for modern web applications featuring real-time data visualizations.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQlqyINeahuNhTndIbWMNiUs0OfhuP8bqXlvqTpvn9J8t_tCao8fb7n-51bD3DYiDblKqvbaMUafGu8zlOhVYFgER_p1gVRgfPL2eJiIgjsaDX_HV9qW58tqh4t30jyxRW3AMIb1T_CFYV4_mkabUr67ynAGWmoBgXchz0tf3w2-vswExVzGyi7dbCgu7MgeeIrqoRVCfigJqiSz3wuVQ6mNvCdnbReSy_K-uThwqdzoDes8bqj98s",
    tech: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "TaskFlow Pro",
    tag: "Web Dev",
    tagColor: "text-primary bg-primary/10",
    description:
      "Minimalist task management system with soft shadows and a focus on functional productivity.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBdYuGw1y8BBo0V96kgYFpWMZJuQ1K_W1qqdUiZDypnLHi-4ZsC6erBtQlvfcvgHbb94bIMCT8ihxKhV13Oee9almYOnFRziwKgNZeD3Fli00zhU_sTv5Ac09X6IJiaiEfmCk1ildIaXMEN0OoswF7eqjfUreWEPXv8tnmzIlk-D5Px9D0yoFn4M8kQ2qYY8rPBlN_eu_ZLmjwfaVNemqHJs2hR3-ND1ayJi4WwWp7-8qZrnIPwkWB",
    tech: ["Next.js", "Tailwind", "TypeScript"],
  },
  {
    title: "Transformer-XL Viz",
    tag: "AI / ML",
    tagColor: "text-green-600 bg-green-500/10",
    description:
      "Sophisticated neural network visualization dashboard for monitoring training status and accuracy.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfbAiRJsBU76HtY8dDw8Ig3LRVFpxOWx6GyV9X5sRB0-IMrzz-_f0-ahwFqwmstHu4RARjKeESKMJuV6vGVRvxfXl9efsxmGtRwfVda8QgGk5mGVWQ9WtBCPOLt-jVHSW9H7_WM0BIgYIA7-2vMq4KmcrxuHkib9VcLhbIiFQ8IV9aUCUeXaepBx9v2yRSFypUrZVdbH5rfeeGNTG1xfPhhIUaz27OJngNPd4nQG7JZjaHB3C9wGrJ",
    tech: ["Python", "TensorFlow", "Pandas"],
  },
  {
    title: "Project Alpha ML",
    tag: "AI / ML",
    tagColor: "text-green-600 bg-green-500/10",
    description:
      "Predictive analytics platform for anomaly detection and model performance tracking.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRPlzbj7NGHXPCTUnf4Hk6GJYu0LV_FeiSGKRF0iyJyrEnsNldK8NwXHdQmpGzWGjS5QEJAkdXUZti7BTzWMbInSz3GRKPM_GN8wmINuLd8WstaNvsbMnDPsiJQ6S_YGIWnH-NksAdYFh-3_cFCc9NJKIKJ-ZIepywsMHMluBtb9nJdS44GJacyIsInVc8RoLQnZap4t5hyA-W3FY47ubxaOXbOpMTzDjwj-z6EJfSu5LEE0KH8mJk",
    tech: ["PyTorch", "Scikit-learn", "Matplotlib"],
  },
];

export default function Projects() {
  return (
    <section className="scroll-mt-32 section" id="projects">
      <h2 className="font-headline-lg text-4xl font-bold text-on-surface mb-12 reveal active">
        Projects
      </h2>

      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`neu-raised rounded-3xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-transform duration-300 reveal stagger-${
                index + 1
              } active`}
            >
              <div className="aspect-video rounded-2xl overflow-hidden neu-recessed mb-2">
                <img
                  alt={project.title}
                  className="w-full h-full object-cover"
                  src={project.image}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-on-surface">{project.title}</h3>
                  <span
                    className={`text-xs font-label-mono uppercase tracking-widest px-2 py-1 rounded-full ${project.tagColor}`}
                  >
                    {project.tag}
                  </span>
                </div>
                <p className="text-secondary text-sm line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-surface rounded-full text-xs font-medium text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="neu-raised neu-interactive flex-grow py-2 rounded-full text-primary font-bold text-sm flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">code</span>
                    GitHub
                  </button>
                  <button className="neu-raised neu-interactive flex-grow py-2 rounded-full text-on-surface font-bold text-sm flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Demo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="neu-raised neu-interactive px-10 py-4 rounded-full text-primary font-bold text-lg flex items-center gap-2 transition-all">
            View All Projects <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
