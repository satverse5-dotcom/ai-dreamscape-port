import React from 'react';

const Projects = ({ data }) => {
    if (!data || !Array.isArray(data)) return null;

    return (
        <section className="projects-section" id="projects">
            <h3>Featured Projects</h3>
            <div className="projects-grid">
                {data.map((project, index) => (
                    <div key={index} className="project-card">
                        <h4>{project.name}</h4>
                        <p>{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="tech-tags">
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
