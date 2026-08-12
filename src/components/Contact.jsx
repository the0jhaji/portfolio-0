const contactLinks = [
  {
    href: "mailto:ojhaadarsh424@gmail.com",
    icon: "mail",
    label: "Email",
    value: "ojhaadarsh424@gmail.com",
  },
  {
    href: "https://www.linkedin.com/in/adarsh-ojha-2204b3322/",
    icon: "link",
    label: "LinkedIn",
    value: "in/adarsh-ojha",
  },
];

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="scroll-mt-32 section" id="contact">
      <h2 className="font-headline-lg text-4xl font-bold text-on-surface mb-12 reveal active">
        Get In Touch
      </h2>

      <div className="neu-raised rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 reveal stagger-1 active">
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-3xl font-bold mb-4">Let's build something together.</h3>
            <p className="text-secondary text-lg">
              Currently open for new opportunities. Whether you have a question or
              just want to say hi, I'll try my best to get back to you!
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {contactLinks.map((link) => (
              <a key={link.label} className="flex items-center gap-4 group" href={link.href}>
                <div className="neu-recessed w-14 h-14 rounded-full flex items-center justify-center group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">{link.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-secondary">{link.label}</p>
                  <p className="font-bold text-lg group-hover:text-primary transition-colors">
                    {link.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="neu-recessed rounded-2xl p-8">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full bg-surface neu-raised rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary outline-none transition-shadow text-on-surface"
                id="name"
                placeholder="John Doe"
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full bg-surface neu-raised rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary outline-none transition-shadow text-on-surface"
                id="email"
                placeholder="john@example.com"
                type="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full bg-surface neu-raised rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary outline-none transition-shadow text-on-surface resize-none"
                id="message"
                placeholder="Your message here..."
                rows="4"
              ></textarea>
            </div>
            <button
              className="neu-raised neu-interactive py-4 rounded-xl text-primary font-bold text-lg w-full flex items-center justify-center gap-2"
              type="submit"
            >
              Send Message <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
