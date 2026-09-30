import { useState } from "react";
import { CONTACT, CONTACT_LINKS } from "../data/contact";

const INPUT_CLASS =
  "w-full bg-surface neu-raised rounded-xl px-4 py-3 border-none outline-none transition-shadow text-on-surface focus:ring-2 focus:ring-primary";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError("");
  };

  // No backend to post to, so compose the message in the visitor's mail client.
  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError("Please fill in your name, email and a message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email address doesn't look right — could you double-check it?");
      return;
    }

    const subject = `Portfolio enquiry from ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
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
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.key}
                className="flex items-center gap-4 group"
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <div className="neu-recessed w-14 h-14 shrink-0 rounded-full flex items-center justify-center group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">{link.icon}</span>
                </div>
                {/* min-w-0 lets this flex child shrink below its content width.
                    Without it the 24-character email address sets a min-content
                    floor and pushes the row past a 320px viewport. */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-secondary">{link.label}</p>
                  <p className="font-bold text-lg group-hover:text-primary transition-colors break-all">
                    {link.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="neu-recessed rounded-2xl p-8">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2" htmlFor="name">
                Name
              </label>
              <input
                className={INPUT_CLASS}
                id="name"
                name="name"
                placeholder="John Doe"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={INPUT_CLASS}
                id="email"
                name="email"
                placeholder="john@example.com"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className={`${INPUT_CLASS} resize-none`}
                id="message"
                name="message"
                placeholder="Your message here..."
                rows="4"
                value={form.message}
                onChange={handleChange("message")}
              ></textarea>
            </div>

            {error && (
              <p
                className="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error"
                role="alert"
              >
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </p>
            )}

            <button
              className="neu-raised neu-interactive flex w-full flex-wrap items-center justify-center gap-2 rounded-xl px-4 py-4 text-center text-lg font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              type="submit"
            >
              Send Message <span className="material-symbols-outlined">send</span>
            </button>

            <p className="text-center text-xs leading-5 text-secondary">
              Opens your email app with the message pre-filled — nothing is stored or
              sent through a third party.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
