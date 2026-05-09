import React from "react";

const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="result-card animate-fade-in">
      {/* Header */}
      <div className="result-header">
        <div className="pincode-badge">{result.pincode}</div>
        <div className="result-info">
          <h2 className="result-area">{result.area}</h2>
          <p className="result-location">
            {result.district}, {result.state}
          </p>
        </div>
        {result.zone && (
          <span className="zone-tag">{result.zone}</span>
        )}
      </div>

      {/* Localities */}
      {result.localities && result.localities.length > 0 && (
        <div className="localities-section">
          <h3 className="section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Localities
          </h3>
          <div className="localities-list">
            {result.localities.map((loc) => (
              <span key={loc} className="locality-chip">{loc}</span>
            ))}
          </div>
        </div>
      )}

      {/* Meta info */}
      <div className="meta-row">
        <div className="meta-item">
          <span className="meta-icon">🌏</span>
          <div>
            <span className="meta-label">Country</span>
            <span className="meta-value">{result.country || "India"}</span>
          </div>
        </div>
        <div className="meta-item">
          <span className="meta-icon">📍</span>
          <div>
            <span className="meta-label">Coordinates</span>
            <span className="meta-value">
              {result.coordinates.lat.toFixed(4)}°N,{" "}
              {result.coordinates.lng.toFixed(4)}°E
            </span>
          </div>
        </div>
        <div className="meta-item">
          <span className="meta-icon">🗺️</span>
          <div>
            <span className="meta-label">Boundary</span>
            <span className="meta-value">
              {result.boundaryApprox ? "Available" : "Approximate"}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .result-card {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .result-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          border-bottom: 1px solid var(--gray-100);
          flex-wrap: wrap;
        }

        .pincode-badge {
          background: var(--orange);
          color: white;
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
          padding: 10px 18px;
          border-radius: 10px;
          letter-spacing: 1px;
          flex-shrink: 0;
          line-height: 1;
        }

        .result-info {
          flex: 1;
          min-width: 0;
        }

        .result-area {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--black);
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .result-location {
          font-size: 14px;
          color: var(--gray-600);
        }

        .zone-tag {
          background: var(--orange-pale);
          color: var(--orange);
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          white-space: nowrap;
          border: 1px solid rgba(255, 77, 0, 0.2);
          align-self: flex-start;
        }

        .localities-section {
          padding: 20px 24px;
          border-bottom: 1px solid var(--gray-100);
        }

        .section-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--gray-400);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .localities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .locality-chip {
          background: var(--gray-100);
          color: var(--gray-800);
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid var(--gray-200);
        }

        .meta-row {
          display: flex;
          gap: 0;
          padding: 0;
        }

        .meta-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 20px;
          border-right: 1px solid var(--gray-100);
        }

        .meta-item:last-child {
          border-right: none;
        }

        .meta-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .meta-item > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-label {
          font-size: 11px;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .meta-value {
          font-size: 13px;
          color: var(--black);
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .result-header {
            padding: 16px;
          }

          .result-area {
            font-size: 18px;
          }

          .pincode-badge {
            font-size: 18px;
            padding: 8px 14px;
          }

          .meta-row {
            flex-direction: column;
          }

          .meta-item {
            border-right: none;
            border-bottom: 1px solid var(--gray-100);
            padding: 12px 16px;
          }

          .meta-item:last-child {
            border-bottom: none;
          }

          .localities-section {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
