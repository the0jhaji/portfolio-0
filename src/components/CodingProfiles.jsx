const profiles = [
  {
    icon: "code",
    title: "LeetCode",
    subtitle: "Problem Solving",
    href: "https://leetcode.com/u/the_ojhaji9/",
  },
  {
    icon: "terminal",
    title: "Code Studio",
    subtitle: "Interview Prep",
    href: "https://www.naukri.com/code360/profile/ddf27d2b-6ced-4714-b375-0ea2e57db755",
  },
  {
    icon: "school",
    title: "GeeksforGeeks",
    subtitle: "DSA & Theory",
    href: "https://www.geeksforgeeks.org/profile/theojhy2zk",
  },
];

export default function CodingProfiles() {
  return (
    <section className="scroll-mt-32 section" id="coding-profiles">
      <h2 className="font-headline-lg text-4xl font-bold text-on-surface mb-12 reveal active">
        Coding Profiles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {profiles.map((profile, index) => (
          <a
            key={profile.title}
            href={profile.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`neu-raised neu-interactive rounded-3xl p-8 flex flex-col items-center justify-center gap-4 group transition-all duration-300 reveal stagger-${
              index + 1
            } active`}
          >
            <div className="neu-recessed w-16 h-16 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">{profile.icon}</span>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-xl text-on-surface">{profile.title}</h3>
              <p className="text-sm text-secondary mt-1">{profile.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
