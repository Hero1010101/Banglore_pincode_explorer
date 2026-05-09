import React from "react";
import SearchBar from "./components/SearchBar";
import ResultCard from "./components/ResultCard";
import MapView from "./components/MapView";
import { usePincodeSearch } from "./hooks/usePincodeSearch";

const App = () => {
  const {
    query,
    result,
    error,
    loading,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    search,
    handleQueryChange,
    selectSuggestion,
    clear,
  } = usePincodeSearch();

  return (
    <div className="app">
      {/* Header section */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="brand-name">BLR Pincode</span>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="badge-dot" />
            Bangalore · Karnataka · India
          </div>
          <h1 className="hero-title">
            Explore <span className="accent">Bangalore</span>
            <br />Pincodes
          </h1>
          <p className="hero-subtitle">
            Discover area names, localities, and interactive boundary maps
            for any Bangalore pincode — instantly.
          </p>

          <SearchBar
            query={query}
            loading={loading}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            onQueryChange={handleQueryChange}
            onSearch={search}
            onSuggestionSelect={selectSuggestion}
            onClear={clear}
            setShowSuggestions={setShowSuggestions}
          />
        </div>

        {/* Background circles */}
        <div className="hero-bg">
          <div className="bg-circle bg-circle-1" />
          <div className="bg-circle bg-circle-2" />
          <div className="bg-grid" />
        </div>
      </section>

      {/* Results */}
      <main className="main">
        <div className="container">
          {/* Error animation */}
          {error && (
            <div className="error-card animate-fade-in">
              <div className="error-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <p className="error-title">Pincode not found</p>
                <p className="error-msg">{error}</p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="skeleton-container animate-fade-in">
              <div className="skeleton-card" />
              <div className="skeleton-map" />
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="results-grid animate-fade-in">
              <ResultCard result={result} />
              <MapView result={result} />
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="empty-state">
              <div className="empty-illustration">
                <div className="illustration-map">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="56" stroke="#e8e8e8" strokeWidth="2" strokeDasharray="8 4" />
                    <circle cx="60" cy="60" r="36" fill="#fff1eb" />
                    <path d="M60 35c-10 0-18 8-18 18 0 13 18 26 18 26s18-13 18-26c0-10-8-18-18-18z" fill="#FF4D00" opacity="0.8"/>
                    <circle cx="60" cy="53" r="6" fill="white"/>
                  </svg>
                </div>
              </div>
              <h2 className="empty-title">Ready to Explore</h2>
              <p className="empty-desc">
                Enter any Bangalore pincode above to see the area name,
                localities, and its boundary on the map.
              </p>
              <div className="stats-row">
                <div className="stat">
                  <span className="stat-num">80+</span>
                  <span className="stat-label">Pincodes</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-num">8</span>
                  <span className="stat-label">Zones</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-num">Real-time</span>
                  <span className="stat-label">Maps</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer section */}
      <footer className="footer">
        <div className="container">
          <p>This is just for the task given for application of learning path full stack development internship otherwise copyrights reserved to Harsh Hate</p>
          <p>© Harsh Hate</p>
        </div>
      </footer>

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(254, 252, 249, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--gray-200);
        }

        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: var(--orange);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 18px;
          color: var(--black);
          letter-spacing: -0.3px;
        }

        .nav-links {
          display: flex;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--gray-600);
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 8px;
          transition: var(--transition);
          border: 1px solid var(--gray-200);
        }

        .nav-link:hover {
          background: var(--gray-100);
          color: var(--black);
        }

        .hero {
          position: relative;
          padding: 72px 24px 64px;
          overflow: hidden;
          text-align: center;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 500;
          color: var(--gray-600);
          box-shadow: var(--shadow-sm);
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          background: var(--green);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 7vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          color: var(--black);
          letter-spacing: -2px;
        }

        .accent {
          color: var(--orange);
        }

        .hero-subtitle {
          font-size: 17px;
          color: var(--gray-600);
          line-height: 1.6;
          max-width: 500px;
          font-weight: 300;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.06;
        }

        .bg-circle-1 {
          width: 500px;
          height: 500px;
          background: var(--orange);
          top: -200px;
          right: -100px;
        }

        .bg-circle-2 {
          width: 300px;
          height: 300px;
          background: var(--orange);
          bottom: -100px;
          left: -50px;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(var(--gray-200) 1px, transparent 1px),
            linear-gradient(90deg, var(--gray-200) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.3;
          mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
        }

        .main {
          flex: 1;
          padding: 0 24px 64px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .error-card {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: var(--radius);
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 24px;
        }

        .error-icon {
          color: var(--red);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .error-title {
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 3px;
          font-size: 15px;
        }

        .error-msg {
          font-size: 14px;
          color: #dc2626;
        }

        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .skeleton-card,
        .skeleton-map {
          border-radius: var(--radius-lg);
          background: linear-gradient(
            90deg,
            var(--gray-100) 25%,
            var(--gray-200) 50%,
            var(--gray-100) 75%
          );
          background-size: 200% auto;
          animation: shimmer 1.5s linear infinite;
        }

        .skeleton-card {
          height: 180px;
        }

        .skeleton-map {
          height: 420px;
        }

        .results-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 48px 24px;
          gap: 16px;
        }

        .empty-illustration {
          margin-bottom: 8px;
        }

        .illustration-map {
          opacity: 0.8;
        }

        .empty-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--black);
        }

        .empty-desc {
          font-size: 16px;
          color: var(--gray-600);
          max-width: 400px;
          line-height: 1.6;
          font-weight: 300;
        }

        .stats-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 16px;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: 20px 32px;
          box-shadow: var(--shadow-sm);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-num {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: var(--orange);
        }

        .stat-label {
          font-size: 12px;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--gray-200);
        }

        .footer {
          border-top: 1px solid var(--gray-200);
          padding: 20px 24px;
          text-align: center;
        }

        .footer p {
          font-size: 13px;
          color: var(--gray-400);
        }

        @media (max-width: 600px) {
          .hero {
            padding: 48px 16px 48px;
          }

          .hero-title {
            letter-spacing: -1px;
          }

          .main {
            padding: 0 16px 48px;
          }

          .stats-row {
            gap: 16px;
            padding: 16px 20px;
          }

          .stat-num {
            font-size: 20px;
          }

          .skeleton-map {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
