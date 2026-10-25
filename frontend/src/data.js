export const profile = {
  name: 'Memeriaw Adugnaw',
  initials: 'MA',
  role: 'Information Systems student',
  headline: 'Building thoughtful digital experiences.',
  intro:
    "I'm an Information Systems student at Bahir Dar University, building a strong foundation in software development and exploring how technology can solve everyday problems.",
  location: 'Bahir Dar, Ethiopia',
  degree: 'BSc Information System',
  university: 'Bahir Dar University',
  graduation: 'Expected 2027',
  email: 'memeriawadugnaw@gmail.com',
  cvUrl: '',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Memeriaw', short: 'GH' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/memeriaw-adugnaw-42a697442',
      short: 'in',
    },
    { label: 'Telegram', href: 'https://t.me/Lectern21', short: 'TG' },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@Elman_united',
      short: 'YT',
    },
  ],
};

export const skills = [
  {
    category: 'Programming',
    detail: 'Languages I am learning and working with',
    items: ['C++', 'Java', 'JavaScript', 'PHP', 'Dart'],
  },
  {
    category: 'Web development',
    detail: 'Core technologies for the web',
    items: ['HTML', 'CSS', 'React', 'Node.js', 'REST APIs'],
  },
  {
    category: 'Design & process',
    detail: 'Ways I approach building useful interfaces',
    items: ['UI/UX', 'Prototyping', 'Problem solving', 'Testing'],
  },
];

export const highlights = [
  {
    label: 'Current focus',
    value: 'Frontend + web apps',
    detail: 'Building interactive interfaces and learning full-stack workflows.',
  },
  {
    label: 'Learning pace',
    value: 'Learn by building',
    detail: 'Turning new ideas into practical prototypes and case studies.',
  },
  {
    label: 'Approach',
    value: 'User-first',
    detail: 'Starting with real needs, simple flows, and clean interfaces.',
  },
];

export const education = [
  {
    institution: 'Bahir Dar University',
    qualification: 'BSc Information System',
    period: 'Expected graduation · 2027',
    location: 'Bahir Dar, Ethiopia',
    description:
      'Studying information systems, with a growing focus on software development and practical technology.',
  },
];

export const projects = [
  {
    slug: 'campus-event-hub',
    title: 'Campus Event Hub',
    category: 'Web App',
    description: 'A concept for helping students discover campus activities and manage event plans.',
    details:
      'This learning concept explores how a student portal could make campus events easier to find and join. Potential features include clear event details, category filters, and a simple RSVP flow.',
    technologies: ['React', 'JavaScript', 'CSS', 'Responsive UI'],
    status: 'Concept',
  },
  {
    slug: 'study-planner',
    title: 'Study Planner',
    category: 'Productivity',
    description: 'A productivity concept for organizing courses, tasks, and study deadlines.',
    details:
      'This concept explores a calm way to organize coursework and deadlines. Possible features include grouped tasks, a weekly schedule, and a lightweight progress view.',
    technologies: ['React', 'State Management', 'UX Design', 'Planning UI'],
    status: 'Design exploration',
  },
  {
    slug: 'portfolio-showcase',
    title: 'Portfolio Showcase',
    category: 'Portfolio',
    description: 'This portfolio site presents profile information, learning goals, and contact details.',
    details:
      'The portfolio brings together profile, education, skills, projects, and contact details. It includes responsive layouts, a persistent light/dark theme preference, project discovery tools, and accessible navigation.',
    technologies: ['React', 'Vite', 'Responsive Design', 'Accessibility'],
    status: 'Current portfolio',
  },
];