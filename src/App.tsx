import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {ReactTyped} from "react-typed";
import { Link as ScrollLink } from "react-scroll";
import {
  Github, Linkedin, Mail, Phone, MapPin, ExternalLink, ArrowRight, ChevronDown,
  Cpu, Database, BarChart3, Cloud, Sparkles, GraduationCap, Award, Briefcase,
  Layers, Send, Star, Bot, DatabaseZap, Pi, BadgeCheck
} from "lucide-react";

/* ===========================
   Lightweight Particle Background (no deps)
   =========================== */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, pr = 1;

    // 🔧 Hyperparameters
    const params = {
      N: 550,                          // number of particles
      initVelocity: 0.0006,            // initial random velocity range
      cursorInfluenceDist: 0.25,       // how far cursor influences particles
      cursorPull: 0.00025,             // pull strength toward cursor
      cursorOrbit: 0.0001,             // perpendicular (orbit-like) influence
      cursorDamping: 0.97,             // damping when affected by cursor
      particleMinSpacing: 0.040,       // minimum allowed distance between particles
      particleRepel: 0.0004,           // repulsion strength between particles
      connectionDist: 130,             // max distance for particle-to-particle connections
      connectionOpacity: 0.7,          // max opacity of particle connections
      cursorConnectionDist: 150,       // max distance for particle-to-cursor connections
      cursorConnectionOpacity: 0.9,    // max opacity of cursor connections
      pointRadius: 1.6,                // particle dot radius
      //pointColor: "rgba(56,189,248,0.9)", // particle fill color
      pointColor: "rgba(56,189,248,0.9)",
      lineColor: "rgba(168,85,247,0.22)",
      cursorLineColor: [255,215,0]
      //lineColor: "rgba(168,85,247,0.22)", // connection line color
      // signalChance: 0.02,              // probability each frame of new signal
      // signalSpeedMin: 0.02,            // min speed of a signal
      // signalSpeedMax: 0.04,            // max speed of a signal
    };

    const parts = new Array(params.N).fill(0).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * params.initVelocity,
      vy: (Math.random() - 0.5) * params.initVelocity,
    }));


    const resize = () => {
      pr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * pr);
      canvas.height = Math.floor(h * pr);
      ctx.setTransform(pr, 0, 0, pr, 0, 0);
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = params.pointColor;
      ctx.strokeStyle = params.lineColor;

      parts.forEach((p, i) => {
        // drift
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        // cursor attraction (orbit-like, not collapse)
        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dx = mouse.current.x / w - p.x;
          const dy = mouse.current.y / h - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < params.cursorInfluenceDist) {
            p.vx += dx * params.cursorPull;
            p.vy += dy * params.cursorPull;

            // orbit-like sideways motion
            p.vx += -dy * params.cursorOrbit;
            p.vy += dx * params.cursorOrbit;

            p.vx *= params.cursorDamping;
            p.vy *= params.cursorDamping;
          }
        }

        // particle-particle repulsion
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < params.particleMinSpacing) {
            const force = (params.particleMinSpacing - d) * params.particleRepel;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
            q.vx -= (dx / d) * force;
            q.vy -= (dy / d) * force;
          }
        }
      });

      // connections
      for (let i = 0; i < params.N; i++) {
        for (let j = i + 1; j < params.N; j++) {
          const dx = (parts[i].x - parts[j].x) * w;
          const dy = (parts[i].y - parts[j].y) * h;
          const d = Math.hypot(dx, dy);
          if (d < params.connectionDist) {
            ctx.globalAlpha = (params.connectionDist - d) / params.connectionDist * params.connectionOpacity;
            ctx.beginPath();
            ctx.moveTo(parts[i].x * w, parts[i].y * h);
            ctx.lineTo(parts[j].x * w, parts[j].y * h);
            ctx.stroke();
          }
        }
      }

      // lines to cursor with golden pulse
      if (mouse.current.x !== null && mouse.current.y !== null) {
        const t = Date.now() * 0.002; // time factor for animation
        parts.forEach((p, i) => {
          const dx = mouse.current.x / w - p.x;
          const dy = mouse.current.y / h - p.y;
          const d = Math.hypot(dx * w, dy * h);

          if (d < params.cursorConnectionDist) {
            ctx.globalAlpha = (params.cursorConnectionDist - d) / params.cursorConnectionDist * params.cursorConnectionOpacity;

            // pulsing golden gradient
            const grad = ctx.createLinearGradient(mouse.current.x, mouse.current.y, p.x * w, p.y * h);
            const pulse = (Math.sin(t + i) * 0.5 + 0.5) * 0.8; // oscillates 0 → 0.8
            grad.addColorStop(0, `rgba(${params.cursorLineColor.join(",")},${0.9 - pulse * 0.3})`);
            grad.addColorStop(1, `rgba(${params.cursorLineColor.join(",")},${0.1 + pulse * 0.3})`);

            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(p.x * w, p.y * h);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
          }
        });
      }


      // draw particles
      ctx.globalAlpha = 1;
      parts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, params.pointRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(render);
    };

    resize();
    render();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
      } else {
        mouse.current.x = null;
        mouse.current.y = null;
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* ===========================
   Data
   =========================== */
const CONTACT = {
  name: "Mayukh Roy",
  title: "Associate Data Scientist",
  company: "Cogitate Technology",
  email: "mayukhroy442@gmail.com",
  phone: "+91-7001953146",
  location: "Bhopal, India",
  socials: [
    { label: "Resume", icon: <ExternalLink className="h-5 w-5" />, href: "https://drive.google.com/file/d/14kmYwVm54fxwpjiBoMXsbds5UWS8Yhvv/view" },
    { label: "GitHub", icon: <Github className="h-5 w-5" />, href: "https://github.com/DemonCyborg007" },
    // { label: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
    { label: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/mayukh-roy-9049b722a/" },
    { label: "GFG", icon: <ExternalLink className="h-5 w-5" />, href: "https://www.geeksforgeeks.org/user/mrdemoncy3e1x/" },
    { label: "LeetCode", icon: <ExternalLink className="h-5 w-5" />, href: "https://leetcode.com/u/mrdemoncyborg007/" },
    { label: "CodeNinja", icon: <ExternalLink className="h-5 w-5" />, href: "https://www.naukri.com/code360/profile/209668ce-573c-4917-a991-6dac39fcd854" },
  ],
};

const EXPERIENCE = [
  {
    role: "Associate Data Scientist",
    company: "Cogitate Technology",
    period: "2024 – Present",
    bullets: [
      "Created scalable data pipelines in Microsoft Fabric to perform ETL on Azure Cosmos DB data.",
      "Provisioned and maintained TEST, UAT, and PROD environments in Fabric with release hygiene.",
      "Built CAIRA (Cogitate’s AI Response Agent) and shipped production-grade data agents.",
      "Completed 1-year internship at Cogitate before full-time joining.",
    ],
    tags: ["Python", "Azure", "Fabric", "Cosmos DB", "SQL", "Power BI", "Data Agents"],
  },
  {
    role: "Freelance Web Developer",
    company: "The Residency Hotel",
    period: "Aug 2023 – Feb 2024",
    bullets: [
      "Built a customized bar menu web app with dynamic QR codes aligned to brand identity.",
      "Improved customer experience and on-premise profitability via faster ordering.",
    ],
    tags: ["React", "JavaScript", "QR", "UX"],
  },
];

const EDUCATION = [
  { school: "Lakshmi Narain College of Technology (LNCT), Bhopal", degree: "B.Tech — CSE (AIML)", period: "2021 – 2025", detail: "CGPA: 8.68" },
  { school: "St. Joseph's Co-Ed School", degree: "Higher Secondary (PCM)", period: "2020 – 2021", detail: "Percentage: 97.6%" },
  { school: "St. Joseph's Co-Ed School", degree: "Class 10", period: "2018 – 2019", detail: "Percentage: 94.4%" },
];

const SKILLS = {
  Languages: ["Python", "C++", "JavaScript", "HTML5", "CSS3", "SQL"],
  Frameworks: ["React", "Node", "TensorFlow", "Keras", "ResNet34", "scikit-learn"],
  Platforms: ["Azure", "Microsoft Fabric", "AWS", "Google Cloud", "HuggingFace", "StableDiffusion"],
  Tools: ["Git", "GitHub", "Power BI"],
  Databases: ["Azure Cosmos DB", "MongoDB", "MySQL"],
  Subjects: ["DSA", "OOP", "DBMS", "AI", "ML", "Deep Learning"],
};

const PROJECTS = [
  {
    title: "CAIRA — Cogitate’s AI Response Agent",
    stack: ["Python", "Azure", "Agents", "LLMs"],
    summary:
      "Enterprise-grade AI assistant integrated with Cogitate data & workflows; robust orchestration, evaluation, and safety guardrails.",
    link: null,
    highlight: true,
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: "Fabric Cosmos ETL Pipelines",
    stack: ["Microsoft Fabric", "Azure Cosmos DB", "Data Engineering"],
    summary:
      "End-to-end ETL on Cosmos data powering analytics and BI across TEST/UAT/PROD environments.",
    link: null,
    icon: <Pi className="h-5 w-5" />,
  },
  {
    title: "AGrowTech",
    stack: ["Python", "Flask", "PyTorch", "ResNet34", "HTML", "CSS"],
    summary:
      "Leaf-image disease recognition via deep CNNs for practical agri-diagnostics.",
    link: "https://github.com/DemonCyborg007/AGrowTech/tree/master",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "Interpretable Stock ML",
    stack: ["Python", "NumPy", "Pandas", "Keras", "SHAP"],
    summary:
      "Explained LSTM stock price predictions using SHAP to reveal impactful features.",
    link: "https://github.com/DemonCyborg007/Interpretable_Stock_MLmodel",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Digit Recognizer (ONNX)",
    stack: ["Python", "PyTorch", "ONNX", "HTML", "CSS", "JavaScript"],
    summary:
      "MNIST digit classifier exported to ONNX for lightweight web inference.",
    link: "https://demoncyborg007.github.io/Recog_Digit/",
    icon: <Cpu className="h-5 w-5" />,
  },
];

// const CERTS = [
//   "IBM AI Engineering — Coursera",
//   "Google UX Design — Coursera",
//   "Google Cloud Skills — Google",
// ];
const CERTS = [
  {
    name: "IBM AI Engineering — Coursera",
    link: "https://drive.google.com/file/d/1rqHToGJo02dAzLb3b9psdxViVjZ5dPCS/view"
  },
  {
    name: "Google UX Design — Coursera",
    link: "https://drive.google.com/file/d/1r0BWuBnl5xU8TZLyCIaIFsn1zZ0I3o5h/view"
  },
  {
    name: "Google Cloud Skills — Google",
    link: "https://www.skills.google/public_profiles/0ea59d75-7c49-42ed-8058-ab4ca5515edf"
  }
];

const AWARDS = [
  "GATE (DA) 2024 — AIR 764",
  "National Agro Hackathon — Final Round",
  "MLSA 2023",
  "CEDMAP Best Performer — 01/2023",
  "YUVA Student Chair — 11/2022–11/2023",
  "AISECer — 02/2022–05/2022",
  "School Topper — 2020–2021",
  "National Karate Champion — 09/2010",
];

/* ===========================
   UI helpers
   =========================== */
const Tag: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/80">
    {children}
  </span>
);

const GlassCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition hover:border-cyan-400/30 hover:shadow-cyan-500/10 ${className}`}>
    <div
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{ background: "radial-gradient(600px 120px at var(--x,50%) var(--y,50%), rgba(34,211,238,0.12), transparent 60%)" }}
    />
    {children}
  </div>
);

const Section: React.FC<{ id: string; title: string; icon?: any; rightBadge?: React.ReactNode; children: React.ReactNode }> =
  ({ id, title, icon: Icon, rightBadge, children }) => (
    <section id={id} className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(transparent,black)]">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/2 -right-10 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <Icon className="h-5 w-5 text-cyan-400" />
            </div>
          )}
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
          {rightBadge}
        </div>
        {children}
      </div>
    </section>
  );

/* ===========================
   Main
   =========================== */
export default function App() {
  // spotlight hover for all .group elements (nice glow)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".group") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.75]);

  return (
    <div className="min-h-screen scroll-smooth bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-sm text-white/70">Online</span>
          </div>
          <ul className="flex items-center gap-6 text-sm">
            {[
              { to: "home", label: "Home" },
              { to: "experience", label: "Experience" },
              { to: "skills", label: "Skills" },
              { to: "projects", label: "Projects" },
              { to: "education", label: "Education" },
              { to: "achievements", label: "Achievements" },
              { to: "contact", label: "Contact" },
            ].map((item) => (
              <li key={item.to}>
                <ScrollLink
                  to={item.to}
                  spy
                  smooth
                  duration={500}
                  className="cursor-pointer text-white/70 transition hover:text-cyan-300"
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <ParticleField />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_50%_0%,rgba(56,189,248,0.08),transparent_60%)]" />
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Python • Azure • Fabric • SQL • Power BI • Data Agents</span>
          </div>
          <h1 className="text-balance bg-gradient-to-r from-white via-cyan-100 to-fuchsia-200 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-6xl">
            Hi, I’m {CONTACT.name}
          </h1>
          <p className="mt-3 text-lg text-white/80">
            {CONTACT.title} @ <span className="text-cyan-300">{CONTACT.company}</span>
          </p>
          <p className="mt-1 text-white/70">
            <ReactTyped
              strings={[
                "I build reliable data pipelines.",
                "I ship interpretable ML and production AI agents.",
                "I architect TEST/UAT/PROD Fabric environments.",
              ]}
              typeSpeed={35}
              backSpeed={22}
              backDelay={1400}
              loop
            />
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-white/90">
            <ScrollLink
              to="projects"
              smooth
              duration={500}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium hover:bg-cyan-500/20 cursor-pointer"
            >
              View Projects <ArrowRight className="h-4 w-4" />
            </ScrollLink>
            <ScrollLink
              to="contact"
              smooth
              duration={500}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:border-white/20 cursor-pointer"
            >
              Contact Me <Send className="h-4 w-4" />
            </ScrollLink>
            <div className="ml-auto flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <a className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 hover:border-white/20" href={`mailto:${CONTACT.email}`}>
                <Mail className="h-4 w-4" /> {CONTACT.email}
              </a>
              <a className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 hover:border-white/20" href="tel:+917001953146">
                <Phone className="h-4 w-4" /> {CONTACT.phone}
              </a>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1"><MapPin className="h-4 w-4" /> {CONTACT.location}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {CONTACT.socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-cyan-400/30">
                {s.icon} {s.label}
              </a>
            ))}
          </div>
          <div className="mt-12 flex animate-bounce items-center justify-center text-white/60">
            <ChevronDown />
          </div>
        </motion.div>
      </header>

      {/* Experience */}
      <Section id="experience" title="Experience" icon={Briefcase}>
        <div className="grid gap-6 md:grid-cols-2">
          {EXPERIENCE.map((exp, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
              <GlassCard>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-white/90">
                    <h3 className="text-lg font-semibold">{exp.role} — <span className="text-cyan-300">{exp.company}</span></h3>
                    <p className="text-xs text-white/60">{exp.period}</p>
                  </div>
                  <div className="flex max-w-[50%] flex-wrap gap-1 justify-end">
                    {exp.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
                <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-white/80">
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section
        id="skills"
        title="Skills & Tech Stack"
        icon={Cpu}
        rightBadge={<span className="ml-3 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">Data-first</span>}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SKILLS).map(([group, items], idx) => (
            <motion.div key={group} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.04 }}>
              <GlassCard>
                <div className="mb-3 flex items-center gap-2 text-white">
                  {group.includes("Database") ? <Database className="h-5 w-5 text-fuchsia-300" /> :
                   group.includes("Languages") ? <Cpu className="h-5 w-5 text-cyan-300" /> :
                   group.includes("Frameworks") ? <Layers className="h-5 w-5 text-teal-300" /> :
                   group.includes("Platforms") ? <Cloud className="h-5 w-5 text-sky-300" /> :
                   group.includes("Tools") ? <BarChart3 className="h-5 w-5 text-indigo-300" /> :
                   <DatabaseZap className="h-5 w-5 text-violet-300" />}
                  <h3 className="font-semibold">{group}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => <Tag key={item}>{item}</Tag>)}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      {/* <Section id="projects" title="Highlighted Projects" icon={Pi}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, idx) => (
            <motion.a
              key={idx}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard className={`h-full ${p.highlight ? "ring-1 ring-cyan-400/30" : ""}`}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/5 p-2">{p.icon}</div>
                    <h3 className="text-lg font-semibold text-white/90">{p.title}</h3>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/60" />
                </div>
                <p className="text-sm text-white/75">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => <Tag key={s}>{s}</Tag>)}
                </div>
              </GlassCard>
            </motion.a>
          ))}
        </div>
      </Section> */}
      <Section id="projects" title="Highlighted Projects" icon={Pi}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, idx) => {
            const CardContent = (
              <GlassCard
                className={`h-full ${
                  p.highlight ? "ring-1 ring-cyan-400/30" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/5 p-2">{p.icon}</div>
                    <h3 className="text-lg font-semibold text-white/90">
                      {p.title}
                    </h3>
                  </div>

                  {/* Show link icon only if project has a public link */}
                  {p.link ? (
                    <ExternalLink className="h-4 w-4 text-white/60" />
                  ) : (
                    <span className="text-[10px] px-2 py-1 rounded-md bg-white/10 text-white/60">
                      Confidential
                    </span>
                  )}
                </div>

                <p className="text-sm text-white/75">{p.summary}</p>

                {/* Optional note below summary */}
                {p.note && (
                  <p className="mt-2 text-xs text-white/50 italic">{p.note}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </GlassCard>
            );

            return p.link ? (
              // Clickable project (public)
              <motion.a
                key={idx}
                href={p.link}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                {CardContent}
              </motion.a>
            ) : (
              // Non-clickable confidential project
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                {CardContent}
              </motion.div>
            );
          })}
        </div>
      </Section>


      {/* Education */}
      <Section id="education" title="Education" icon={GraduationCap}>
        <div className="grid gap-6 md:grid-cols-3">
          {EDUCATION.map((e, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
              <GlassCard>
                <h3 className="text-white/90">{e.school}</h3>
                <p className="text-sm text-white/70">{e.degree}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                  <span>{e.period}</span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">{e.detail}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Certifications & Awards */}
      <Section id="achievements" title="Certifications & Honors" icon={Award}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* <GlassCard>
            <h3 className="mb-3 font-semibold text-white">Certifications</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-white/80">
              {CERTS.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </GlassCard> */}
          <GlassCard>
            <h3 className="mb-3 font-semibold text-white">Certifications</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-white/80">
              {CERTS.map((cert) => (
                <li key={cert.name} className="flex items-center gap-2">
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/90 hover:text-cyan-400 transition-colors duration-200 underline decoration-transparent hover:decoration-cyan-400"
                  >
                    {cert.name}
                    <ExternalLink size={14} className="opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-3 font-semibold text-white">Honors & Awards</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-white/80">
              {AWARDS.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </GlassCard>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Get In Touch" icon={Send}>
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard>
            <p className="text-white/80">
              I’m open to opportunities in Data Science, ML Engineering, and AI Agents. If you have an idea, role, or
              collaboration in mind — let’s talk.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500/20">
                <Mail className="h-4 w-4" /> Email Me
              </a>
              <a href="tel:+917001953146" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-white/20">
                <Phone className="h-4 w-4" /> Call
              </a>
            </div>
          </GlassCard>
          <GlassCard>
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                // simple mailto fallback:
                window.location.href = `mailto:${CONTACT.email}`;
              }}
            >
              <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder-white/40 focus:border-cyan-400/40" placeholder="Your name" required />
              <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder-white/40 focus:border-cyan-400/40" placeholder="Your email" type="email" required />
              <textarea rows={4} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder-white/40 focus:border-cyan-400/40" placeholder="Your message" required />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500/20">
                Send Message <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </GlassCard>
        </div>
      </Section>

      <footer className="border-t border-white/10 py-10 text-center text-xs text-white/60">
        Crafted with ❤️ by {CONTACT.name}. Built with React, Tailwind & Framer Motion.
      </footer>
    </div>
  );
}
