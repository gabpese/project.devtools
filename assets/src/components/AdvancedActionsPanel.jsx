import React from "react";
import ActionTooltip from "./ActionTooltip";

function AdvancedActionsPanel({
    onManualAction,
    onModalAction,
    onAdvancedAction
}) {
    const advancedActions = [
        {
            key: "reload",
            title: "Reload",
            description: "Escolhe módulo e classe para recarregar arquivos Ruby do plugin.",
            kind: "modal"
        },
        {
            key: "find-flagged-components",
            title: "Procurar por Bandeiras",
            description: "Varre o model e valida no Console Ruby quais componentes possuem o atributo gbsflagged.",
            kind: "manual"
        },
        {
            key: "dynamic-attribute",
            title: "Alterar Atributo Dinâmico",
            description: "Altera o valor de um atributo dinâmico nas entidades internas do componente selecionado.",
            kind: "modal"
        },
        {
            key: "meddler-acabamento",
            title: "Request Acabamento",
            description: "Consulta os atributos de acabamento que o ID está programado para receber.",
            kind: "advanced"
        },
        {
            key: "meddler-composicao",
            title: "Request Composição",
            description: "Consulta os atributos da primeira camada que o ID está programado para receber.",
            kind: "advanced"
        },
        {
            key: "meddler-peca",
            title: "Request Peça",
            description: "Consulta os atributos da camada de substituição que o ID está programado para receber.",
            kind: "advanced"
        },
        {
            key: "meddler-modelo",
            title: "Request Modelo",
            description: "Consulta os modelos que o ID está programado para receber.",
            kind: "advanced"
        },
        {
            key: "meddler-frente",
            title: "Request Frente",
            description: "Consulta as frentes que o ID está programado para receber.",
            kind: "advanced"
        },
        {
            key: "meddler-ferragem",
            title: "Request Ferragem",
            description: "Consulta as ferragens que o ID está programado para receber.",
            kind: "advanced"
        }
    ];

    function handleAction(action) {
        if (action.kind === "manual") {
            onManualAction(action.key);
            return;
        }

        if (action.kind === "modal") {
            onModalAction(action.key);
            return;
        }

        if (action.kind === "advanced") {
            onAdvancedAction(action.key);
        }
    }

    return (
        <section id="section-acoes-avancadas" className="panel" aria-labelledby="section-acoes-avancadas-title">
            <div className="panel__header">
                <div>
                    <h2 id="section-acoes-avancadas-title">Ações avançadas</h2>
                    <p>Consultas técnicas e ações com parâmetros adicionais.</p>
                </div>
            </div>

            <div className="manual-action-grid" role="group" aria-label="Ações avançadas">
                {advancedActions.map((action) => (
                    <ActionTooltip
                        key={action.key}
                        content={action.description}
                        preferredPlacement="top"
                    >
                        <button
                            className="manual-action-button"
                            type="button"
                            onClick={() => handleAction(action)}
                            aria-label={`${action.title}. ${action.description}`}
                        >
                            <strong>{action.title}</strong>
                        </button>
                    </ActionTooltip>
                ))}
            </div>
        </section>
    );
}

export default AdvancedActionsPanel;