export const initialProfile = {
  name: "Memeriaw Adugnaw",
  title: "Fullstack and Short Form Video Editor",
  subtitle: "Building practical digital solutions through software development, database systems, and user-focused web applications.",
  bio: "Final-year Information Systems student at Bahir Dar University, passionate about software development, database systems, and building technology that solves real-world problems. I am developing my skills in modern web technologies, system design, and user-centered digital solutions.",
  photoUrl: "/images/profile.jpg",
  education: "Final-year BSc in Information Systems",
  university: "Bahir Dar University",
  location: "Bahir Dar, Ethiopia",
  email: "memeriawadugnaw@gmail.com",
  telegram: "@lectern21",
  telegramUrl: "https://t.me/lectern21",
  linkedin: "memeriaw-adugnaw-42a697442",
  linkedinUrl: "https://www.linkedin.com/in/memeriaw-adugnaw-42a697442",
  github: "https://github.com/Memeriaw",
  resumeUrl: "/resume.pdf",
  availableForWork: true,
  yearsExperience: "3+",
  projectsCompleted: "25+",
  clientSatisfaction: "100%"
};

export const initialSkills = [
  { name: "React & Vite", category: "frontend", level: 92, icon: "Code2" },
  { name: "JavaScript (ES6+)", category: "frontend", level: 90, icon: "FileCode" },
  { name: "HTML5 & Modern CSS", category: "frontend", level: 95, icon: "Layout" },
  { name: "Node.js & Express", category: "backend", level: 88, icon: "Server" },
  { name: "MongoDB & Mongoose", category: "database", level: 86, icon: "Database" },
  { name: "SQL & Relational DBs", category: "database", level: 85, icon: "Database" },
  { name: "RESTful API Architecture", category: "backend", level: 90, icon: "Network" },
  { name: "Java (OOP & Systems)", category: "backend", level: 82, icon: "Coffee" },
  { name: "C++ (Data Structures)", category: "systems", level: 80, icon: "Cpu" },
  { name: "Video Editing & Pace Cutting", category: "creative", level: 95, icon: "Film" },
  { name: "Color Grading & LUTs", category: "creative", level: 90, icon: "Palette" },
  { name: "Motion Graphics & VFX", category: "creative", level: 85, icon: "Sparkles" },
  { name: "Audio Engineering & SFX", category: "creative", level: 88, icon: "Radio" },
  { name: "Git & Version Control", category: "tools", level: 90, icon: "GitBranch" }
];

export const initialProjects = [
  {
    id: "project-1",
    slug: "omniflow-erp-inventory-suite",
    title: "OmniFlow Business ERP & Inventory Suite",
    category: "fullstack",
    categoryLabel: "Full-Stack Web App",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    description: "Enterprise-grade inventory management and sales analytics platform built with Node.js backend, robust SQL database schemas, and modern responsive JavaScript UI.",
    fullDescription: "OmniFlow is a comprehensive business management suite designed to handle enterprise inventory tracking, warehouse logistics, real-time stock replenishment alerts, and multi-user role management. The system incorporates sub-millisecond query indexing and transaction isolation.",
    tech: ["Node.js", "Express", "MongoDB", "SQL", "React", "REST API"],
    liveUrl: "https://example.com/demo/omniflow",
    repoUrl: "https://github.com",
    metrics: "Reduced inventory tracking latency by 45%",
    featured: true,
    published: true,
    createdAt: "2026-02-15"
  },
  {
    id: "project-2",
    slug: "cinematic-brand-commercial-reel",
    title: "Cinematic Brand Commercial & Product Reel",
    category: "creative",
    categoryLabel: "Video Editing & Color Grading",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "High-octane commercial edit featuring dynamic speed-ramping, bespoke sound design, custom cinematic color grading, and modern kinetic typography.",
    fullDescription: "Produced and edited a broadcast-quality visual commercial. Incorporated high-speed masking, sound-synced transitions, DaVinci Resolve color pipelines, and 4K kinetic text overlays tailored for conversion.",
    tech: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Sound Design"],
    liveUrl: "https://example.com/reel",
    repoUrl: "",
    metrics: "+120K Views • 65% Retention Rate",
    featured: true,
    published: true,
    createdAt: "2026-03-01"
  },
  {
    id: "project-3",
    slug: "finpulse-realtime-dashboard",
    title: "FinPulse Real-Time Financial Dashboard",
    category: "fullstack",
    categoryLabel: "Full-Stack Web App",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    description: "Interactive data visualization dashboard that aggregates financial metrics, generates custom SQL reports, and provides real-time transaction tracking.",
    fullDescription: "FinPulse enables financial analysts to monitor multi-currency cash flows, forecast budget trends with predictive curves, and export compliance audits. Features WebSockets for real-time live tickers.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Chart.js"],
    liveUrl: "https://example.com/finpulse",
    repoUrl: "https://github.com",
    metrics: "Sub-millisecond query execution",
    featured: true,
    published: true,
    createdAt: "2026-03-20"
  },
  {
    id: "project-4",
    slug: "viral-short-form-content-reels",
    title: "Viral Short-Form Content (Reels & TikTok)",
    category: "creative",
    categoryLabel: "Social Media Video",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Snappy, retention-focused video edits designed for social platforms with eye-catching hooks, audio-synced jump cuts, seamless B-roll transitions, and animated captions.",
    fullDescription: "Created high-retention vertical short-form video content specifically crafted for algorithmic engagement on TikTok, Instagram Reels, and YouTube Shorts.",
    tech: ["Fast Pacing", "CapCut Pro", "Premiere Pro", "Audio Syncing"],
    liveUrl: "https://example.com/shorts",
    repoUrl: "",
    metrics: "Over 250K+ organic views generated",
    featured: false,
    published: true,
    createdAt: "2026-04-05"
  },
  {
    id: "project-5",
    slug: "campuscore-academic-system",
    title: "CampusCore Academic Management System",
    category: "fullstack",
    categoryLabel: "Java & SQL Backend Suite",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    description: "Information Systems academic portal developed with Java OOP principles, relational SQL database structures, and secure session management.",
    fullDescription: "Comprehensive university portal automating student course enrollments, grade calculations, professor schedules, and department record audits with role-based access control.",
    tech: ["Java", "SQL", "Node.js", "RESTful API", "MVC Pattern"],
    liveUrl: "https://example.com/campuscore",
    repoUrl: "https://github.com",
    metrics: "Engineered for 5,000+ concurrent students",
    featured: false,
    published: true,
    createdAt: "2026-05-10"
  },
  {
    id: "project-6",
    slug: "documentary-story-youtube-edit",
    title: "Documentary & Story-Driven YouTube Edit",
    category: "creative",
    categoryLabel: "Long-Form Video Editing",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Engaging long-form narrative editing with ambient soundscapes, archival footage restoration, clean subtitles, and emotional pacing.",
    fullDescription: "Directed and edited an in-depth 25-minute documentary piece focusing on culture and technology evolution. Features multi-track audio mastering and customized LUT color treatment.",
    tech: ["Story Pacing", "Audio Mastering", "DaVinci Resolve", "B-Roll Stitching"],
    liveUrl: "https://example.com/doc",
    repoUrl: "",
    metrics: "Average watch time increased by 38%",
    featured: false,
    published: true,
    createdAt: "2026-06-15"
  },
  {
    id: "project-7",
    slug: "algoengine-cpp-math-processor",
    title: "AlgoEngine C++ High-Speed Math Processor",
    category: "systems",
    categoryLabel: "Systems & Algorithms (C++)",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    description: "Optimized computational library implemented in C++ featuring multi-threaded matrix operations, cache optimization, and memory profiling.",
    fullDescription: "High-performance mathematical computation core written in modern C++. Handles linear algebra computations, fast Fourier transformations, and multi-threaded parallel vector operations.",
    tech: ["C++", "Memory Management", "Algorithms", "Data Structures"],
    liveUrl: "https://example.com/algoengine",
    repoUrl: "https://github.com",
    metrics: "3.8x faster than traditional interpreted scripts",
    featured: true,
    published: true,
    createdAt: "2026-07-22"
  }
];

export const initialExperiences = [
  {
    id: "exp-1",
    role: "Full-Stack Software Engineer",
    company: "Tech Systems Solutions",
    period: "2024 - Present",
    location: "Addis Ababa, Ethiopia",
    description: "Architecting full-stack web applications with React, Node.js, Express, and MongoDB/SQL. Building secure RESTful APIs, implementing JWT authentication, and optimizing database query performance."
  },
  {
    id: "exp-2",
    role: "Creative Media & Video Lead",
    company: "Freelance & Digital Studios",
    period: "2023 - Present",
    location: "Remote / Hybrid",
    description: "Creating commercial edits, YouTube documentary storytelling, and viral social short-form video campaigns. Specializing in Premiere Pro, DaVinci Resolve color grading, and sound design."
  },
  {
    id: "exp-3",
    role: "Information Systems Graduate",
    company: "University Degree Program",
    period: "Graduated",
    location: "Addis Ababa, Ethiopia",
    description: "Completed Bachelor of Science (BSc) in Information Systems. Studied advanced software architecture, relational database management, systems analysis, OOP, and data structures."
  }
];

export const initialTestimonials = [
  {
    id: "test-1",
    name: "Abebe Kebede",
    role: "Project Manager at FinTech Innovations",
    comment: "Memeriaw delivered an exceptionally performant web platform for our inventory monitoring. His dual mastery of backend logic and clean frontend design made the whole process seamless.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "test-2",
    name: "Sarah Jenkins",
    role: "Content Director",
    comment: "His video editing and storytelling instincts are second to none. He turned raw B-roll footage into a polished, high-converting commercial that boosted our campaign engagement by over 60%.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  }
];
