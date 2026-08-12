const stats = [
  { value: "100+", label: "DSA Problems" },
  { value: "15+", label: "Projects Built" },
  { value: "7.2", label: "CGPA" },
  { value: "4+", label: "Certifications" },
];

const timeline = [
  {
    title: "B.Tech in CSE (AI/ML)",
    tag: "2024 - 2028",
    school: "Netaji Subhash Engineering College",
    location: "Gariya, Kolkata, 700152",
  },
  {
    title: "12th (PCM)",
    tag: "2020 - 2022",
    school: "J.P College Ara, Bihar",
  },
  {
    title: "10th Grade",
    school: "M.D Carmel School",
    location: "Jagdishpur, Ara, Bihar",
  },
];

export default function About() {
  return (
    <section className="scroll-mt-32 section" id="about">
      <h2 className="font-headline-lg text-4xl font-bold text-on-surface mb-12 reveal active">
        About Me
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 font-body-lg text-secondary flex flex-col gap-6 text-lg reveal stagger-1 active">
          <p>
            I am a computer science student with a deep interest in artificial
            intelligence and robust software engineering.
          </p>
          <p>
            My journey involves constant learning, breaking things, and building
            them back better. I believe in writing code that is not just
            functional, but maintainable and scalable.
          </p>

          <div className="neu-recessed rounded-2xl p-6 mt-4">
            <h4 className="font-bold text-on-surface mb-4">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center p-2">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs font-medium text-secondary uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
          <div className="neu-raised rounded-3xl p-8 md:p-10 col-span-full reveal stagger-2 active">
            <h3 className="font-bold text-2xl mb-8 text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">school</span>
              Education Timeline
            </h3>
            <div className="relative border-l-2 border-primary/30 ml-4 flex flex-col gap-10">
              {timeline.map((item, index) => (
                <div
                  key={item.title}
                  className={`relative pl-8 reveal stagger-${index + 3} active`}
                >
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-surface border-4 border-primary shadow-[0_0_10px_rgba(53,37,205,0.5)]"></div>
                  <div className="flex flex-col mb-1">
                    <h4 className="text-xl font-bold text-on-surface">{item.title}</h4>
                    {item.tag && (
                      <span className="font-label-mono text-primary font-medium bg-primary/10 px-3 py-1 rounded-full text-xs w-fit mt-2">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-secondary font-medium">{item.school}</p>
                  {item.location && (
                    <p className="text-sm text-secondary/80">{item.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
