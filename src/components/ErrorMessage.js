import React from "react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-card">
        <h4>Something went wrong</h4>
        <p>{message}</p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
