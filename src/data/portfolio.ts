import type { PortfolioData } from "../types/terminal";

export const portfolioData: PortfolioData = {
  name: "Khalid",
  title: "Full Stack Developer",
  bio: "Passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through clean, efficient code.",
  skills: [
    "JavaScript/TypeScript",
    "React.js",
    "Node.js",
    "Laravel/PHP",
    // "Python",
    "SQL/NoSQL Databases",
    "Docker",
    // "AWS",
    "Git/GitHub",
    "REST APIs",
    "GraphQL",
    "Tailwind CSS",
  ],
  projects: [
    {
      id: "project1",
      name: "Terminal Portfolio",
      description: "Interactive Linux terminal-style portfolio website",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      githubUrl: "https://github.com/khld-musa/terminal-portfolio",
      liveUrl: "https://khalid-portfolio.dev",
      details:
        "A unique portfolio experience that simulates a Linux terminal interface. Features command-line navigation, interactive commands, and easter eggs for a memorable user experience.",
    },
    {
      id: "project2",
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with admin dashboard",
      technologies: ["Laravel", "Vue.js", "MySQL", "Stripe API"],
      githubUrl: "https://github.com/khld-musa/ecommerce-platform",
      details:
        "Complete e-commerce platform with user authentication, product management, cart functionality, payment processing, and comprehensive admin panel.",
    },
    {
      id: "project3",
      name: "Task Management API",
      description: "RESTful API for task and project management",
      technologies: ["Node.js", "Express", "MongoDB", "JWT"],
      githubUrl: "https://github.com/khld-musa/task-api",
      details:
        "Robust API with user authentication, CRUD operations, real-time updates, and comprehensive documentation. Includes rate limiting and security best practices.",
    },
  ],
  contact: {
    email: "khalidmusa249@gmail.com",
    linkedin: "https://linkedin.com/in/khalid-dev",
    github: "https://github.com/khld-musa",
    phone: "+249 999 288 56",
    location: "Khartoum, Sudan",
  },
  resume: {
    summary:
      "Experienced full-stack developer with 5+ years building scalable web applications. Proven track record in both startup and enterprise environments.",
    downloadUrl: "/resume-khalid.pdf",
    lastUpdated: "September 2025",
  },
};
