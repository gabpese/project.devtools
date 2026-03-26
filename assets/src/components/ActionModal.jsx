import React from "react";

function ActionModal({
    isOpen,
    modalTitle,
    modalDescription,
    modalType,
    modalForm,
    advancedResult,
    onClose,
    onSubmit,
    onOverlayClick,
    onFieldChange
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            id="action-modal-overlay"
            className="modal-overlay"
            aria-hidden="false"
            onClick={onOverlayClick}
        >
            <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="action-modal-title">
                <div className="modal-card__header">
                    <div>
                        <h2 id="action-modal-title">{modalTitle}</h2>
                        <p id="action-modal-description" className="modal-card__description">
                            {modalDescription}
                        </p>
                    </div>

                    <button className="ghost-button" type="button" onClick={onClose}>
                        Fechar
                    </button>
                </div>

                {modalType === "reload" && (
                    <div id="reload-modal-fields" className="modal-fields">
                        <div className="reload-form-grid">
                            <label className="form-field">
                                <span>Module</span>
                                <input
                                    id="reload-module"
                                    type="text"
                                    value={modalForm.reloadModule}
                                    placeholder="Ex.: ** ou Plataforma"
                                    onChange={(event) => onFieldChange("reloadModule", event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            onSubmit();
                                        }
                                    }}
                                />
                            </label>

                            <label className="form-field">
                                <span>Class</span>
                                <input
                                    id="reload-class"
                                    type="text"
                                    value={modalForm.reloadClass}
                                    placeholder="Ex.: Home ou *"
                                    onChange={(event) => onFieldChange("reloadClass", event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            onSubmit();
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                )}

                {modalType === "dynamic-attribute" && (
                    <div id="dynamic-attribute-modal-fields" className="modal-fields">
                        <div className="reload-form-grid">
                            <label className="form-field">
                                <span>Nome do atributo</span>
                                <input
                                    id="dynamic-attribute-name"
                                    type="text"
                                    value={modalForm.dynamicAttributeName}
                                    placeholder="Ex.: gbscomponente"
                                    autoComplete="off"
                                    spellCheck={false}
                                    onChange={(event) => onFieldChange("dynamicAttributeName", event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            onSubmit();
                                        }
                                    }}
                                />
                            </label>

                            <label className="form-field">
                                <span>Novo valor</span>
                                <input
                                    id="dynamic-attribute-value"
                                    type="text"
                                    value={modalForm.dynamicAttributeValue}
                                    placeholder="Ex.: 7252"
                                    onChange={(event) => onFieldChange("dynamicAttributeValue", event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            onSubmit();
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                )}

                {modalType === "advanced" && (
                    <>
                        <div id="advanced-modal-fields" className="modal-fields">
                            <div className="reload-form-grid">
                                <label className="form-field">
                                    <span>ID</span>
                                    <input
                                        id="advanced-action-id"
                                        type="text"
                                        value={modalForm.advancedId}
                                        placeholder="Ex.: 14200"
                                        onChange={(event) => onFieldChange("advancedId", event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                onSubmit();
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        {advancedResult.visible && (
                            <div id="advanced-result-modal-section" className="modal-fields">
                                <div className="advanced-result-meta">
                                    <div>
                                        <strong>Ação:</strong>{" "}
                                        <span id="advanced-result-action">{advancedResult.action_label || "-"}</span>
                                    </div>
                                    <div>
                                        <strong>ID:</strong>{" "}
                                        <span id="advanced-result-id">{advancedResult.id || "-"}</span>
                                    </div>
                                </div>

                                <pre id="advanced-result-content" className="advanced-result-content">
                                    {advancedResult.result_text}
                                </pre>
                            </div>
                        )}
                    </>
                )}

                <div className="reload-form-actions">
                    <button id="submit-action-modal" className="ghost-button" type="button" onClick={onSubmit}>
                        Executar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ActionModal;