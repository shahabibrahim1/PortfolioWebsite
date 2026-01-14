import { Brain, Users, Sparkles, TrendingUp } from "lucide-react";

export const SKILLS = {
  Languages: ["Java", "Python", "JavaScript", "HTML/CSS", "SQL", "MongoDB", "C", "C#"],
  "Developer Tools": ["Android Studio", "IntelliJ", "PyCharm", "Jupyter", "Git", "VS Code", "CLion"],
  Libraries: ["Pandas", "NumPy", "Matplotlib", "Bokeh"],
  "What I’m strong at": [
    "Problem-solving & debugging",
    "Data cleaning & preparation",
    "Dashboards & visualizations",
    "API integration",
    "Customer segmentation (k-means)",
    "UI/UX-minded front-end development",
  ],
};

export const STRONG_POINTS = [
  {
    title: "Strong Problem Solver",
    desc: "I break down messy problems into clear steps and ship practical solutions.",
    icon: Brain,
    meter: 92,
    keywords: ["debugging", "systems thinking", "math-first"],
  },
  {
    title: "Proactive Team Player",
    desc: "I communicate early, align expectations, and keep the team moving.",
    icon: Users,
    meter: 88,
    keywords: ["ownership", "collaboration", "clarity"],
  },
  {
    title: "Quick Learner",
    desc: "I ramp fast on new tools and deliver results without hand-holding.",
    icon: Sparkles,
    meter: 90,
    keywords: ["adaptable", "curious", "fast iteration"],
  },
  {
    title: "Data-Driven Builder",
    desc: "I love turning raw data into dashboards, products, and decisions.",
    icon: TrendingUp,
    meter: 86,
    keywords: ["Pandas", "visuals", "ML basics"],
  },
];
