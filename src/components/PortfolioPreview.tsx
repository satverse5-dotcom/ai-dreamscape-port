"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, User, Layout, Briefcase, Code2, Info } from "lucide-react";

interface PortfolioData {
    name: string;
    headline: string;
    about: string;
    skillsSummary: string;
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
    }>;
}

interface PortfolioPreviewProps {
    data: PortfolioData;
    onDeploy: () => void;
    isLoading?: boolean;
}

const PortfolioPreview = ({ data, onDeploy, isLoading }: PortfolioPreviewProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong neon-glow-indigo rounded-xl overflow-hidden my-4 border border-primary/20"
        >
            <div className="bg-primary/10 px-4 py-3 border-b border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-semibold">
                    <Layout className="w-5 h-5" />
                    <span>Portfolio Preview</span>
                </div>
                <button
                    onClick={onDeploy}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)] transition-all disabled:opacity-50"
                >
                    {isLoading ? (
                        <span className="flex gap-1 items-center">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce [animation-delay:0.15s]">●</span>
                            Deploying...
                        </span>
                    ) : (
                        <>
                            <Rocket className="w-4 h-4" />
                            <span>Deploy Now</span>
                        </>
                    )}
                </button>
            </div>

            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                {/* Header Preview */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        <User className="w-3.5 h-3.5" />
                        <span>Identity</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        {data.name}
                    </h3>
                    <p className="text-lg text-foreground/90 font-medium italic">
                        "{data.headline}"
                    </p>
                </div>

                {/* About Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        <Info className="w-3.5 h-3.5" />
                        <span>Profile</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/50">
                        {data.about}
                    </p>
                </div>

                {/* Skills Summary */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Expertise</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {data.skillsSummary}
                    </p>
                </div>

                {/* Projects Preview */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Key Projects</span>
                    </div>
                    <div className="grid gap-4">
                        {data.projects.map((project, i) => (
                            <div
                                key={i}
                                className="bg-muted/30 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group"
                            >
                                <h4 className="text-primary font-bold group-hover:text-primary transition-colors mb-1">
                                    {project.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, j) => (
                                        <span
                                            key={j}
                                            className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PortfolioPreview;
