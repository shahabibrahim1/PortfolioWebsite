import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PROFILE, EDUCATION } from "./data/profile";
import { SKILLS, STRONG_POINTS } from "./data/skills";
import { EXPERIENCE, LEADERSHIP } from "./data/experience";
import { FEATURED_PROJECTS } from "./data/projects";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sun,
  Moon,
  Search,
  Filter,
  FileText,
  Sparkles,
  Brain,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";



/**
 * --------------------
 * Motion + UI helpers
 * --------------------
 */

const cx = (...c) => c.filter(Boolean).join(" ");

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const Section = ({ id, title, subtitle, children }) => {
  const reduce = useReducedMotion();
  return (
    <section id={id} className="scroll-mt-28 py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={reduce ? {} : stagger}
          className="mb-10"
        >
          <motion.h2 variants={reduce ? {} : fadeUp} className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </motion.h2>
          {subtitle ? (
            <motion.p
              variants={reduce ? {} : fadeUp}
              className="mt-2 max-w-3xl text-sm text-neutral-600 dark:text-neutral-300 md:text-base"
            >
              {subtitle}
            </motion.p>
          ) : null}
        </motion.div>

        {children}
      </div>
    </section>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={cx(
      "rounded-2xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm backdrop-blur",
      "dark:border-neutral-800/70 dark:bg-neutral-950/55",
      "transition will-change-transform",
      className
    )}
  >
    {children}
  </div>
);

const HoverCard = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className={className}
  >
    <Card className="h-full">{children}</Card>
  </motion.div>
);

const Chip = ({ children }) => (
  <motion.span
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className={cx(
      "inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-800 shadow-sm",
      "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
    )}
  >
    {children}
  </motion.span>
);

const Button = ({ as = "button", href, onClick, variant = "primary", children, ...rest }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
      : variant === "ghost"
      ? "border border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
      : "border border-neutral-200 bg-transparent hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900";

  const Comp = as;
  return (
    <Comp className={base + " " + styles} href={href} onClick={onClick} {...rest}>
      {children}
    </Comp>
  );
};

function useTheme() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : true;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    if (typeof window !== "undefined") window.localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

function useGithubRepos(username) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setRepos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return { repos, loading, error };
}

export default function PortfolioSite() {
  const { theme, setTheme } = useTheme();
  const [repoQuery, setRepoQuery] = useState("");
  const [showForks, setShowForks] = useState(false);
  const [sort, setSort] = useState("updated"); // updated | stars | name
  const reduce = useReducedMotion();

  const { repos, loading, error } = useGithubRepos(PROFILE.githubUsername);

  const filteredRepos = useMemo(() => {
    const q = repoQuery.trim().toLowerCase();
    let r = repos;
    if (!showForks) r = r.filter((x) => !x.fork);
    if (q) {
      r = r.filter((x) => {
        const hay = `${x.name} ${x.description || ""} ${(x.topics || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }
    if (sort === "stars") r = [...r].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    else if (sort === "name") r = [...r].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else r = [...r].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return r;
  }, [repos, repoQuery, showForks, sort]);

  const nav = [
    { id: "about", label: "About" },
    { id: "strengths", label: "Strengths" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "leadership", label: "Leadership" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Modern gradient + spotlight background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-neutral-200/55 blur-3xl dark:bg-neutral-800/35" />
        <div className="absolute -bottom-56 right-[-140px] h-[560px] w-[560px] rounded-full bg-neutral-200/45 blur-3xl dark:bg-neutral-800/25" />
        <div className="absolute left-[-160px] top-1/3 h-[520px] w-[520px] rounded-full bg-neutral-200/35 blur-3xl dark:bg-neutral-800/20" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-neutral-50/75 backdrop-blur dark:border-neutral-900/70 dark:bg-neutral-950/60">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <span className="text-sm font-bold">SI</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{PROFILE.name}</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-300">{PROFILE.tagline}</div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((x) => (
              <a
                key={x.id}
                href={`#${x.id}`}
                className="rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                {x.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button as="a" href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer" variant="ghost">
              <FileText className="h-4 w-4" />
              Resume
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="top" className="relative">
        <div className="mx-auto max-w-screen-xl px-4 pt-14">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <motion.div
              className="md:col-span-7"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{PROFILE.location}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                {PROFILE.name}
              </h1>

              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-2 text-sm shadow-sm backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/55">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">{PROFILE.tagline}</span>
              </div>

              <p className="mt-5 max-w-2xl text-neutral-700 dark:text-neutral-200">{PROFILE.valueProp}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button as="a" href="#projects">
                  View Projects <ArrowRight className="h-4 w-4" />
                </Button>
                <Button as="a" href="#contact" variant="ghost">
                  Contact
                </Button>
                <Button as="a" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" variant="outline">
                  <Github className="h-4 w-4" /> GitHub
                </Button>
                <Button as="a" href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" variant="outline">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Button>
              </div>

              <div className="mt-7 grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a className="hover:underline" href={`mailto:${PROFILE.email}`}>
                    {PROFILE.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a className="hover:underline" href={`tel:${PROFILE.phone}`}>
                    {PROFILE.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {PROFILE.location}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-5"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <Card className="relative overflow-hidden p-6">
                {/* soft animated sheen */}
                <motion.div
                  aria-hidden
                  className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-neutral-200/60 blur-2xl dark:bg-neutral-800/40"
                  animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative">
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">Currently</div>
                  <div className="mt-2 text-xl font-semibold">Computing Science (UofA)</div>
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">
                    Concentrations in Web Development and Machine Learning — building projects that combine clean UI
                    and data-driven insights.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-neutral-200/70 p-4 dark:border-neutral-800/70">
                      <div className="text-sm font-medium">What I bring</div>
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-200">
                        <li>Strong problem-solving + math-driven thinking</li>
                        <li>Comfortable with data + visualization</li>
                        <li>Clean UI and practical engineering</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/70 p-4 dark:border-neutral-800/70">
                      <div className="text-sm font-medium">Quick links</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button as="a" href={PROFILE.links.github}  target="_blank" rel="noopener noreferrer"  variant="outline">
                          <Github className="h-4 w-4" /> GitHub
                        </Button>
                        <Button as="a" href={`mailto:${PROFILE.email}`} target="_blank" rel="noopener noreferrer" variant="outline">
                          <Mail className="h-4 w-4" /> Email
                        </Button>
                        <Button as="a" href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer" variant="outline">
                          <FileText className="h-4 w-4" /> Resume
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <Section id="about" title="About" subtitle="A quick snapshot of who I am and how I work.">
          <div className="grid gap-6 md:grid-cols-12">
            <motion.div
              className="md:col-span-7"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={reduce ? {} : stagger}
            >
              <motion.div variants={reduce ? {} : fadeUp}>
                <Card>
                  <p className="text-neutral-700 dark:text-neutral-200">
                    I’m a University of Alberta Computing Science student who enjoys solving problems at the intersection
                    of logic, data, and good user experience. I’ve built dashboards, API-driven visualizations, and apps/games.
                  </p>
                  <p className="mt-4 text-neutral-700 dark:text-neutral-200">
                    I’m collaborative and communication-first—if I’m on a team, I like keeping everyone aligned on the goal,
                    ownership, and what “done” looks like.
                  </p>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              className="md:col-span-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={reduce ? {} : stagger}
            >
              <motion.div variants={reduce ? {} : fadeUp}>
                <Card>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">Education</div>
                  <div className="mt-3 space-y-4">
                    {EDUCATION.map((e) => (
                      <div key={e.school}>
                        <div className="text-base font-semibold">{e.school}</div>
                        <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">{e.degree}</div>
                        <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{e.meta}</div>
                        <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                          <span className="font-medium">Coursework:</span> {e.coursework}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* NEW: Strengths section (animated) */}
        <Section
          id="strengths"
          title="Strengths"
          subtitle="These are the things I lean on to deliver results—highlighted with subtle motion."
        >
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={reduce ? {} : stagger}
          >
            {STRONG_POINTS.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title} variants={reduce ? {} : fadeUp}>
                  <HoverCard>
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold">{s.title}</div>
                        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">{s.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {s.keywords.map((k) => (
                            <Chip key={k}>{k}</Chip>
                          ))}
                        </div>

                        {/* animated meter */}
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                            <span>Signal</span>
                            <span>{s.meter}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-neutral-200/70 dark:bg-neutral-800/70">
                            <motion.div
                              className="h-2 rounded-full bg-neutral-900 dark:bg-white"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${s.meter}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCard>
                </motion.div>
              );
            })}
          </motion.div>
        </Section>

        <Section id="skills" title="Skills" subtitle="Grouped so recruiters can scan fast.">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(SKILLS).map(([group, items]) => (
              <HoverCard key={group}>
                <div className="text-sm font-semibold">{group}</div>
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={reduce ? {} : stagger}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {items.map((x) => (
                    <motion.div key={x} variants={reduce ? {} : fadeUp}>
                      <Chip>{x}</Chip>
                    </motion.div>
                  ))}
                </motion.div>
              </HoverCard>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience" subtitle="What I’ve done, and the impact.">
          <motion.div
            className="grid gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={reduce ? {} : stagger}
          >
            {EXPERIENCE.map((job) => (
              <motion.div key={job.role + job.org} variants={reduce ? {} : fadeUp}>
                <HoverCard>
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                    <div>
                      <div className="text-lg font-semibold">{job.role}</div>
                      <div className="text-sm text-neutral-700 dark:text-neutral-200">
                        {job.org} • {job.location}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(job.impactTags || []).map((t) => (
                          <Chip key={t}>{t}</Chip>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">{job.dates}</div>
                  </div>
                  <ul className="mt-4 list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-200">
                    {job.bullets.map((b) => (
                      <li key={b} className="mt-1">
                        {b}
                      </li>
                    ))}
                  </ul>
                </HoverCard>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="projects" title="Projects" subtitle="Featured builds + your public GitHub repositories (auto-updated).">
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={reduce ? {} : stagger}
          >
            {FEATURED_PROJECTS.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} variants={reduce ? {} : fadeUp}>
                  <HoverCard>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="grid h-9 w-9 place-items-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-lg font-semibold">{p.title}</div>
                        </div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{p.dates}</div>
                      </div>
                      <div className="flex gap-2">

                        {p.repoUrl && p.repoUrl !== "#" ? (
                          <Button
                          as="a"
                          href={p.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outline"
                          >
                            <Github className="h-4 w-4" /> Repo
                          </Button>
                        ) : null}

                        {p.liveUrl && p.liveUrl !== "#" ? (
                          <Button
                            as="a"
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                          >
                            <ExternalLink className="h-4 w-4" /> Demo
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-200">{p.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>

                    <ul className="mt-4 list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-200">
                      {p.highlights.map((h) => (
                        <li key={h} className="mt-1">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </HoverCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* GitHub repos */}
          <div className="mt-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold">More on GitHub</div>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  Pulls from GitHub’s public API for <span className="font-medium">{PROFILE.githubUsername}</span>.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    value={repoQuery}
                    onChange={(e) => setRepoQuery(e.target.value)}
                    placeholder="Search repos…"
                    className="w-full rounded-2xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:ring-neutral-600 sm:w-64"
                  />
                </div>

                <Button variant="ghost" onClick={() => setShowForks((v) => !v)}>
                  <Filter className="h-4 w-4" />
                  {showForks ? "Showing forks" : "Hiding forks"}
                </Button>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:ring-neutral-600"
                >
                  <option value="updated">Sort: Recently updated</option>
                  <option value="stars">Sort: Stars</option>
                  <option value="name">Sort: Name</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <Card>
                  <p className="text-sm text-neutral-700 dark:text-neutral-200">Loading repositories…</p>
                </Card>
              ) : error ? (
                <Card>
                  <p className="text-sm text-neutral-700 dark:text-neutral-200">
                    Couldn’t load GitHub repositories. Try again later, or open GitHub directly.
                  </p>
                  <div className="mt-3">
                    <Button as="a" href={PROFILE.links.github} variant="outline">
                      <Github className="h-4 w-4" /> Open GitHub
                    </Button>
                  </div>
                </Card>
              ) : (
                <motion.div
                  className="grid gap-4 md:grid-cols-2"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={reduce ? {} : stagger}
                >
                  {filteredRepos.slice(0, 12).map((r) => (
                    <motion.div key={r.id} variants={reduce ? {} : fadeUp}>
                      <HoverCard>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <a
                              href={r.html_url}
                              className="text-base font-semibold hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {r.name}
                            </a>
                            {r.description ? (
                              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">{r.description}</p>
                            ) : (
                              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">No description.</p>
                            )}
                          </div>
                          <a
                            href={r.html_url}
                            className="rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${r.name} on GitHub`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                          {r.language ? <Chip>{r.language}</Chip> : null}
                          <Chip>★ {r.stargazers_count || 0}</Chip>
                          <Chip>Updated {new Date(r.updated_at).toLocaleDateString()}</Chip>
                          {r.fork ? <Chip>Fork</Chip> : null}
                        </div>
                      </HoverCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!loading && !error && filteredRepos.length > 12 ? (
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">Showing 12 of {filteredRepos.length} repos.</p>
                  <Button as="a" href={PROFILE.links.github} variant="outline">
                    View all on GitHub <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </Section>

        <Section id="leadership" title="Leadership & Activities" subtitle="Community involvement and teamwork.">
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={reduce ? {} : stagger}
          >
            {LEADERSHIP.map((x) => (
              <motion.div key={x.title} variants={reduce ? {} : fadeUp}>
                <HoverCard>
                  <div className="text-base font-semibold">{x.title}</div>
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">{x.detail}</p>
                </HoverCard>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="contact" title="Contact" subtitle="Quick message (mailto) + social links.">
          <div className="grid gap-6 md:grid-cols-12">
            <Card className="md:col-span-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  const name = String(form.get("name") || "").trim();
                  const email = String(form.get("email") || "").trim();
                  const message = String(form.get("message") || "").trim();
                  const subject = encodeURIComponent(`Portfolio contact from ${name || "Someone"}`);
                  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
                  window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
                }}
                className="grid gap-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      name="name"
                      className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:ring-neutral-600"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      name="email"
                      type="email"
                      className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:ring-neutral-600"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:ring-neutral-600"
                    placeholder="What would you like to talk about?"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit">
                    Send <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button as="a" href={`mailto:${PROFILE.email}`} variant="ghost">
                    <Mail className="h-4 w-4" /> Email directly
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="md:col-span-5">
              <div className="text-sm text-neutral-600 dark:text-neutral-300">Find me here</div>
              <div className="mt-4 grid gap-3">
                <a
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">GitHub</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">{PROFILE.githubUsername}</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">LinkedIn</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">Add your URL</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  href={`mailto:${PROFILE.email}`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">{PROFILE.email}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>
        </Section>

        <footer className="border-t border-neutral-200 py-10 dark:border-neutral-900">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                © {new Date().getFullYear()} {PROFILE.name} • {PROFILE.location}
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {nav.map((x) => (
                  <a key={x.id} href={`#${x.id}`} className="text-neutral-700 hover:underline dark:text-neutral-200">
                    {x.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
