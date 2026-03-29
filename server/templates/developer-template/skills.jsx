import React from 'react';

const Skills = ({ data }) => {
    if (!data) return null;

    return (
        <section className="skills-section" id="skills">
            <h3>Skills & Expertise</h3>
            <p>{data}</p>
        </section>
    );
};

export default Skills;
