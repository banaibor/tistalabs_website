import './pages.css';

const Infrastructure = () => {
  return (
    <main className="page page-infra">
      <header className="page-hero">
        <h1>Infrastructure</h1>
        <p>Cloud, data, security, and platform engineering designed for resilience and speed.</p>
      </header>

      <section className="page-section">
        <h2>Core capabilities</h2>
        <ul className="bullet-grid">
          <li>Cloud native and container platforms</li>
          <li>Observability and FinOps</li>
          <li>Data platforms and streaming</li>
          <li>Zero-trust security foundations</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Outcomes</h2>
        <div className="metrics">
          <div className="metric"><span className="num">99.99%</span><span>Uptime</span></div>
          <div className="metric"><span className="num">40%</span><span>Cost optimization</span></div>
          <div className="metric"><span className="num">+5x</span><span>Deploy frequency</span></div>
        </div>
      </section>
    </main>
  );
};

export default Infrastructure;
