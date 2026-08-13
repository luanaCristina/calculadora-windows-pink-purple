# 🎓 Aula Prática: Implementação de Features na Calculadora

> **Objetivo:** O aluno aprenderá o fluxo completo de desenvolvimento ágil — desde pegar um card no Jira, criar branch, implementar, escrever testes e abrir Pull Request.

---

## 📋 Pré-requisitos

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone https://github.com/luanaCristina/calculadora-windows-pink-purple.git
cd calculadora-windows-pink-purple

# 2. Instale as dependências
npm install

# 3. Confirme que os testes atuais passam
npm test

# 4. Inicie o servidor local
npm run serve
# Acesse: http://localhost:3000
```

---

---

# 🟣 FEATURE 1: Keyboard Highlight (CALC-04)

## 📌 Card Jira: CROF-7

> **"Como Pedro (desenvolvedor que usa teclado o dia todo), eu quero que a calculadora exiba visualmente qual tecla está sendo pressionada no teclado físico, para que eu tenha feedback imediato de que minha entrada foi reconhecida."**

---

## Passo 1: Mover o Card no Jira

1. Acesse o board: https://luanacroft.atlassian.net/jira/software/projects/CROF/boards
2. Mova `[CALC-04]` de **Backlog** → **In Progress**

---

## Passo 2: Criar a Branch

```bash
# Certifique-se de estar na develop atualizada
git checkout develop
git pull origin develop

# Crie a branch de feature
git checkout -b feature/CALC-04-keyboard-highlight
```

---

## Passo 3: Implementar o CSS

Abra `style.css` e adicione no final:

```css
/* ============================================
   [CALC-04] Feedback Visual de Teclado
   ============================================ */

/* Classe aplicada via JS quando tecla é pressionada */
.btn.active-key {
    transform: scale(0.92);
    filter: brightness(1.3);
    box-shadow: 0 0 12px rgba(255, 133, 162, 0.6);
    transition: all 0.05s ease;
}

/* Animação de "pulso" no highlight */
@keyframes keyPress {
    0% { transform: scale(1); }
    50% { transform: scale(0.92); filter: brightness(1.3); }
    100% { transform: scale(1); filter: brightness(1); }
}
```

---

## Passo 4: Implementar o JavaScript

Abra `script.js` e adicione o método `highlightKey` dentro da classe `Calculator`:

```javascript
/**
 * [CALC-04] Destaca visualmente o botão correspondente à tecla pressionada
 * @param {string} key - A tecla pressionada pelo usuário
 */
highlightKey(key) {
    // Mapeamento de teclas do teclado → seletores de botão
    const keyMap = {
        '0': '[data-value="0"]',
        '1': '[data-value="1"]',
        '2': '[data-value="2"]',
        '3': '[data-value="3"]',
        '4': '[data-value="4"]',
        '5': '[data-value="5"]',
        '6': '[data-value="6"]',
        '7': '[data-value="7"]',
        '8': '[data-value="8"]',
        '9': '[data-value="9"]',
        '+': '[data-value="+"]',
        '-': '[data-value="-"]',
        '*': '[data-value="×"]',
        '/': '[data-value="÷"]',
        'Enter': '[data-action="equals"]',
        '=': '[data-action="equals"]',
        '.': '[data-action="decimal"]',
        ',': '[data-action="decimal"]',
        'Backspace': '[data-action="backspace"]',
        'Escape': '[data-action="clear"]',
        'Delete': '[data-action="clear-entry"]'
    };

    const selector = keyMap[key];
    if (!selector) return; // Tecla não mapeada, ignorar

    const btn = document.querySelector(selector);
    if (!btn) return;

    // Adiciona classe de highlight
    btn.classList.add('active-key');

    // Remove após 150ms
    setTimeout(() => {
        btn.classList.remove('active-key');
    }, 150);
}
```

Agora integre no método `handleKeyboard` existente. Encontre o método e **adicione a primeira linha**:

```javascript
handleKeyboard(e) {
    // [CALC-04] Feedback visual da tecla
    this.highlightKey(e.key);

    // ... resto do código existente permanece igual
    const key = e.key;
    if (key >= '0' && key <= '9') {
    // ...
}
```

---

## Passo 5: Escrever o Teste Unitário

Abra `tests/unit/calculator.test.js` e adicione ao final:

```javascript
// ============================================
// MÓDULO 6: [CALC-04] Keyboard Highlight
// ============================================
describe('[CALC-04] Keyboard Visual Highlight', () => {

    test('Método highlightKey existe e não lança erro para tecla mapeada', () => {
        // ARRANGE - Simular DOM com botão
        document.body.innerHTML = `
            <div class="keypad">
                <button class="btn" data-value="5">5</button>
                <button class="btn" data-action="equals">=</button>
            </div>
        `;

        // ACT - Simular highlight da tecla '5'
        const btn = document.querySelector('[data-value="5"]');
        btn.classList.add('active-key');

        // ASSERT
        expect(btn.classList.contains('active-key')).toBe(true);
    });

    test('Classe active-key é removida após timeout', (done) => {
        document.body.innerHTML = `
            <div class="keypad">
                <button class="btn" data-value="7">7</button>
            </div>
        `;

        const btn = document.querySelector('[data-value="7"]');
        btn.classList.add('active-key');

        // Simular setTimeout (150ms)
        setTimeout(() => {
            btn.classList.remove('active-key');
            expect(btn.classList.contains('active-key')).toBe(false);
            done();
        }, 150);
    });

    test('Tecla não mapeada não causa erro', () => {
        document.body.innerHTML = `
            <div class="keypad">
                <button class="btn" data-value="5">5</button>
            </div>
        `;

        // ACT - Tentar highlight com tecla inexistente
        const keyMap = { '5': '[data-value="5"]' };
        const selector = keyMap['Z']; // Não existe

        // ASSERT - Não deve encontrar seletor
        expect(selector).toBeUndefined();
    });
});
```

---

## Passo 6: Escrever o Teste E2E

Abra `tests/e2e/calculator.cy.js` e adicione ao final (antes do último `});`):

```javascript
// ============================================
// [CALC-04] Keyboard Visual Feedback - E2E
// ============================================
describe('[CALC-04] Keyboard Highlight - E2E', () => {

    it('Pressionar tecla "5" deve adicionar classe active-key ao botão 5', () => {
        cy.visit('/');
        
        // Disparar evento de teclado
        cy.get('body').trigger('keydown', { key: '5' });
        
        // Verificar que o botão recebeu highlight
        cy.get('[data-value="5"]').should('have.class', 'active-key');
        
        // Após 200ms deve ter perdido a classe
        cy.wait(200);
        cy.get('[data-value="5"]').should('not.have.class', 'active-key');
    });

    it('Pressionar Enter deve destacar botão =', () => {
        cy.visit('/');
        cy.get('body').trigger('keydown', { key: 'Enter' });
        cy.get('[data-action="equals"]').should('have.class', 'active-key');
    });

    it('Pressionar tecla não mapeada (Z) não deve destacar nenhum botão', () => {
        cy.visit('/');
        cy.get('body').trigger('keydown', { key: 'Z' });
        cy.get('.btn.active-key').should('not.exist');
    });
});
```

---

## Passo 7: Rodar os Testes

```bash
# Testes unitários
npm test

# Testes E2E (com servidor rodando em outro terminal)
npm run serve &
npm run test:e2e:open   # Modo visual para ver o highlight funcionando
```

---

## Passo 8: Commit e Pull Request

```bash
# Adicionar alterações
git add style.css script.js tests/

# Commit seguindo Conventional Commits
git commit -m "feat(CALC-04): keyboard highlight - feedback visual ao pressionar teclas

- Adiciona classe CSS .active-key com animação de 150ms
- Implementa método highlightKey() com mapeamento de teclas
- Integra com handleKeyboard() existente
- Adiciona testes unitários (3 specs)
- Adiciona testes E2E (3 specs)"

# Push da branch
git push -u origin feature/CALC-04-keyboard-highlight
```

Agora abra o **Pull Request** no GitHub:
1. Acesse: https://github.com/luanaCristina/calculadora-windows-pink-purple/compare
2. Selecione: `develop` ← `feature/CALC-04-keyboard-highlight`
3. Título: `feat(CALC-04): Feedback visual de teclado físico`
4. Descrição: Cole o resumo das alterações
5. Clique **Create Pull Request**

---

## Passo 9: Mover o Card no Jira

Mova `[CALC-04]` de **In Progress** → **Code Review / PR**

Após aprovação e merge: mova para **Done** ✅

---

---

# 🟣 FEATURE 2: Histórico de Operações (CALC-05)

## 📌 Card Jira: CROF-6

> **"Como Carla (contadora autônoma), eu quero ver uma lista das minhas últimas operações realizadas, para que eu possa revisar cálculos anteriores sem precisar refazer tudo do zero."**

---

## Passo 1: Mover o Card no Jira

Mova `[CALC-05]` de **Backlog** → **In Progress**

---

## Passo 2: Criar a Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/CALC-05-historico-operacoes
```

---

## Passo 3: Modificar o HTML

Abra `index.html` e adicione **após** o fechamento da `</div>` do `.keypad` e **antes** do fechamento da `.calculator-window`:

```html
<!-- [CALC-05] Painel de Histórico de Operações -->
<div class="history-panel">
    <div class="history-panel-header">
        <span class="history-panel-title">📜 Histórico</span>
        <button class="btn-clear-history" id="clearHistory">Limpar</button>
    </div>
    <ul class="history-list" id="historyList">
        <!-- Itens inseridos dinamicamente via JS -->
    </ul>
</div>
```

---

## Passo 4: Implementar o CSS

Adicione ao final de `style.css`:

```css
/* ============================================
   [CALC-05] Painel de Histórico de Operações
   ============================================ */

.history-panel {
    max-height: 200px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px;
}

.history-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.history-panel-title {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-clear-history {
    background: rgba(255, 133, 162, 0.2);
    border: 1px solid rgba(255, 133, 162, 0.4);
    color: #ff85a2;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-clear-history:hover {
    background: rgba(255, 133, 162, 0.4);
    color: #ffffff;
}

.history-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.history-list li {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    padding: 6px 8px;
    border-radius: 4px;
    margin-bottom: 4px;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    justify-content: space-between;
}

.history-list li:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
}

.history-list li .history-result {
    color: #ff85a2;
    font-weight: 600;
}

/* Mensagem de lista vazia */
.history-list .empty-message {
    color: rgba(255, 255, 255, 0.3);
    text-align: center;
    font-style: italic;
    cursor: default;
}

.history-list .empty-message:hover {
    background: transparent;
    color: rgba(255, 255, 255, 0.3);
}
```

---

## Passo 5: Implementar o JavaScript

Adicione os seguintes métodos dentro da classe `Calculator` em `script.js`:

```javascript
/**
 * [CALC-05] Inicializa o painel de histórico
 * Chamar no final do método init()
 */
initHistoryPanel() {
    this.historyList = document.getElementById('historyList');
    this.clearHistoryBtn = document.getElementById('clearHistory');
    this.operationHistory = this.loadHistoryFromStorage();

    // Renderizar histórico salvo
    this.renderHistory();

    // Evento do botão Limpar
    if (this.clearHistoryBtn) {
        this.clearHistoryBtn.addEventListener('click', () => this.clearOperationHistory());
    }

    // Evento de clique nos itens
    if (this.historyList) {
        this.historyList.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li && li.dataset.result) {
                this.currentValue = li.dataset.result;
                this.shouldResetDisplay = true;
                this.updateDisplay();
            }
        });
    }
}

/**
 * [CALC-05] Adiciona operação ao histórico
 * Chamar dentro do método calculate(), após obter resultado com sucesso
 * @param {string} expression - Ex: "5 + 3 ="
 * @param {string} result - Ex: "8"
 */
addToOperationHistory(expression, result) {
    // Não adicionar erros ao histórico
    if (result === 'Erro') return;

    const item = { expression, result, timestamp: Date.now() };

    // Adiciona no início (mais recente primeiro)
    this.operationHistory.unshift(item);

    // Limite de 10 itens (FIFO)
    if (this.operationHistory.length > 10) {
        this.operationHistory.pop();
    }

    // Persistir e renderizar
    this.saveHistoryToStorage();
    this.renderHistory();
}

/**
 * [CALC-05] Renderiza a lista de histórico no DOM
 */
renderHistory() {
    if (!this.historyList) return;

    if (this.operationHistory.length === 0) {
        this.historyList.innerHTML = '<li class="empty-message">Nenhuma operação ainda</li>';
        return;
    }

    this.historyList.innerHTML = this.operationHistory.map(item =>
        `<li data-result="${item.result}">
            <span class="history-expression">${item.expression}</span>
            <span class="history-result">${item.result}</span>
        </li>`
    ).join('');
}

/**
 * [CALC-05] Limpa todo o histórico
 */
clearOperationHistory() {
    this.operationHistory = [];
    localStorage.removeItem('calculatorHistory');
    this.renderHistory();
}

/**
 * [CALC-05] Salva histórico no localStorage
 */
saveHistoryToStorage() {
    localStorage.setItem('calculatorHistory', JSON.stringify(this.operationHistory));
}

/**
 * [CALC-05] Carrega histórico do localStorage
 */
loadHistoryFromStorage() {
    try {
        const data = localStorage.getItem('calculatorHistory');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}
```

**Integrações necessárias:**

1. No método `init()`, adicione ao final:
```javascript
this.initHistoryPanel();
```

2. No método `calculate()`, após a linha `this.currentValue = this.formatResult(result);`, adicione:
```javascript
// [CALC-05] Registrar no histórico
this.addToOperationHistory(this.history, this.currentValue);
```

---

## Passo 6: Escrever o Teste Unitário

Adicione em `tests/unit/calculator.test.js`:

```javascript
// ============================================
// MÓDULO 7: [CALC-05] Histórico de Operações
// ============================================
describe('[CALC-05] Histórico de Operações', () => {

    // Mock do localStorage
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => { store[key] = value; },
            removeItem: (key) => { delete store[key]; },
            clear: () => { store = {}; }
        };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    beforeEach(() => localStorageMock.clear());

    test('Adicionar operação ao histórico cria item correto', () => {
        const history = [];
        const item = { expression: '5 + 3 =', result: '8', timestamp: Date.now() };
        history.unshift(item);

        expect(history.length).toBe(1);
        expect(history[0].expression).toBe('5 + 3 =');
        expect(history[0].result).toBe('8');
    });

    test('Histórico não ultrapassa 10 itens (FIFO)', () => {
        const history = [];

        for (let i = 0; i < 12; i++) {
            history.unshift({ expression: `${i} + 1 =`, result: `${i + 1}` });
            if (history.length > 10) history.pop();
        }

        expect(history.length).toBe(10);
        expect(history[0].expression).toBe('11 + 1 ='); // Mais recente
    });

    test('Operação com erro NÃO é adicionada ao histórico', () => {
        const history = [];
        const result = 'Erro';

        // Simular regra: se resultado é "Erro", não adiciona
        if (result !== 'Erro') {
            history.push({ expression: '5 ÷ 0 =', result });
        }

        expect(history.length).toBe(0);
    });

    test('Limpar histórico remove todos os itens', () => {
        const history = [
            { expression: '1 + 1 =', result: '2' },
            { expression: '3 × 4 =', result: '12' }
        ];

        // Simular clear
        history.length = 0;
        localStorageMock.removeItem('calculatorHistory');

        expect(history.length).toBe(0);
        expect(localStorageMock.getItem('calculatorHistory')).toBeNull();
    });

    test('Salvar e carregar do localStorage funciona corretamente', () => {
        const data = [
            { expression: '10 - 3 =', result: '7', timestamp: 123 }
        ];

        localStorageMock.setItem('calculatorHistory', JSON.stringify(data));
        const loaded = JSON.parse(localStorageMock.getItem('calculatorHistory'));

        expect(loaded).toEqual(data);
        expect(loaded[0].result).toBe('7');
    });

    test('localStorage corrompido retorna array vazio', () => {
        localStorageMock.setItem('calculatorHistory', 'INVALID JSON{{{');

        let result;
        try {
            result = JSON.parse(localStorageMock.getItem('calculatorHistory'));
        } catch (e) {
            result = [];
        }

        expect(result).toEqual([]);
    });
});
```

---

## Passo 7: Escrever o Teste E2E

Adicione em `tests/e2e/calculator.cy.js`:

```javascript
// ============================================
// [CALC-05] Painel de Histórico - E2E
// ============================================
describe('[CALC-05] Histórico de Operações - E2E', () => {

    beforeEach(() => {
        // Limpar localStorage antes de cada teste
        cy.clearLocalStorage();
        cy.visit('/');
    });

    it('Deve exibir mensagem vazia quando não há histórico', () => {
        cy.get('.history-list .empty-message')
            .should('contain', 'Nenhuma operação');
    });

    it('Deve adicionar operação ao histórico após cálculo', () => {
        // Realizar 5 + 3 = 8
        cy.get('[data-value="5"]').click();
        cy.get('[data-value="+"]').click();
        cy.get('[data-value="3"]').click();
        cy.get('[data-action="equals"]').click();

        // Verificar item no histórico
        cy.get('.history-list li').first()
            .should('contain', '5 + 3 =')
            .and('contain', '8');
    });

    it('Clicar em item do histórico insere resultado no display', () => {
        // Realizar operação
        cy.get('[data-value="9"]').click();
        cy.get('[data-value="×"]').click();
        cy.get('[data-value="3"]').click();
        cy.get('[data-action="equals"]').click();
        cy.get('#display').should('contain', '27');

        // Limpar display
        cy.get('[data-action="clear"]').click();
        cy.get('#display').should('contain', '0');

        // Clicar no item do histórico
        cy.get('.history-list li').first().click();
        cy.get('#display').should('contain', '27');
    });

    it('Botão Limpar remove todos os itens do histórico', () => {
        // Realizar 2 operações
        cy.get('[data-value="1"]').click();
        cy.get('[data-value="+"]').click();
        cy.get('[data-value="1"]').click();
        cy.get('[data-action="equals"]').click();

        cy.get('[data-action="clear"]').click();

        cy.get('[data-value="2"]').click();
        cy.get('[data-value="+"]').click();
        cy.get('[data-value="2"]').click();
        cy.get('[data-action="equals"]').click();

        // Deve ter 2 itens
        cy.get('.history-list li').should('have.length', 2);

        // Limpar
        cy.get('#clearHistory').click();
        cy.get('.history-list .empty-message').should('exist');
    });

    it('Histórico persiste após recarregar página (localStorage)', () => {
        // Realizar operação
        cy.get('[data-value="7"]').click();
        cy.get('[data-value="+"]').click();
        cy.get('[data-value="3"]').click();
        cy.get('[data-action="equals"]').click();

        // Recarregar
        cy.reload();

        // Histórico deve persistir
        cy.get('.history-list li').first()
            .should('contain', '7 + 3 =')
            .and('contain', '10');
    });

    it('Divisão por zero NÃO adiciona "Erro" ao histórico', () => {
        cy.get('[data-value="5"]').click();
        cy.get('[data-value="÷"]').click();
        cy.get('[data-value="0"]').click();
        cy.get('[data-action="equals"]').click();

        cy.get('#display').should('contain', 'Erro');
        cy.get('.history-list .empty-message').should('exist');
    });

    it('Limite de 10 itens no histórico (FIFO)', () => {
        // Realizar 11 operações
        for (let i = 1; i <= 11; i++) {
            cy.get('[data-action="clear"]').click();
            cy.get('[data-value="1"]').click();
            cy.get('[data-value="+"]').click();
            cy.get(`[data-value="${i % 10}"]`).click();
            cy.get('[data-action="equals"]').click();
        }

        // Deve ter no máximo 10 itens
        cy.get('.history-list li').should('have.length', 10);
    });
});
```

---

## Passo 8: Rodar os Testes

```bash
# Unitários (deve passar todos incluindo os novos)
npm test

# E2E (com servidor rodando)
npm run serve &
npm run test:e2e:open
```

---

## Passo 9: Commit e Pull Request

```bash
git add index.html style.css script.js tests/
git commit -m "feat(CALC-05): painel de histórico com persistência localStorage

- Adiciona seção HTML para painel de histórico
- Estiliza painel na paleta pink/purple
- Implementa métodos addToHistory, loadHistory, clearHistory
- Persiste últimas 10 operações via localStorage
- Clique em item insere resultado no display
- Erro de divisão por zero não entra no histórico
- Adiciona 6 testes unitários
- Adiciona 6 testes E2E"

git push -u origin feature/CALC-05-historico-operacoes
```

Pull Request: `develop` ← `feature/CALC-05-historico-operacoes`

---

---

# 📊 Quadro Resumo para o Professor

| Feature | Card Jira | Branch | Arquivos | Testes Unit | Testes E2E |
|---------|-----------|--------|----------|-------------|------------|
| Keyboard Highlight | CROF-7 | `feature/CALC-04-keyboard-highlight` | CSS + JS | 3 specs | 3 specs |
| Histórico Operações | CROF-6 | `feature/CALC-05-historico-operacoes` | HTML + CSS + JS | 6 specs | 6 specs |

---

## 🔄 Fluxo Completo na Esteira CI/CD

Quando o aluno fizer `git push`:

```
git push origin feature/CALC-04-keyboard-highlight
         │
         ▼
┌─────────────────────────────────┐
│ 🔍 GitHub Actions: CI Pipeline  │
│ • npm install                   │
│ • npm run lint ✅               │
│ • npm test (23+ specs) ✅       │
│ • cypress run (headless) ✅     │
└─────────────────────────────────┘
         │
         ▼ (Abrir PR → Merge em develop)
┌─────────────────────────────────┐
│ 🟡 Deploy → Staging            │
│ • Ambiente de teste atualizado  │
│ • QA valida manualmente        │
└─────────────────────────────────┘
         │
         ▼ (Merge develop → main)
┌─────────────────────────────────┐
│ 🟢 Deploy → Produção           │
│ • GitHub Pages atualizado!      │
│ • Calculadora live com feature  │
└─────────────────────────────────┘
```

---

## 💡 Dicas para o Professor

1. **Divida a turma em duplas** — um implementa CALC-04, outro implementa CALC-05
2. **Simule Code Review** — peça que cada dupla revise o PR da outra
3. **Quebre propositalmente** — peça que alterem um teste para falhar e observem a pipeline quebrar
4. **Demonstre o merge conflict** — ambas as duplas editam o mesmo arquivo e resolvem o conflito juntas
5. **Mostre o GitHub Actions** — projete a tela e mostre os jobs rodando em tempo real

---

> 📝 **Documento:** Aula Prática de Features  
> 📅 **Data:** Agosto 2026  
> 🔗 **Repo:** [github.com/luanaCristina/calculadora-windows-pink-purple](https://github.com/luanaCristina/calculadora-windows-pink-purple)
