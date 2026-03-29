import React, { useState, useEffect } from 'react';
import About from './about';
import Skills from './skills';
import Projects from './projects';

const Portfolio = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/portfolioData.json')
            .then((res) => res.json())
            .then((json) => setData(json))
            .catch((err) => console.error("Failed to load portfolio data", err));
    }, []);

    if (!data) return <div className="loading">Loading Portfolio...</div>;

    return (
        <div className="portfolio-container">
            <header className="hero-section">
                <h1>{data.name}</h1>
                <h2>{data.headline}</h2>
            </header>

            <main>
                <About data={data.about} />
                <Skills data={data.skillsSummary} />
                <Projects data={data.projects} />
            </main>

            <footer>
                <p>&copy; {new Date().getFullYear()} {data.name}. Generated with AI Resume Builder.</p>
            </footer>
        </div>
    );
};

export default Portfolio;
