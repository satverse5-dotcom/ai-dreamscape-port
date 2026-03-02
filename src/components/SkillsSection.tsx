import { motion } from "framer-motion";
import { Brain, Code, Database, Cpu, Globe, Layers } from "lucide-react";

const skills = [
  { icon: Brain, title: "Artificial Intelligence", desc: "Machine Learning, Deep Learning, CNN Models", color: "neon-cyan" },
  { icon: Code, title: "Full Stack Development", desc: "React.js, Node.js, JavaScript, HTML, CSS", color: "neon-indigo" },
  { icon: Database, title: "Databases", desc: "MongoDB, SQL", color: "neon-cyan" },
  { icon: Cpu, title: "Computer Vision", desc: "OpenCV, Mediapipe, Image Processing", color: "neon-indigo" },
  { icon: Globe, title: "Programming Languages", desc: "Python, C++, JavaScript", color: "neon-cyan" },
  { icon: Layers, title: "AI Frameworks & Tools", desc: "PyTorch, NumPy, MTCNN, ReportLab, Git, VSCode", color: "neon-indigo" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SkillsSection = () => {
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
            Expertise
          </p>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Skills & Technologies
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.title}
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass p-6 group cursor-default hover:neon-glow-cyan transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-lg bg-${skill.color}/10 border border-${skill.color}/30 flex items-center justify-center mb-4 group-hover:animate-glow`}>
                <skill.icon className={`w-6 h-6 text-${skill.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {skill.title}
              </h3>
              <p className="text-sm text-muted-foreground">{skill.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;