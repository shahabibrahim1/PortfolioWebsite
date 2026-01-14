import { Zap, Brain, TrendingUp, FileText } from "lucide-react";

export const FEATURED_PROJECTS = [
  {
    title: "Flappy Ball",
    dates: "Sep 2024 – Feb 2025",
    stack: ["JavaScript", "HTML", "CSS"],
    description:
      "A Flappy Bird-inspired browser game with tuned physics, animations, collision detection, and smooth controls.",
    highlights: [
      "Event-driven input handling",
      "Collision detection + game state transitions",
      "Polished feel through animation + tuning",
    ],
    repoUrl: "https://github.com/shahabibrahim1/FlappyBall",
    liveUrl: "https://shahabibrahim1.github.io/FlappyBall/", 
    icon: Zap,
  },
    {
    title: "Sudoku Solver",
    dates: "Apr 2025",
    stack: ["Java", "Algorithms", "Backtracking"],
    description:
      "A Sudoku solver that uses a classic backtracking approach to fill the board efficiently and correctly.",
    highlights: [
      "Backtracking search with validity checking",
      "Constraint-based pruning to reduce search",
      "Clean structure for readability and extension",
    ],
    repoUrl: "https://github.com/shahabibrahim1/SudokuSolver",
    liveUrl: "https://shahabibrahim1.github.io/SudokuSolver/", 
    icon: Brain,
  },
  {
    title: "Moodify",
    dates: "Jan 2025 – Apr 2025",
    stack: ["Java", "XML", "Firebase"],
    description:
      "Android app where users share moods with optional context/photos, follow others, and manage privacy settings.",
    highlights: [
      "UI/UX with XML layouts connected to a Java backend",
      "Auth + follow features",
      "Real-time notifications via Firebase Cloud Messaging",
    ],
    repoUrl: "https://github.com/cmput301-w25/project-nullpointers",
    liveUrl: "#",
    icon: TrendingUp,
  },
  {
  title: "Portfolio Website",
  dates: "2025 - Present",
  stack: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
  description:
    "This site you’re currently viewing is a modern, ultra-minimal portfolio web application designed to showcase projects, skills, and experience with a clean UI and scalable architecture.",
  highlights: [
    "Smooth animations and micro-interactions",
    "Auto-updating GitHub repositories via public API",
    "Modular component and data-driven architecture",
  ],
  repoUrl: "https://github.com/shahabibrahim1/PortfolioWebsite", 
  liveUrl: "#", 
  icon: FileText, // or FileText / TrendingUp if you prefer
}
];