const skills = [
  {
    icon: "code",
    title: "Languages",
    items: ["Python", "Java", "TypeScript", "C++", "JavaScript", "C"],
  },
  {
    icon: "web",
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind", "HTML", "CSS"],
  },
  {
    icon: "dns",
    title: "Backend",
    items: ["Node.js", "Express", "Django"],
  },
  {
    icon: "database",
    title: "Database",
    items: ["PostgreSQL", "MongoDB", "Redis"],
  },
  {
    icon: "smart_toy",
    title: "AI / ML",
    items: ["TensorFlow", "PyTorch", "Pandas"],
  },
  {
    icon: "terminal",
    title: "Tools",
    items: ["Git", "Docker", "AWS", "Linux"],
  },
];

export default function Skills() {
  return (
    <section className="scroll-mt-32 section" id="skills">
      <h2 className="font-headline-lg text-4xl font-bold text-on-surface mb-12 reveal active">
        Tech Stack
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill, index) => (
          <div
            key={skill.title}
            className={`neu-raised rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-transform duration-300 reveal stagger-${
              index + 1
            } active`}
          >
            <div className="flex items-center gap-4">
              <div className="neu-recessed p-4 rounded-full flex items-center justify-center group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">{skill.icon}</span>
              </div>
              <h3 className="font-bold text-xl">{skill.title}</h3>
            </div>
            <div className="neu-recessed rounded-xl p-4 flex flex-wrap gap-2 mt-2">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
