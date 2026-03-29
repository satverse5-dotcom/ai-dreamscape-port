import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// --- DATA ---
const data = {
  name: "Satyam Kumar Karn",
  title: "AI Engineer | Full Stack Developer",
  email: "satverse5@gmail.com",
  github: "github.com/satverse5-dotcom",
  linkedin: "linkedin.com/in/satyam-kumar-karn",
  location: "Pune, India",
  summary: "AI Engineer specializing in intelligent systems, computer vision, and full-stack AI applications. Passionate about building scalable, production-ready AI solutions with advanced prompt engineering and machine learning models. Pursuing B.Tech Computer Engineering at PCCOE Pune (2022–2026).",
  skills: {
    "AI/ML": ["Generative AI", "Machine Learning", "Deep Learning", "CNN", "PyTorch", "TensorFlow", "Scikit-learn", "Mediapipe"],
    "Cloud & Backend": ["Node.js", "Express.js", "Flask", "Python", "Firebase", "MongoDB", "SQL", "REST APIs"],
    "Frontend": ["React.js", "Next.js", "JavaScript", "HTML5/CSS3", "TailwindCSS"],
    "Tools": ["Git", "VSCode", "Docker", "Vercel", "Groq API", "Gemini API", "NumPy", "OpenCV"]
  },
  experience: [
    {
      role: "AI Developer Project",
      company: "Nexus Agent (Self-Led)",
      period: "2024",
      description: "Designed and implemented a full-stack conversational AI assistant using Flask and the Gemini API. Engineered complex prompt processing pipelines to deliver context-aware, intelligent responses."
    },
    {
      role: "Computer Vision Project",
      company: "AI Crop Disease Detection",
      period: "2024",
      description: "Developed a CNN-based computer vision model with 92% accuracy across 10+ crop disease classes. Integrated OpenCV for image preprocessing and MTCNN for specialized feature detection."
    }
  ],
  projects: [
    {
      name: "NexusAI Portfolio Platforms",
      tech: "React, Next.js, Groq API, Firebase, Express",
      description: "A SaaS-style AI-integrated portfolio with a real-time chatbot, animated UI, and automated data processing modules."
    },
    {
      name: "Gesture-Based Image Processing",
      tech: "Python, OpenCV, Mediapipe",
      description: "Built a library of 18+ real-time dynamic filters powered by hand gesture recognition with sub-50ms latency."
    }
  ],
  education: [
    {
      degree: "B.Tech Computer Engineering",
      institution: "Pimpri Chinchwad College of Engineering (PCCOE) Pune",
      period: "2022 – 2026"
    }
  ]
};

// --- PDF GENERATION ---
const doc = new PDFDocument({ margin: 50, size: 'A4' });
const outputPath = path.resolve('public/resume.pdf');

// Ensure public directory exists
if (!fs.existsSync('public')) fs.mkdirSync('public');

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// --- HELPER FUNCTIONS ---
const primaryColor = '#0EA5E9'; // Tailwind cyan-500 equivalent
const textColor = '#1F2937'; // Gray-800
const subTextColor = '#6B7280'; // Gray-500

doc.registerFont('Header', 'Helvetica-Bold');
doc.registerFont('Body', 'Helvetica');
doc.registerFont('Italic', 'Helvetica-Oblique');

// --- HEADER ---
doc.fillColor(primaryColor).font('Header').fontSize(26).text(data.name.toUpperCase(), { align: 'center' });
doc.moveDown(0.2);
doc.fillColor(textColor).font('Body').fontSize(14).text(data.title, { align: 'center' });
doc.moveDown(0.5);

doc.fontSize(10).fillColor(subTextColor).text(
  `${data.email} | ${data.linkedin} | ${data.github} | ${data.location}`,
  { align: 'center' }
);

doc.moveDown(1.5);
doc.strokeColor(primaryColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
doc.moveDown(1);

// --- SUMMARY ---
doc.fillColor(primaryColor).font('Header').fontSize(16).text('PROFESSIONAL SUMMARY');
doc.moveDown(0.5);
doc.fillColor(textColor).font('Body').fontSize(11).text(data.summary, { leading: 4 });
doc.moveDown(1.5);

// --- SKILLS ---
doc.fillColor(primaryColor).font('Header').fontSize(16).text('CORE COMPETENCIES');
doc.moveDown(0.5);

const skillCategories = Object.entries(data.skills);
skillCategories.forEach(([category, skills]) => {
  doc.fillColor(textColor).font('Header').fontSize(12).text(`${category}: `, { continued: true });
  doc.font('Body').fontSize(11).text(skills.join(', '));
  doc.moveDown(0.3);
});
doc.moveDown(1.2);

// --- EXPERIENCE / PROJECTS ---
doc.fillColor(primaryColor).font('Header').fontSize(16).text('ENGINEERING PROJECTS & EXPERIENCE');
doc.moveDown(0.5);

data.experience.concat(data.projects.map(p => ({ ...p, role: p.name, company: 'Project', period: '' }))).forEach(exp => {
  doc.fillColor(textColor).font('Header').fontSize(13).text(exp.role || exp.name);
  if (exp.company && exp.period) {
    doc.fillColor(subTextColor).font('Italic').fontSize(10).text(`${exp.company} | ${exp.period}`);
  } else if (exp.tech) {
    doc.fillColor(subTextColor).font('Italic').fontSize(10).text(`Tech Stack: ${exp.tech}`);
  }
  doc.moveDown(0.3);
  doc.fillColor(textColor).font('Body').fontSize(11).text(exp.description, { leading: 3 });
  doc.moveDown(0.8);
});

// --- EDUCATION ---
doc.moveDown(0.5);
doc.fillColor(primaryColor).font('Header').fontSize(16).text('EDUCATION');
doc.moveDown(0.5);

data.education.forEach(edu => {
  doc.fillColor(textColor).font('Header').fontSize(12).text(edu.degree);
  doc.fillColor(subTextColor).font('Body').fontSize(11).text(`${edu.institution} | ${edu.period}`);
  doc.moveDown(0.5);
});

// --- FOOTER ---
const pageCount = doc.bufferedPageRange().count;
doc.fontSize(8).fillColor(subTextColor).text(
  'Dynamically generated by NexusAI Automation Engine',
  50,
  doc.page.height - 50,
  { align: 'center' }
);

doc.end();

stream.on('finish', () => {
  console.log(`Successfully generated ATS-friendly resume at: ${outputPath}`);
});
