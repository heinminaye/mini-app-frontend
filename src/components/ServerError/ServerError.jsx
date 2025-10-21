import "./ServerError.css";

const ServerError = ({ error, onRetry }) => {

  return (
    <div className="server-error-overlay">
      <div className="server-error-card">
        <h3>⚠️ {error.message}</h3>
        {error.returncode !== 405 && (
          <p>
            Contact support:{" "}
            <a href="mailto:support@123fakturera.se" className="contact-link">
              support@123fakturera.se
            </a>
          </p>
        )}
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};


export default ServerError;
