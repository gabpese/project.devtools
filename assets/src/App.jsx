import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import TopNav from "./components/TopNav";
import EnvironmentPanel from "./components/EnvironmentPanel";
import QuickActionsPanel from "./components/QuickActionsPanel";
import AdvancedActionsPanel from "./components/AdvancedActionsPanel";
import ActionModal from "./components/ActionModal";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
    const [pageData, setPageData] = useState({
        title: "Gabster DevTools",
        current_environment: "-",
        environment_buttons: [],
        replace_automatico: false
    });

    const [darkMode, setDarkMode] = useState(false);

    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        action: null
    });

    const [modalForm, setModalForm] = useState({
        reloadModule: "",
        reloadClass: "",
        advancedId: "",
        dynamicAttributeName: "",
        dynamicAttributeValue: ""
    });

    const [advancedResult, setAdvancedResult] = useState({
        visible: false,
        action_name: "",
        action_label: "",
        id: "",
        result_text: "Nenhum resultado disponível."
    });

    const [busyState, setBusyState] = useState({
        isOpen: false,
        message: ""
    });

    useEffect(() => {
        try {
            const savedDarkMode = window.localStorage.getItem("gabster-devtools-dark-mode") === "true";
            setDarkMode(savedDarkMode);
        } catch (error) {
            setDarkMode(false);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        try {
            window.localStorage.setItem("gabster-devtools-dark-mode", darkMode ? "true" : "false");
        } catch (error) {
        }
    }, [darkMode]);

    function openBusy(message) {
        setBusyState({
            isOpen: true,
            message: message || "Executando ação..."
        });
    }

    function closeBusy() {
        setBusyState({
            isOpen: false,
            message: ""
        });
    }

    function callSketchup(action, ...args) {
        if (window.sketchup && typeof window.sketchup[action] === "function") {
            window.sketchup[action](...args);
        }
    }

    function getBusyMessage(actionName) {
        const messageMap = {
            dialogReady: "Carregando dados da DevTools...",
            switchEnvironment: "Trocando ambiente e atualizando contexto...",
            openReleases: "Abrindo seletor de releases...",
            runManualAction: "Executando ação...",
            runReloadAction: "Executando reload...",
            runAdvancedAction: "Consultando dados...",
            toggleReplaceAutomatico: "Atualizando Replace Automático...",
            runDynamicAttributeAction: "Atualizando atributo dinâmico..."
        };

        return messageMap[actionName] || "Processando ação...";
    }

    function callSketchupWithBusy(action, ...args) {
        openBusy(getBusyMessage(action));
        callSketchup(action, ...args);
    }

    useEffect(() => {
        window.GabsterReactBridge = {
            render(payload) {
                setPageData({
                    title: payload?.title || "Gabster DevTools",
                    current_environment: payload?.current_environment || "-",
                    environment_buttons: Array.isArray(payload?.environment_buttons) ? payload.environment_buttons : [],
                    replace_automatico: !!payload?.replace_automatico
                });

                closeBusy();
            },

            showManualActionResult(message) {
                closeBusy();

                if (message) {
                    window.alert(message);
                }
            },

            showAdvancedActionResult(payload) {
                setAdvancedResult({
                    visible: true,
                    action_name: payload?.action_name || "",
                    action_label: payload?.action_label || "",
                    id: payload?.id || "",
                    result_text: payload?.result_text || "Nenhum resultado disponível."
                });

                closeBusy();
            }
        };

        return () => {
            delete window.GabsterReactBridge;
        };
    }, []);

    useEffect(() => {
        callSketchupWithBusy("dialogReady");
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape" && modalState.isOpen) {
                closeActionModal();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalState.isOpen]);

    const modalTitle = useMemo(() => {
        const titleMap = {
            reload: "Executar reload",
            "dynamic-attribute": "Alterar Atributo Dinâmico",
            "meddler-acabamento": "Request Acabamento",
            "meddler-composicao": "Request Composição",
            "meddler-peca": "Request Peça",
            "meddler-modelo": "Request Modelo",
            "meddler-frente": "Request Frente",
            "meddler-ferragem": "Request Ferragem"
        };

        if (modalState.type === "advanced" && modalState.action) {
            return titleMap[modalState.action] || "Executar ação avançada";
        }

        return titleMap[modalState.type] || "Executar ação";
    }, [modalState]);

    const modalDescription = useMemo(() => {
        if (modalState.type === "reload") {
            return "Informe os valores de module e class para recarregar os arquivos desejados.";
        }

        if (modalState.type === "dynamic-attribute") {
            return "Informe o nome do atributo e o novo valor para atualizar as entidades internas do componente selecionado.";
        }

        if (modalState.type === "advanced") {
            return "Informe o ID para executar a consulta.";
        }

        return "";
    }, [modalState]);

    const environmentButtons = useMemo(() => {
        return pageData.environment_buttons.filter((buttonData) => buttonData.action !== "releases");
    }, [pageData.environment_buttons]);

    const releaseButtons = useMemo(() => {
        return pageData.environment_buttons.filter((buttonData) => buttonData.action === "releases");
    }, [pageData.environment_buttons]);

    function resetAdvancedResult() {
        setAdvancedResult({
            visible: false,
            action_name: "",
            action_label: "",
            id: "",
            result_text: "Nenhum resultado disponível."
        });
    }

    function openReloadModal() {
        setModalForm((prev) => ({
            ...prev,
            reloadModule: "",
            reloadClass: ""
        }));

        resetAdvancedResult();

        setModalState({
            isOpen: true,
            type: "reload",
            action: "reload"
        });
    }

    function openDynamicAttributeModal() {
        setModalForm((prev) => ({
            ...prev,
            dynamicAttributeName: "",
            dynamicAttributeValue: ""
        }));

        resetAdvancedResult();

        setModalState({
            isOpen: true,
            type: "dynamic-attribute",
            action: "dynamic-attribute"
        });
    }

    function openAdvancedModal(actionName) {
        setModalForm((prev) => ({
            ...prev,
            advancedId: ""
        }));

        resetAdvancedResult();

        setModalState({
            isOpen: true,
            type: "advanced",
            action: actionName
        });
    }

    function closeActionModal() {
        resetAdvancedResult();

        setModalState({
            isOpen: false,
            type: null,
            action: null
        });
    }

    function handleEnvironmentAction(buttonData) {
        if (buttonData.action === "releases") {
            callSketchupWithBusy("openReleases");
            return;
        }

        if (buttonData.environment) {
            callSketchupWithBusy("switchEnvironment", buttonData.environment);
        }
    }

    function handleManualAction(actionName) {
        callSketchupWithBusy("runManualAction", actionName);
    }

    function handleModalAction(actionName) {
        if (actionName === "reload") {
            openReloadModal();
        }

        if (actionName === "dynamic-attribute") {
            openDynamicAttributeModal();
        }
    }

    function handleAdvancedAction(actionName) {
        openAdvancedModal(actionName);
    }

    function handleSubmitModal() {
        if (modalState.type === "reload") {
            callSketchupWithBusy("runReloadAction", modalForm.reloadModule, modalForm.reloadClass);
            closeActionModal();
            return;
        }

        if (modalState.type === "dynamic-attribute") {
            callSketchupWithBusy(
                "runDynamicAttributeAction",
                modalForm.dynamicAttributeName,
                modalForm.dynamicAttributeValue
            );
            closeActionModal();
            return;
        }

        if (modalState.type === "advanced") {
            if (!modalState.action) {
                window.alert("Nenhuma ação avançada foi selecionada.");
                return;
            }

            resetAdvancedResult();
            callSketchupWithBusy("runAdvancedAction", modalState.action, modalForm.advancedId);
        }
    }

    function handleModalOverlayClick(event) {
        if (event.target.id === "action-modal-overlay") {
            closeActionModal();
        }
    }

    function normalizeDynamicAttributeName(value) {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");
    }

    function updateModalField(field, value) {
        if (field === "dynamicAttributeName") {
            setModalForm((prev) => ({
                ...prev,
                [field]: normalizeDynamicAttributeName(value)
            }));
            return;
        }

        setModalForm((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <div className="devtools-app">
            <Header
                title={pageData.title}
                currentEnvironment={pageData.current_environment}
                replaceAutomatico={pageData.replace_automatico}
                darkMode={darkMode}
                onToggleDarkMode={setDarkMode}
                onToggleReplaceAutomatico={() => callSketchupWithBusy("toggleReplaceAutomatico")}
            />

            <TopNav />

            <main className="page-main">
                <EnvironmentPanel
                    sectionId="section-ambientes"
                    title="Ambientes"
                    description="Selecione o ambiente ativo do plugin."
                    currentEnvironment={pageData.current_environment}
                    environmentButtons={environmentButtons}
                    onEnvironmentAction={handleEnvironmentAction}
                />

                <EnvironmentPanel
                    sectionId="section-releases"
                    title="Releases"
                    description="Abra o seletor de releases para reinstalar versões específicas."
                    currentEnvironment={pageData.current_environment}
                    environmentButtons={releaseButtons}
                    onEnvironmentAction={handleEnvironmentAction}
                />

                <QuickActionsPanel
                    onManualAction={handleManualAction}
                />

                <AdvancedActionsPanel
                    onManualAction={handleManualAction}
                    onModalAction={handleModalAction}
                    onAdvancedAction={handleAdvancedAction}
                />

                <section id="section-comandos" className="section-card" aria-labelledby="section-comandos-title">
                    <header className="section-card__header">
                        <h2 id="section-comandos-title">Comandos recorrentes</h2>
                        <p>Referência rápida das funções mais úteis no dia a dia.</p>
                    </header>

                    <div className="command-grid">
                        <article className="command-card">
                            <h3 className="command-card__title">switch(environment)</h3>
                            <div className="command-meta">
                                <div><strong>Descrição:</strong> Troca o ambiente ativo do plugin.</div>
                                <div><strong>Finalidade:</strong> Alterar rapidamente o alvo de validação.</div>
                                <div><strong>Exemplo:</strong> switch(PROD) ou switch(HML)</div>
                                <div><strong>Contexto:</strong> Troca de ambiente</div>
                            </div>
                        </article>

                        <article className="command-card">
                            <h3 className="command-card__title">reload(modulo = "**", classe = "*")</h3>
                            <div className="command-meta">
                                <div><strong>Descrição:</strong> Recarrega arquivos Ruby dos diretórios monitorados.</div>
                                <div><strong>Finalidade:</strong> Aplicar alterações sem reinstalar o plugin.</div>
                                <div><strong>Exemplo:</strong> reload("**", "nome_do_arquivo")</div>
                                <div><strong>Contexto:</strong> Desenvolvimento</div>
                            </div>
                        </article>
                    </div>
                </section>

                <section id="section-orientacoes" className="section-card" aria-labelledby="section-orientacoes-title">
                    <header className="section-card__header">
                        <h2 id="section-orientacoes-title">Instruções de uso</h2>
                        <p>Guia resumido para novos desenvolvedores e homologadores.</p>
                    </header>

                    <div className="command-grid">
                        <article className="command-card">
                            <h3 className="command-card__title">Troca de ambiente</h3>
                            <div className="command-meta">
                                <div><strong>Descrição:</strong> A troca executa relogin e reinicialização da Home.</div>
                                <div><strong>Finalidade:</strong> Garantir atualização do contexto ativo.</div>
                                <div><strong>Exemplo:</strong> Ao clicar em HML, o plugin reloga e reinicializa a Home.</div>
                                <div><strong>Contexto:</strong> Operação</div>
                            </div>
                        </article>

                        <article className="command-card">
                            <h3 className="command-card__title">Releases</h3>
                            <div className="command-meta">
                                <div><strong>Descrição:</strong> Use a lista de .rbz para reinstalar versões específicas.</div>
                                <div><strong>Finalidade:</strong> Comparar comportamentos entre releases.</div>
                                <div><strong>Exemplo:</strong> Selecionar uma versão no modal de releases.</div>
                                <div><strong>Contexto:</strong> Versionamento</div>
                            </div>
                        </article>
                    </div>
                </section>
            </main>

            <ActionModal
                isOpen={modalState.isOpen}
                modalTitle={modalTitle}
                modalDescription={modalDescription}
                modalType={modalState.type}
                modalForm={modalForm}
                advancedResult={advancedResult}
                onClose={closeActionModal}
                onSubmit={handleSubmitModal}
                onOverlayClick={handleModalOverlayClick}
                onFieldChange={updateModalField}
            />

            <LoadingOverlay
                isOpen={busyState.isOpen}
                message={busyState.message}
            />
        </div>
    );
}

export default App;