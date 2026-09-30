// Single source of truth for contact details.
// Update these values here and they propagate across the Hero, Contact, and Footer.

export const CONTACT = {
  name: "Adarsh Ojha",
  email: "ojhaadarsh424@gmail.com",
  // Indian mobile number, stored in international format for tel: links.
  phoneDisplay: "+91 72558 70959",
  phoneHref: "tel:+917255870959",
  linkedin: "https://www.linkedin.com/in/adarsh-ojha-2204b3322/",
  github: "https://github.com/the0jhaji",
};

export const SOCIAL_LINKS = [
  {
    key: "github",
    label: "GitHub",
    href: CONTACT.github,
    icon: "github",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: CONTACT.linkedin,
    icon: "link",
  },
  {
    key: "email",
    label: "Email",
    href: `mailto:${CONTACT.email}`,
    icon: "mail",
  },
  {
    key: "phone",
    label: "Phone",
    href: CONTACT.phoneHref,
    icon: "call",
  },
];

export const CONTACT_LINKS = [
  {
    key: "email",
    icon: "mail",
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    key: "phone",
    icon: "call",
    label: "Phone",
    value: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
  },
  {
    key: "linkedin",
    icon: "link",
    label: "LinkedIn",
    value: "in/adarsh-ojha-2204b3322",
    href: CONTACT.linkedin,
  },
];
