import React from "react";

function EnvironmentPanel({
    sectionId,
    title,
    description,
    currentEnvironment,
    environmentButtons = [],
    onEnvironmentAction
}) {
    const headingId = `${sectionId}-title`;
    const groupLabel = title || "Botões";

    return (
        <section
            id={sectionId}
            className="panel panel--highlight"
            aria-labelledby={headingId}
        >
            <div className="panel__header">
                <div>
                    <h2 id={headingId}>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>

            <div
                className="environment-grid"
                role="group"
                aria-label={groupLabel}
            >
                {environmentButtons.map((buttonData) => {
                    const isActive =
                        buttonData.action === "switch" &&
                        buttonData.environment === currentEnvironment;

                    const className = [
                        "environment-button",
                        buttonData.action === "releases" ? "environment-button--release" : "",
                        isActive ? "is-active" : ""
                    ].filter(Boolean).join(" ");

                    return (
                        <button
                            key={buttonData.key || buttonData.label}
                            type="button"
                            className={className}
                            onClick={() => onEnvironmentAction && onEnvironmentAction(buttonData)}
                            title={buttonData.label}
                        >
                            {buttonData.label}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default EnvironmentPanel;