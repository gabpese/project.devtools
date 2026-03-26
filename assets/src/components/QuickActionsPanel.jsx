import React from "react";
import ActionTooltip from "./ActionTooltip";

function QuickActionsPanel({
    onManualAction
}) {
    const quickActions = [
        {
            key: "clear-flags",
            title: "Limpar Bandeirinhas",
            description: "Executa limpeza das flags de componentes produzidos."
        },
        {
            key: "import-dxfs",
            title: "Importar DXFs",
            description: "Importa os arquivos DXF da pasta escolhida."
        },
        {
            key: "clear-selected-materials",
            title: "Limpar Materiais",
            description: "Remove materiais da seleção atual, incluindo faces, componentes e grupos."
        },
        {
            key: "clear-local-plugin-files",
            title: "Limpar Diretório Local",
            description: "Remove arquivos locais de skp, lib e jsons e refaz download e processamento dos JSONs."
        }
    ];

    return (
        <section id="section-acoes-rapidas" className="panel" aria-labelledby="section-acoes-rapidas-title">
            <div className="panel__header">
                <div>
                    <h2 id="section-acoes-rapidas-title">Ações rápidas</h2>
                    <p>Comandos de uso frequente para operações diretas no plugin.</p>
                </div>
            </div>

            <div className="manual-action-grid" role="group" aria-label="Ações rápidas">
                {quickActions.map((action) => (
                    <ActionTooltip
                        key={action.key}
                        content={action.description}
                        preferredPlacement="top"
                    >
                        <button
                            className="manual-action-button"
                            type="button"
                            onClick={() => onManualAction(action.key)}
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

export default QuickActionsPanel;