import React from "react";

function Header({
    title,
    currentEnvironment,
    replaceAutomatico,
    darkMode,
    onToggleDarkMode,
    onToggleReplaceAutomatico
}) {
    return (
        <header className="page-header">
            <div className="page-header__content">
                <p className="eyebrow">Central de apoio</p>
                <h1 id="page-title">{title}</h1>
                <p className="page-subtitle">
                    Central de comandos, ambientes e instruções de apoio para desenvolvimento, homologação, testes e validação.
                </p>
            </div>

            <div className="page-header__meta">
                <div className="page-header__meta-group">
                    <span className="meta-label">Ambiente atual</span>
                    <strong id="current-environment" className="environment-badge">
                        {currentEnvironment || "-"}
                    </strong>
                </div>

                <div className="page-header__meta-group">
                    <span className="meta-label">Replace Automático</span>
                    <button
                        type="button"
                        className={`replace-status-badge ${replaceAutomatico ? "is-active" : "is-inactive"}`}
                        onClick={onToggleReplaceAutomatico}
                        aria-pressed={replaceAutomatico}
                        title={replaceAutomatico ? "Desativar Replace Automático" : "Ativar Replace Automático"}
                    >
                        {replaceAutomatico ? "Ligado" : "Desligado"}
                    </button>
                </div>

                <div className="page-header__meta-group">
                    <span className="meta-label">Dark Mode</span>

                    <label className="darkmode-toggle" aria-label="Alternar dark mode">
                        <input
                            id="darkmode-toggle-input"
                            type="checkbox"
                            checked={darkMode}
                            onChange={(event) => onToggleDarkMode(event.target.checked)}
                        />
                        <span className="darkmode-slider"></span>
                    </label>
                </div>
            </div>
        </header>
    );
}

export default Header;