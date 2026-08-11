# 🧮 Calculadora Windows — Pink, Purple & White Edition

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=for-the-badge&logo=github)

### 🌐 [▶️ ABRIR CALCULADORA (Live Demo)](https://luanacristina.github.io/calculadora-windows-pink-purple/)

---

## 📋 Sobre o Projeto

Calculadora web inspirada na interface do **Windows Calculator**, com paleta de cores exclusiva em **Rosa**, **Purple** e **Branco**. Desenvolvida com HTML5, CSS3 e JavaScript puro (sem frameworks).

---

## 🎨 Paleta de Cores

| Cor | Hex | Preview | Uso |
|-----|-----|---------|-----|
| Rosa Claro | `#ffc6ff` | ![#ffc6ff](https://via.placeholder.com/20/ffc6ff/ffc6ff) | Botões numéricos |
| Rosa Intenso | `#ff85a2` | ![#ff85a2](https://via.placeholder.com/20/ff85a2/ff85a2) | Botão `=`, hover |
| Purple Escuro | `#240046` | ![#240046](https://via.placeholder.com/20/240046/240046) | Fundo principal |
| Purple Médio | `#7b2cbf` | ![#7b2cbf](https://via.placeholder.com/20/7b2cbf/7b2cbf) | Botões de operação |
| Branco | `#ffffff` | ![#ffffff](https://via.placeholder.com/20/ffffff/ffffff) | Textos, display |

---

## 🚀 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/luanacrystinne/calculadora-windows-pink-purple.git

# Acesse a pasta
cd calculadora-windows-pink-purple

# Abra no navegador (opção 1: direto)
open index.html

# Abra no navegador (opção 2: com Live Server)
# Instale a extensão Live Server no VS Code e clique em "Go Live"
```

---

## 🏗️ Estrutura do Projeto

```
calculadora-windows-pink-purple/
├── index.html          # Estrutura semântica da janela Windows
├── style.css           # Estilização completa (Flexbox/Grid + animações)
├── script.js           # Classe Calculator com regras de negócio
└── README.md           # Documentação do projeto
```

---

## ✅ Funcionalidades

- [x] Interface estilo Windows com barra de título e controles
- [x] Operações básicas: `+`, `-`, `×`, `÷`
- [x] Display de histórico da expressão
- [x] Suporte a números decimais (vírgula)
- [x] Tratamento de divisão por zero com mensagem `"Erro"`
- [x] Inversão de sinal (`±`)
- [x] Percentual (`%`), inverso (`1/x`), quadrado (`x²`), raiz (`√x`)
- [x] Suporte a teclado físico
- [x] Design responsivo
- [x] Efeitos hover/active com transições suaves

---

## 📌 Board Jira & Documentação

| Recurso | Link |
|---------|------|
| 📋 Confluence - Especificação | [Página de Requisitos](https://luanacroft.atlassian.net/wiki/spaces/~603fe4f320122b0068858aa6/pages/22183938) |
| 📊 Jira Board | [Projeto CROF](https://luanacroft.atlassian.net/jira/software/projects/CROF/boards) |

### Cards do Jira

| ID | Tipo | Título |
|----|------|--------|
| CROF-1 | Story | [CALC-01] Interface Visual Windows em Rosa e Purple |
| CROF-2 | Story | [CALC-02] Operações Aritméticas Básicas |
| CROF-3 | Story | [CALC-03] Tratamento de Erros de Divisão por Zero |
| CROF-4 | Bug | [BUG-01] Múltiplas vírgulas no mesmo número |
| CROF-5 | Bug | [HOTFIX-01] Inversão de sinal em números negativos |

---

## 🌳 Estratégia de Branches

```
main ──────────────────────────────────── (produção)
  │
  ├── develop ─────────────────────────── (integração)
  │     │
  │     ├── feature/CALC-01-interface-visual
  │     ├── feature/CALC-02-operacoes-basicas
  │     └── bugfix/BUG-01-multiplas-virgulas
  │
  └── hotfix/CALC-05-inversao-sinal ───── (fix emergencial)
```

---

## 🛠️ Tecnologias & Metodologia

- **Frontend:** HTML5 + CSS3 (Grid/Flexbox) + JavaScript ES6+
- **Metodologia:** Scrum (Sprints de 1 semana)
- **Versionamento:** Git Flow (main, develop, feature/*, bugfix/*, hotfix/*)
- **CI/CD:** Lint → Testes → Build → Deploy

---

## 👩‍💻 Autora

**Luana Crystinne** — QA Engineer & Full-Stack Developer

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
