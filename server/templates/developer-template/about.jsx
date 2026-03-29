import React from 'react';

const About = ({ data }) => {
    if (!data) return null;

    return (
        <section className="about-section" id="about">
            <h3>About Me</h3>
            <p>{data}</p>
        </section>
    );
};

export default About;
