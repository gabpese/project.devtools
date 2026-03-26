import React from "react";

function TopNav() {
    return (
        <nav className="page-nav" aria-label="Navegação interna">
            <a href="#section-ambientes">Ambientes</a>
            <a href="#section-releases">Releases</a>
            <a href="#section-acoes-rapidas">Ações rápidas</a>
            <a href="#section-acoes-avancadas">Ações avançadas</a>
            <a href="#section-comandos">Comandos recorrentes</a>
        </nav>
    );
}

export default TopNav;