// ─────────────────────────────────────────────────────────────────────
//  ENGENIA 2026 — single source of truth for site copy.
//  Everything below is placeholder content carried over from ENGENIA 2025.
//  Replace the values here and the whole site updates.
// ─────────────────────────────────────────────────────────────────────

export const festival = {
  name: "ENGENIA",
  year: "2026",
  tagline: "Experience the Extravaganza",
  dates: "Sep 11 — 2026",
  // Used by the hero countdown. Pinned to IST, so the clock hits zero at the
  // opening in Chennai and not in whatever timezone the reader happens to be.
  startsAt: "2026-09-11T09:00:00+05:30",
  college: "Loyola-ICAM College of Engineering and Technology",
  collegeShort: "LICET",
  location: "Bertram Hall, Loyola Campus, Chennai",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Gallery", href: "/gallery" },
  { label: "Updates", href: "/announcements" },
];

export const about = {
  heading: "About EnGenia",
  body:
    "EnGenia is one of the facets of vibrant campus life at LICET. It is a two day annual cultural fest for students to reinvent their talents, showcase their creative and innovative skills. EnGenia fosters self-belief, perseverance, hard work and most of all, teamwork among the participants and encourages a healthy competition between the departments.",
  stats: [
    { value: 32, suffix: "", label: "Events" },
    { value: 7, suffix: "", label: "Departments" },
    { value: 2, suffix: "", label: "Days" },
    { value: 1500, suffix: "+", label: "Participants" },
  ],
  // Each pillar borrows one of the cultural figures painted into the logo,
  // and one letter hue, so the four read as a set rather than a grid.
  pillars: [
    {
      title: "Academic Excellence",
      body: "Preparing students with value-added courses and skill-based training",
      motif: "mask",
      hue: "ember",
    },
    {
      title: "Professionalism",
      body: "Excelling through interaction and integration with industries",
      motif: "moonwalker",
      hue: "crimson",
    },
    {
      title: "Holistic Formation",
      body: "Overall growth through sports and cultural activities",
      motif: "guitar",
      hue: "azure",
    },
    {
      title: "International Exposure",
      body: "World-class exposure through university collaborations",
      motif: "ballerina",
      hue: "jade",
    },
  ],
};

// Roster only — no points. Standings are summed from the event results in
// events.js by lib/standings.js, so there is one source of truth for a score.
export const departments = [
  { code: "IT", name: "Information Technology", accent: "#ffc554" },
  { code: "CSE-B", name: "Computer Science & Engineering — Section B", accent: "#f47115" },
  { code: "CSE-A", name: "Computer Science & Engineering — Section A", accent: "#d3133e" },
  { code: "ECE", name: "Electronics & Communication Engineering", accent: "#077faf" },
  { code: "MECH", name: "Mechanical Engineering", accent: "#05bbae" },
  { code: "EEE", name: "Electrical & Electronics Engineering", accent: "#d41350" },
  { code: "AIDS", name: "Artificial Intelligence & Data Science", accent: "#069568" },
];

export const highlights = [
  {
    src: "/gallery/1.webp",
    title: "Valedictory Ceremony — ENGENIA 2024",
    body:
      "The Valedictory Ceremony of ENGENIA 2024 at Loyola-ICAM College of Engineering and Technology (LICET), graced by Chief Guest T. J. Gnanavel, renowned film director and screenwriter.",
  },
  {
    src: "/gallery/2.webp",
    title: "Cultural Dance Extravaganza",
    body:
      "A captivating group performance blending artistry and innovation, where rhythm and synchronized movements created a visual spectacle on stage.",
  },
  {
    src: "/gallery/3.webp",
    title: "Live Musical Performance",
    body: "Electrifying band performance filling the atmosphere with energy, passion, and rhythm.",
  },
  {
    src: "/gallery/4.webp",
    title: "Channel Surfing Event",
    body: "Channel Surfing brought vibrant energy to the stage, reflecting the spirit of fun and imagination.",
  },
  {
    src: "/gallery/5.webp",
    title: "Special Walk-in Guest Appearance — Arivu",
    body: "A surprise appearance by Arivu brought excitement and joy to the cultural celebrations.",
  },
  {
    src: "/gallery/6.webp",
    title: "Celebrating the Champions",
    body: "The winners of the cultural extravaganza proudly celebrating their achievements on the grand stage.",
  },
];

export const titleSponsor = {
  name: "Aram Foundations",
  logo: "/sponsors/aram.jpg",
  label: "Title Sponsor",
};

export const sponsors = [
  { name: "Liberty Leather Stores", logo: "/sponsors/liberty.jpeg" },
  { name: "Skylark Technologies", logo: "/sponsors/skylark.jpg" },
  { name: "The Education Company", logo: "/sponsors/education-company.png" },
  { name: "Thangavel Nadar Stores", logo: "/sponsors/thangavel-nadar.jpeg" },
  { name: "His Image", logo: "/sponsors/his-image.png" },
  { name: "Indian Overseas Bank", logo: "/sponsors/iob.jpg" },
  { name: "DCB Bank", logo: "/sponsors/dcb-bank.svg" },
  { name: "South Indian Bank", logo: "/sponsors/south-indian-bank.png" },
  { name: "Bakery Bar", logo: "/sponsors/bakery-bar.jpg" },
];

export const announcements = [
  {
    id: "offstage-photos",
    title: "Offstage Event Photos Now Available",
    content:
      "We're pleased to share that photos from the Offstage Events have now been added to our gallery. You're invited to explore the newly uploaded images and revisit some of the memorable moments captured during the event.",
    createdAt: "2025-10-30T13:07:28",
  },
  {
    id: "valedictory",
    title: "Valedictory Event",
    content:
      "Dear Students, the Valedictory Event will start shortly after the Group Dance Results. So everyone is requested not to leave Bertram Hall. Your cooperation and support are expected for the successful completion of ENGENIA 2025.",
    createdAt: "2025-09-30T12:04:01",
  },
];

export const contact = {
  email: "engenia@licet.ac.in",
  address: "Loyola College Campus, Nungambakkam, Chennai 600 034",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};
