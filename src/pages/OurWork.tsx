import './pages.css';

const OurWork = () => {
  return (
    <main className="page page-work">
      <header className="page-hero">
        <h1>Our Work</h1>
        <p>Selected case studies showcasing outcomes across web, automation, and AI.</p>
      </header>

      <section className="page-section">
        <h2>Highlights</h2>
        <div className="cards">
          <article className="card">
            <h3>Headless Commerce</h3>
            <p>Scaled storefront performance by 3x with edge rendering and API-first architecture.</p>
          </article>
          <article className="card">
            <h3>RPA + LLM Copilot</h3>
            <p>Reduced manual ops by 62% using automation paired with workflow-aware GPT agents.</p>
          </article>
          <article className="card">
            <h3>Vision Analytics</h3>
            <p>Real-time defect detection on production lines with a custom CV pipeline.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default OurWork;
