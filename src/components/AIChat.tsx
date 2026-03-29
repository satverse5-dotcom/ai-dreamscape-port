"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Paperclip, FileText, Rocket, ShieldCheck, KeyRound, Github, Globe } from "lucide-react";
import PortfolioPreview from "./PortfolioPreview";

// --- Deploy flow state machine ---
type DeployStep =
  | "idle"
  | "asking_github"
  | "asking_vercel"
  | "confirming"
  | "deploying"
  | "done";

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string; isSecure?: boolean }[]>([
    { role: "ai", text: "Hi! I'm an AI assistant powered by Groq. Ask me anything about this portfolio!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Deploy flow state
  const [deployStep, setDeployStep] = useState<DeployStep>("idle");
  const [githubToken, setGithubToken] = useState("");
  const [vercelToken, setVercelToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // --- Start deploy flow when user types "deploy" ---
  const startDeployFlow = () => {
    setDeployStep("asking_github");
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: `🔐 To auto-deploy your resume to Vercel, I need secure access.\n\nPlease provide the following:\n\n✔ GitHub Personal Access Token\n✔ Vercel API Token\n\nThese will be used only for this deployment and never stored.\n\n─────────────────────\n📌 Step 1 of 2 — GitHub PAT\n\nGo to: github.com/settings/tokens\n→ New classic token\n→ Check "repo" scope\n→ Copy & paste below 👇`,
      },
    ]);
  };

  // --- Handle secure token input during deploy flow ---
  const handleTokenSubmit = async () => {
    if (!tokenInput.trim()) return;

    if (deployStep === "asking_github") {
      setGithubToken(tokenInput.trim());
      setTokenInput("");
      setDeployStep("asking_vercel");
      setMessages((prev) => [
        ...prev,
        { role: "user", text: "••••••••••••••••• (GitHub Token)", isSecure: true },
        {
          role: "ai",
          text: `✅ GitHub token received securely.\n\n─────────────────────\n📌 Step 2 of 2 — Vercel API Token\n\nGo to: vercel.com/account/tokens\n→ Create a new token\n→ Copy & paste below 👇`,
        },
      ]);
    } else if (deployStep === "asking_vercel") {
      setVercelToken(tokenInput.trim());
      setTokenInput("");
      setDeployStep("confirming");
      setMessages((prev) => [
        ...prev,
        { role: "user", text: "••••••••••••••••• (Vercel Token)", isSecure: true },
        {
          role: "ai",
          text: `✅ Vercel token received securely.\n\n─────────────────────\n🚀 Ready to deploy!\n\nI will:\n1. Regenerate your professional resume PDF\n2. Git commit + push changes to GitHub\n3. Trigger Vercel auto-deployment\n\nType "confirm" to proceed or "cancel" to abort.`,
        },
      ]);
    } else if (deployStep === "confirming") {
      if (tokenInput.trim().toLowerCase() === "confirm") {
        setTokenInput("");
        await triggerDeployment();
      } else if (tokenInput.trim().toLowerCase() === "cancel") {
        setTokenInput("");
        setDeployStep("idle");
        setGithubToken("");
        setVercelToken("");
        setMessages((prev) => [
          ...prev,
          { role: "user", text: "cancel" },
          { role: "ai", text: "❌ Deployment cancelled. Your credentials have been cleared." },
        ]);
      } else {
        setTokenInput("");
        setMessages((prev) => [...prev, { role: "ai", text: 'Please type "confirm" to deploy or "cancel" to abort.' }]);
      }
    }
  };

  // --- Trigger actual deployment ---
  const triggerDeployment = async () => {
    setDeployStep("deploying");
    setIsDeploying(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "confirm" },
      { role: "ai", text: "⚙️ Deployment started...\n\n🔄 Regenerating resume PDF...\n🔄 Committing to GitHub...\n🔄 Triggering Vercel deployment..." },
    ]);

    try {
      const res = await fetch("/api/deploy-vercel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubToken, vercelToken }),
      });

      const data = await res.json();

      if (data.success) {
        setDeployStep("done");
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: `🎉 ${data.message}\n\n${data.vercelDeploymentUrl ? `🌐 Live URL: ${data.vercelDeploymentUrl}` : ""}\n${data.githubRepo ? `📦 GitHub: ${data.githubRepo}` : ""}\n\nYour resume PDF is now live and downloadable worldwide!`,
          },
        ]);
      } else {
        setDeployStep("idle");
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: `❌ Deployment failed: ${data.error}\n\nPlease check your tokens and try again.` },
        ]);
      }
    } catch {
      setDeployStep("idle");
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `⚠️ Could not reach the deployment server. Make sure the backend is running on port 5000.` },
      ]);
    } finally {
      setIsDeploying(false);
      setGithubToken("");
      setVercelToken("");
    }
  };

  const handleSend = async () => {
    if (deployStep !== "idle" && deployStep !== "done") {
      await handleTokenSubmit();
      return;
    }

    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    // Check for deploy command
    if (input.trim().toLowerCase() === "deploy" || input.trim().toLowerCase() === "deploy resume") {
      setMessages((prev) => [...prev, { role: "user", text: input.trim() }]);
      setInput("");
      startDeployFlow();
      return;
    }

    setIsLoading(true);

    if (selectedFiles.length > 0) {
      console.log(`[Frontend] Sending ${selectedFiles.length} files:`, selectedFiles.map(f => f.name));
      const formData = new FormData();
      selectedFiles.forEach((file: File) => {
        formData.append("resumes", file); // Field name MUST match 'resumes'
      });

      setMessages((prev) => [...prev, { role: "user", text: `📎 Uploaded ${selectedFiles.length} resumes: ${selectedFiles.map((f: File) => f.name).join(", ")}` }]);
      setSelectedFiles([]);

      try {
        const res = await fetch(`/api/ai/upload-resume`, {
          method: "POST",
          // NOTE: Do NOT set Content-Type header. Fetch does this automatically for FormData.
          body: formData,
        });

        const data = await res.json();
        console.log(`[Frontend] Response received:`, data);

        if (res.ok && data.success && data.parsedResume && data.portfolioContent) {
          setMessages((prev) => [
            ...prev,
            { role: "ai", text: "I've generated a preview of your portfolio content. You can review it and click 'Deploy' when you're ready!" },
          ]);
          setPreviewData({
            name: data.parsedResume.name || "Developer",
            resumeData: data.parsedResume,
            ...data.portfolioContent,
          });
        } else {
          setMessages((prev) => [...prev, { role: "ai", text: data.error || "Failed to process the resume." }]);
        }
      } catch (err: any) {
        console.error(`[Frontend] Upload error:`, err);
        setMessages((prev) => [...prev, { role: "ai", text: "⚠️ Error uploading resume to the backend." }]);
      }
    } else {
      const userMsg = input.trim();
      setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
      setInput("");

      try {
        const res = await fetch(`/api/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "ai", text: data.reply || "No response received." }]);
      } catch {
        setMessages((prev) => [...prev, { role: "ai", text: "⚠️ Could not reach the AI backend. Please try again later." }]);
      }
    }

    setIsLoading(false);
  };

  const handleDeploy = async () => {
    if (!previewData || isDeploying) return;
    setIsDeploying(true);
    try {
      const res = await fetch(`/api/ai/deploy-portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: previewData.name,
          resumeData: previewData.resumeData,
          portfolioContent: {
            headline: previewData.headline,
            about: previewData.about,
            skillsSummary: previewData.skillsSummary,
            projects: previewData.projects,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "ai", text: `🚀 Portfolio deployed! ID: ${data.template.portfolioId}` }]);
        setPreviewData(null);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: data.error || "Deployment failed." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "⚠️ Could not connect to the deployment server." }]);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const filtered = newFiles.filter((file: File) => validTypes.includes(file.type) || file.name.endsWith(".pdf") || file.name.endsWith(".docx"));
      if (filtered.length < newFiles.length) alert("Some files were skipped. Please upload only PDF or DOCX files.");
      if (filtered.length > 0) {
        setSelectedFiles((prev: File[]) => [...prev, ...filtered]);
        setInput("");
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
  };

  const isInDeployFlow = deployStep !== "idle" && deployStep !== "done";
  const inputPlaceholder = isLoading
    ? "AI is thinking..."
    : deployStep === "asking_github"
    ? "Paste your GitHub PAT here..."
    : deployStep === "asking_vercel"
    ? "Paste your Vercel token here..."
    : deployStep === "confirming"
    ? 'Type "confirm" or "cancel"...'
    : deployStep === "deploying"
    ? "Deploying... please wait"
    : selectedFiles.length > 0
    ? "Press Send to upload..."
    : 'Type a message or "deploy resume"...';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {previewData && open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="w-[450px] mb-2"
          >
            <PortfolioPreview data={previewData} onDeploy={handleDeploy} isLoading={isDeploying} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-strong neon-glow-indigo mb-4 w-80 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                {isInDeployFlow ? (
                  <ShieldCheck className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <Bot className="w-5 h-5 text-primary" />
                )}
                <span className="text-sm font-semibold text-foreground">
                  {isInDeployFlow ? "Secure Deploy" : "AI Assistant"}
                </span>
                {isInDeployFlow && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono">🔒 encrypted</span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? msg.isSecure
                          ? "bg-green-900/40 text-green-400 border border-green-500/30 font-mono"
                          : "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.isSecure && <KeyRound className="w-3 h-3 inline mr-1 opacity-60" />}
                    {msg.text}
                  </div>
                </div>
              ))}
              {(isLoading || deployStep === "deploying") && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-3 py-2 rounded-lg text-xs flex gap-1 items-center">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:0.15s]">●</span>
                    <span className="animate-bounce [animation-delay:0.3s]">●</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick action — Deploy button */}
            {deployStep === "idle" && (
              <div className="px-4 pb-2">
                <button
                  onClick={() => {
                    setMessages((prev) => [...prev, { role: "user", text: "deploy resume" }]);
                    startDeployFlow();
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs py-1.5 rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary/15 transition-all"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Deploy Resume to Vercel
                </button>
              </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-border flex flex-col gap-2 relative">
              {selectedFiles.length > 0 && !isInDeployFlow && (
                <div className="absolute -top-32 left-3 right-3 bg-primary/20 border border-primary/30 rounded-md p-2 text-xs text-primary flex flex-col gap-1 backdrop-blur-sm z-10 max-h-28 overflow-y-auto">
                  {selectedFiles.map((file: File, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-2 bg-background/40 px-2 py-1 rounded">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(idx)} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 items-center relative z-20">
                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" className="hidden" />

                {!isInDeployFlow && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-colors disabled:opacity-50"
                    title="Upload Resume (PDF/DOCX)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                )}

                {isInDeployFlow && (
                  <div className="p-2 text-green-400" title="Secure input mode">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}

                <input
                  type={isInDeployFlow && (deployStep === "asking_github" || deployStep === "asking_vercel") ? "password" : "text"}
                  value={isInDeployFlow ? tokenInput : input}
                  onChange={(e) => (isInDeployFlow ? setTokenInput(e.target.value) : setInput(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={inputPlaceholder}
                  disabled={isLoading || deployStep === "deploying" || (!isInDeployFlow && selectedFiles.length > 0)}
                  autoComplete="off"
                  className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />

                <button
                  onClick={handleSend}
                  disabled={
                    isLoading ||
                    deployStep === "deploying" ||
                    (!isInDeployFlow && !input.trim() && selectedFiles.length === 0) ||
                    (isInDeployFlow && !tokenInput.trim())
                  }
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_30px_hsl(var(--neon-cyan)/0.4)] hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.6)] transition-all"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default AIChat;
