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
  },
  {
    title: "AI-Driven Crop Disease Detection",
    desc: "CNN-based deep learning system achieving 92% accuracy for identifying 10+ crop diseases using leaf image analysis.",
    tags: ["OpenCV", "TensorFlow", "CNN", "Scikit-learn"],
    image: "🌱",
    github: "",
    live: "",
  },
  {
    title: "Gesture-Based Image Processing",
    desc: "Real-time hand gesture recognition system with 18+ dynamic image filters and low-latency processing using Mediapipe.",
    tags: ["Python", "OpenCV", "Mediapipe", "NumPy"],
    image: "🖐️",
    github: "",
    live: "",
  },
  {
    title: "NexusAI Portfolio",
    desc: "SaaS-style AI-powered developer portfolio platform with real-time Groq-powered chatbot, animated UI, Firebase auth, and full-stack Express backend.",
    tags: ["React", "Vite", "Groq API", "Firebase", "Express"],
    image: "🚀",
    github: "https://github.com/satverse5-dotcom/ai-dreamscape-port",
    live: "",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const ProjectsSection = () => {
  return (
    <section className="relative z-10 py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Featured Projects
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={item}
              whileHover={{ y: -5 }}
              className="glass p-6 group cursor-pointer hover:neon-glow-indigo transition-all duration-300"
            >
              <div className="text-4xl mb-4">{project.image}</div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;