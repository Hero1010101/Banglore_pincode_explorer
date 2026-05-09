import React, { useRef, useEffect } from "react";

const SearchBar = ({
  query,
  loading,
  suggestions,
  showSuggestions,
  onQueryChange,
  onSearch,
  onSuggestionSelect,
  onClear,
  setShowSuggestions,
}) => {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setShowSuggestions]);

  return (
    <div className="search-section">
      <div className="search-wrapper" ref={wrapperRef}>
        <div className="search-field">
          <span className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>

          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter Bangalore pincode (e.g. 560001)"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="search-input"
            maxLength={6}
            autoComplete="off"
            spellCheck={false}
          />

          {query && (
            <button className="clear-btn" onClick={onClear} title="Clear">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          className="search-btn"
          onClick={() => onSearch()}
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <span className="btn-spinner" />
          ) : (
            <>
              <span>Explore</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown animate-slide-down">
            {suggestions.map((s) => (
              <button
                key={s.pincode}
                className="suggestion-item"
                onClick={() => onSuggestionSelect(s.pincode)}
              >
                <span className="suggestion-pin">{s.pincode}</span>
                <span className="suggestion-area">{s.area}</span>
                <span className="suggestion-zone">{s.zone}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="quick-pills">
        <span className="pills-label">Popular:</span>
        {[
          { pin: "560001", label: "MG Road" },
          { pin: "560011", label: "Koramangala" },
          { pin: "560029", label: "Whitefield" },
          { pin: "560042", label: "Electronic City" },
          { pin: "560076", label: "Yelahanka" },
        ].map(({ pin, label }) => (
          <button
            key={pin}
            className="quick-pill"
            onClick={() => {
              onQueryChange(pin);
              onSearch(pin);
            }}
          >
            {label} · {pin}
          </button>
        ))}
      </div>

      <style>{`
        .search-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-field {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          background: var(--white);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius);
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .search-field:focus-within {
          border-color: var(--orange);
          box-shadow: 0 0 0 4px rgba(255, 77, 0, 0.1);
        }

        .search-icon {
          padding: 0 0 0 16px;
          color: var(--gray-400);
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 16px;
          color: var(--black);
          padding: 14px 12px;
          letter-spacing: 0.5px;
        }

        .search-input::placeholder {
          color: var(--gray-400);
          font-size: 15px;
        }

        .clear-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          padding: 0 12px;
          display: flex;
          align-items: center;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .clear-btn:hover {
          color: var(--black);
        }

        .search-btn {
          background: var(--orange);
          color: var(--white);
          border: none;
          border-radius: var(--radius);
          padding: 0 24px;
          height: 52px;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: var(--transition);
          flex-shrink: 0;
          letter-spacing: 0.3px;
        }

        .search-btn:hover:not(:disabled) {
          background: var(--orange-light);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 77, 0, 0.35);
        }

        .search-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .search-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          z-index: 100;
        }

        .suggestion-item {
          width: 100%;
          background: none;
          border: none;
          border-bottom: 1px solid var(--gray-100);
          cursor: pointer;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          transition: background 0.15s;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover {
          background: var(--orange-pale);
        }

        .suggestion-pin {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 14px;
          color: var(--orange);
          min-width: 54px;
        }

        .suggestion-area {
          flex: 1;
          font-size: 14px;
          color: var(--black);
        }

        .suggestion-zone {
          font-size: 11px;
          color: var(--gray-400);
          background: var(--gray-100);
          padding: 2px 8px;
          border-radius: 20px;
        }

        .quick-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pills-label {
          font-size: 12px;
          color: var(--gray-400);
          font-weight: 500;
          white-space: nowrap;
        }

        .quick-pill {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 12px;
          font-family: var(--font-body);
          color: var(--gray-600);
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }

        .quick-pill:hover {
          border-color: var(--orange);
          color: var(--orange);
          background: var(--orange-pale);
        }

        @media (max-width: 600px) {
          .search-wrapper {
            flex-direction: column;
          }
          .search-btn {
            width: 100%;
            justify-content: center;
            height: 48px;
          }
          .search-field {
            width: 100%;
          }
          .quick-pills {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
