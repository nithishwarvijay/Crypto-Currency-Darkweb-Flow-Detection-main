import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowRight, Shield, Zap, Eye, Lock, Activity, Globe } from 'lucide-react';
import './components/layout/Home.css';

const TICKERS = [
  { symbol: 'BTC', price: '$67,420', change: '+2.4%', up: true },
  { symbol: 'ETH', price: '$3,512', change: '+1.8%', up: true },
  { symbol: 'BNB', price: '$412', change: '-0.6%', up: false },
  { symbol: 'MATIC', price: '$0.89', change: '+3.1%', up: true },
  { symbol: 'SOL', price: '$178', change: '+4.2%', up: true },
  { symbol: 'AVAX', price: '$38.5', change: '-1.2%', up: false },
  { symbol: 'LINK', price: '$18.3', change: '+0.9%', up: true },
  { symbol: 'ARB', price: '$1.24', change: '+5.3%', up: true },
];

const FEATURES = [
  { icon: Eye, title: 'Multi-Chain Tracking', desc: 'Monitor ETH, BTC, MATIC, and BNB wallets from a single dashboard.' },
  { icon: Shield, title: 'Suspicious Detection', desc: 'Heuristic engine flags mixer interactions, rapid-fire txns, and high-risk patterns.' },
  { icon: Activity, title: 'Flow Analysis', desc: 'Visualize transaction flows with interactive charts and timeline views.' },
  { icon: Zap, title: 'Real-Time Data', desc: 'Live blockchain data via Etherscan API with up to 1000 transactions per query.' },
  { icon: Lock, title: 'Private & Secure', desc: 'No KYC required. Track any public wallet without exposing your own assets.' },
  { icon: Globe, title: 'ERC-20 & NFTs', desc: 'Drill into token transfers and NFT activity alongside native transactions.' },
];

const STATS = [
  { value: '4,600+', label: 'Token Logos' },
  { value: '4', label: 'Blockchains' },
  { value: '7', label: 'Risk Heuristics' },
];

const Home = () => {
  const tickerRef = useRef(null);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    const step = () => {
      pos -= speed;
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="home-container">
      {/* Ticker */}
      <div className="ticker-bar">
        <div className="ticker-track" ref={tickerRef}>
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-symbol">{t.symbol}</span>
              <span className="ticker-price">{t.price}</span>
              <span className={`ticker-change ${t.up ? 'up' : 'down'}`}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="home-nav">
        <div className="nav-logo">
          <Wallet className="logo-icon" />
          <span>CryptoChain</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#stats" className="nav-link">Stats</a>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="nav-button login">Login</Link>
          <Link to="/signup" className="nav-button signup">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="home-main">
        <div className="hero-badge">
          <span className="badge-dot" />
          Heuristic Suspicious Wallet Detection — Now Live
        </div>
        <h1 className="hero-title">
          Track. Analyze.<br />
          <span className="gradient-text">Detect Threats.</span>
        </h1>
        <p className="hero-subtitle">
          Real-time multi-chain wallet tracking with an AI-powered heuristic engine that flags suspicious activity, mixer interactions, and high-risk transaction patterns.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-button primary">
            Get Started <ArrowRight className="button-icon" />
          </Link>
          <Link to="/login" className="cta-button secondary">
            Login to Account
          </Link>
        </div>

        {/* Mock terminal card */}
        <div className="terminal-card">
          <div className="terminal-header">
            <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            <span className="terminal-title">heuristic-engine.js</span>
          </div>
          <pre className="terminal-body">{`> Analyzing wallet 0x910c...59d
  ✓ Checking known mixer addresses...  [HIT]
  ✓ Denomination pattern (1.0 ETH)...  [FLAGGED]
  ✓ Rapid-fire activity (8 txns/60s).. [FLAGGED]
  ✓ High-frequency sender check...     [PASS]
  
  Risk Score: 85  →  ⚠️  HIGH RISK`}</pre>
        </div>
      </main>

      {/* Stats */}
      <section id="stats" className="stats-section">
        {STATS.map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <h2 className="section-title">Everything you need to track the chain</h2>
        <p className="section-sub">From raw transaction data to risk intelligence — all in one place.</p>
        <div className="features-grid">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-wrap">
                <Icon size={22} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Ready to start tracking?</h2>
        <p>Create a free account and monitor any wallet in seconds.</p>
        <Link to="/signup" className="cta-button primary">
          Create Free Account <ArrowRight className="button-icon" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-logo">
          <Wallet size={18} />
          <span>CryptoChain</span>
        </div>
        <p className="footer-copy">© 2025 CryptoChain Tracker. No KYC. No tracking. Just data.</p>
        <div className="footer-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
