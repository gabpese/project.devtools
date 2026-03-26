import React from "react";

function LoadingOverlay({
    isOpen,
    message
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="loading-overlay" aria-live="polite" aria-busy="true">
            <div className="loading-card">
                <div className="loading-spinner" aria-hidden="true"></div>
                <div className="loading-content">
                    <strong className="loading-title">Processando</strong>
                    <p className="loading-message">{message || "Executando ação..."}</p>
                    <div className="loading-progress" aria-hidden="true">
                        <div className="loading-progress__bar"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingOverlay;