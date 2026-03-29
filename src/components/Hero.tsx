"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ArrowRight, Download, Github, Linkedin, Mail, Code2 } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      {/* 🔥 AI Core Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-neon-indigo/8 blur-[100px] animate-float" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 glass neon-glow-cyan p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* 😎 AI HOLOGRAM PROFILE EFFECT */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="relative w-28 h-28 mx-auto mb-8"
        >
          {/* Glow Aura */}
          <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-2xl animate-pulse-slow" />

          {/* Rotating Ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-primary/40"
          />

          {/* Rotating Ring 2 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-neon-indigo/30"
          />

          {/* ✅ UPDATED IMAGE LINK */}
          <div className="relative w-full h-full rounded-full overflow-hidden border border-primary/40 neon-glow-cyan">
            <img
              src="/My photo.jpg"
              alt="Satyam Karn"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase">
          Hello, I&apos;m
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
          Satyam Kumar Karn
        </h1>

        <div className="text-xl md:text-2xl font-medium mb-6 h-10">
          <span className="gradient-text">
            <Typewriter
              words={[
                "AI Engineer",
                "Full Stack Developer",
                "Computer Engineer",
                "AI Innovator",
              ]}
              loop
              cursor
              cursorStyle="_"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </span>
        </div>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          AI Engineer specializing in intelligent systems, computer vision, and full-stack AI applications.
          Passionate about building scalable AI solutions using React, Node.js, OpenCV, and PyTorch.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.4)]"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>

          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download="Satyam_Kumar_Karn_Resume.pdf">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-sm transition-all hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </motion.button>
          </a>

          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-sm transition-all hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </motion.button>
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-8 relative z-20 pointer-events-auto">
          <a href="https://github.com/satverse5-dotcom" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)] rounded-full transition-all" title="GitHub">
            <Github className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/satyam-kumar-karn" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)] rounded-full transition-all" title="LinkedIn">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)] rounded-full transition-all" title="LeetCode">
            <Code2 className="w-6 h-6" />
          </a>
          <a href="mailto:satverse5@gmail.com" className="text-muted-foreground hover:text-primary hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)] rounded-full transition-all" title="Email">
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;