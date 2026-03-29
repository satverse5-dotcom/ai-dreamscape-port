"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Nexus Agent – AI Conversational Assistant",
    desc: "Full-stack AI conversational application built using Gemini API and Flask-based REST APIs for intelligent prompt processing and response generation.",
    tags: ["Python", "Flask", "Gemini API", "REST APIs"],
    image: "🤖",
    github: "https://github.com/satverse5-dotcom/nexus_agent_project",
    live: "",
    projectLink: "https://github.com/satverse5-dotcom/nexus_agent_project",
  },
  {
    title: "AI-Driven Crop Disease Detection",
    desc: "CNN-based deep learning system achieving 92% accuracy for identifying 10+ crop diseases using leaf image analysis.",
    tags: ["OpenCV", "TensorFlow", "CNN", "Scikit-learn"],
    image: "🌱",
    github: "",
    live: "",
    projectLink: "",
  },
  {
    title: "Gesture-Based Image Processing",
    desc: "Real-time hand gesture recognition system with 18+ dynamic image filters and low-latency processing using Mediapipe.",
    tags: ["Python", "OpenCV", "Mediapipe", "NumPy"],
    image: "🖐️",
    github: "",
    live: "",
    projectLink: "",
  },
  {
    title: "NexusAI Portfolio",
    desc: "SaaS-style AI-powered developer portfolio platform with real-time Groq-powered chatbot, animated UI, Firebase auth, and full-stack Express backend.",
    tags: ["React", "Vite", "Groq API", "Firebase", "Express"],
    image: "🚀",
    github: "https://github.com/satverse5-dotcom/ai-dreamscape-port",
    live: "",
    projectLink: "https://github.com/satverse5-dotcom/ai-dreamscape-port",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ProjectsSection = () => {
  return (
    <section className="relative z-10 py-24 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text">
            Projects Timeline
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-neon-cyan to-transparent -translate-x-1/2" />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-16 md:gap-24 relative"
          >
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={project.title}
                  variants={item}
                  className={`relative flex flex-col md:flex-row items-center justify-between ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Timeline Desktop Node */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-background bg-muted z-10 items-center justify-center shadow-[0_0_15px_hsl(var(--neon-cyan)/0.6)]">
                    <span className="text-xl">{project.image}</span>
                  </div>

                  {/* Mobile Node (Top Left) */}
                  <div className="md:hidden flex items-center gap-4 mb-4 z-10 w-full">
                    <div className="w-12 h-12 rounded-full border-2 border-primary bg-muted flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_hsl(var(--neon-cyan)/0.6)]">
                      <span className="text-2xl">{project.image}</span>
                    </div>
                    <div className="h-0.5 flex-grow bg-gradient-to-r from-primary to-transparent" />
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-5/12" />

                  {/* Project Card */}
                  <div
                    className="w-full md:w-5/12 glass p-8 group hover:neon-glow-cyan transition-all duration-500 rounded-2xl border border-primary/20 relative overflow-hidden flex flex-col h-full"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono shadow-[0_0_10px_rgba(0,0,0,0)] group-hover:shadow-[0_0_10px_hsl(var(--neon-cyan)/0.2)] transition-all"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
                          title="View on GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {project.projectLink && (
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all duration-300"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;