import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Gracechase</h1>
        <p>Grace has been chasing you. Maybe it's time to stop running.</p>
      </header>
      <section className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Hey there! We are Gracechase. We're an innovative music groupd that combines clever original lyrics with AI-generated melodies to create songs that are beautiful and wonderful, and aim to point the listener back to our Creator.
          </p>
        </div>
        <div className="about-section">
          <h2>What inspires us</h2>
          <p>
            We are deeply moved by the Grace of our Lord Jesus, and we want to remind our listeners of His unending love and mercy through our music. We love to write, and to share our stories, and we hope that we can inspire our listeners to the awe and wonder of creation, and of the One who made it all.
          </p>
        </div>
        <div className="about-section">
          <h2>Meet the Crew</h2>
          <p>Gracechase is brought to life by a team of AI "characters" and human collaborators:</p>
          <ul>
            <li><strong>Grace:</strong> The lead AI composer, inspired by classical elegance.</li>
            <li><strong>Chase:</strong> The rhythm generator, driven by dynamic energy.</li>
            <li><strong>Harmony:</strong> The human arranger, adding emotional depth.</li>
            <li><strong>Echo:</strong> The sound designer, crafting immersive audio experiences.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;