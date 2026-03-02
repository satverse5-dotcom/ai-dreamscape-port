import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award } from "lucide-react";

/* ✅ UPDATED TIMELINE FROM YOUR RESUME */
const timeline = [
  {
    icon: GraduationCap,
    year: "2022 - 2026",
    title: "B.Tech Computer Engineering – PCCOE Pune",
    desc: "Pursuing Computer Engineering with focus on Artificial Intelligence, Machine Learning and Full Stack Development.",
  },
  {
    icon: Briefcase,
    year: "2024",
    title: "Nexus Agent – AI Assistant",
    desc: "Built a full-stack conversational AI assistant using Flask backend and Gemini API with advanced prompt engineering.",
  },
  {
    icon: Award,
    year: "2024",
    title: "AI Crop Disease Detection",
    desc: "Developed CNN-based computer vision model achieving 92% accuracy using OpenCV and deep learning techniques.",
  },
  {
    icon: Briefcase,
    year: "2025",
    title: "Gesture Image Processing & Helping Bridge Platform",
    desc: "Created real-time gesture-based image filters using Mediapipe and built a disaster relief platform with React, Node.js and MongoDB.",
  },
];

const About = () => {
  return (
    <main className="relative z-10 pt-28 pb-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            About Me
          </p>

          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
            My Journey
          </h1>

          {/* ✅ UPDATED INTRO FROM YOUR RESUME */}
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            I am an AI Engineer and Full Stack Developer passionate about building intelligent
            systems and futuristic web applications. My work focuses on computer vision,
            conversational AI, and scalable full-stack platforms that solve real-world problems.
          </p>
        </motion.div>

        <div className="space-y-6">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="glass p-6 flex gap-4 items-start hover:neon-glow-cyan transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>

              <div>
                <span className="text-xs font-mono text-primary">
                  {item.year}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default About;