/**
 * ============================================
 * [CALC-01] [CALC-02] [CALC-03] Calculadora Windows
 * Pink, Purple & White Edition
 * 
 * Classe principal com gerenciamento de estado,
 * operações aritméticas e tratamento de erros.
 * ============================================
 */

class Calculator {
    constructor() {
        // [CALC-02] Estado interno
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.hasError = false; // [CALC-03] Flag de erro
        this.history = '';

        // DOM Elements
        this.displayElement = document.getElementById('display');
        this.historyElement = document.getElementById('history');

        this.init();
    }

    /**
     * [CALC-01] Inicialização - Event Listeners
     */
    init() {
        const keypad = document.querySelector('.keypad');
        keypad.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            const action = btn.dataset.action;
            const value = btn.dataset.value;

            this.handleAction(action, value);
        });

        // Suporte a teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * [CALC-02] Roteador de ações
     */
    handleAction(action, value) {
        // [CALC-03] Bloqueio em estado de erro
        if (this.hasError && action !== 'clear' && action !== 'clear-entry') {
            return; // Nenhuma ação permitida até C ou CE
        }

        switch (action) {
            case 'number':
                this.inputNumber(value);
                break;
            case 'operator':
                this.inputOperator(value);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'clear':
                this.clear();
                break;
            case 'clear-entry':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'percent':
                this.percent();
                break;
            case 'inverse':
                this.inverse();
                break;
            case 'square':
                this.square();
                break;
            case 'sqrt':
                this.squareRoot();
                break;
        }
    }

    /**
     * [CALC-02] Entrada de números
     */
    inputNumber(value) {
        if (this.shouldResetDisplay) {
            this.currentValue = value;
            this.shouldResetDisplay = false;
        } else {
            // Limita tamanho do display
            if (this.currentValue.length >= 16) return;
            this.currentValue = this.currentValue === '0' ? value : this.currentValue + value;
        }
        this.updateDisplay();
    }

    /**
     * [CALC-02] [BUG-01] Entrada de decimal (vírgula)
     * Impede múltiplas vírgulas no mesmo número
     */
    inputDecimal() {
        // [BUG-01] Validação: impedir vírgula duplicada
        if (this.currentValue.includes(',')) return;

        if (this.shouldResetDisplay) {
            this.currentValue = '0,';
            this.shouldResetDisplay = false;
        } else {
            this.currentValue += ',';
        }
        this.updateDisplay();
    }

    /**
     * [CALC-02] Seleção de operador
     */
    inputOperator(op) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operator = op;
        this.shouldResetDisplay = true;
        this.history = `${this.formatDisplay(this.previousValue)} ${op}`;
        this.updateHistory();
    }

    /**
     * [CALC-02] [CALC-03] Execução do cálculo
     */
    calculate() {
        if (!this.operator || !this.previousValue) return;

        const prev = this.parseNumber(this.previousValue);
        const current = this.parseNumber(this.currentValue);
        let result;

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                // [CALC-03] Tratamento de divisão por zero
                if (current === 0) {
                    this.setError();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Atualiza histórico com expressão completa
        this.history = `${this.formatDisplay(this.previousValue)} ${this.operator} ${this.formatDisplay(this.currentValue)} =`;
        this.updateHistory();

        // Formata resultado
        this.currentValue = this.formatResult(result);
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    /**
     * [CALC-03] Definir estado de erro
     */
    setError() {
        this.hasError = true;
        this.currentValue = 'Erro';
        this.history = 'Divisão por zero não permitida';
        this.displayElement.classList.add('error');
        this.updateDisplay();
        this.updateHistory();
    }

    /**
     * [CALC-02] Limpar tudo (C)
     */
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = '';
        this.hasError = false; // [CALC-03] Reset de erro
        this.displayElement.classList.remove('error');
        this.updateDisplay();
        this.updateHistory();
    }

    /**
     * [CALC-02] Limpar entrada atual (CE)
     */
    clearEntry() {
        if (this.hasError) {
            this.clear(); // [CALC-03] CE também reseta erro
            return;
        }
        this.currentValue = '0';
        this.updateDisplay();
    }

    /**
     * [CALC-02] Backspace
     */
    backspace() {
        if (this.currentValue.length === 1 || 
            (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
            this.currentValue = '0';
        } else {
            this.currentValue = this.currentValue.slice(0, -1);
        }
        this.updateDisplay();
    }

    /**
     * [HOTFIX-01] Inversão de sinal (±)
     */
    toggleSign() {
        if (this.currentValue === '0') return;

        if (this.currentValue.startsWith('-')) {
            this.currentValue = this.currentValue.substring(1);
        } else {
            this.currentValue = '-' + this.currentValue;
        }
        this.updateDisplay();
    }

    /**
     * [CALC-02] Percentual
     */
    percent() {
        const value = this.parseNumber(this.currentValue);
        if (this.previousValue && this.operator) {
            const base = this.parseNumber(this.previousValue);
            this.currentValue = this.formatResult(base * (value / 100));
        } else {
            this.currentValue = this.formatResult(value / 100);
        }
        this.updateDisplay();
    }

    /**
     * [CALC-02] Inverso (1/x)
     */
    inverse() {
        const value = this.parseNumber(this.currentValue);
        if (value === 0) {
            this.setError(); // [CALC-03]
            return;
        }
        this.history = `1/(${this.formatDisplay(this.currentValue)})`;
        this.currentValue = this.formatResult(1 / value);
        this.shouldResetDisplay = true;
        this.updateDisplay();
        this.updateHistory();
    }

    /**
     * [CALC-02] Quadrado (x²)
     */
    square() {
        const value = this.parseNumber(this.currentValue);
        this.history = `sqr(${this.formatDisplay(this.currentValue)})`;
        this.currentValue = this.formatResult(value * value);
        this.shouldResetDisplay = true;
        this.updateDisplay();
        this.updateHistory();
    }

    /**
     * [CALC-02] Raiz quadrada (√x)
     */
    squareRoot() {
        const value = this.parseNumber(this.currentValue);
        if (value < 0) {
            this.setError(); // [CALC-03] Raiz de negativo
            return;
        }
        this.history = `√(${this.formatDisplay(this.currentValue)})`;
        this.currentValue = this.formatResult(Math.sqrt(value));
        this.shouldResetDisplay = true;
        this.updateDisplay();
        this.updateHistory();
    }

    // ============================================
    // Utilitários
    // ============================================

    /**
     * Converte string com vírgula para número
     */
    parseNumber(str) {
        return parseFloat(str.replace(',', '.'));
    }

    /**
     * Formata resultado numérico para display
     */
    formatResult(num) {
        if (!isFinite(num)) return 'Erro';
        
        // Limita casas decimais
        let result = parseFloat(num.toPrecision(12)).toString();
        
        // Converte ponto para vírgula (padrão brasileiro)
        result = result.replace('.', ',');
        
        return result;
    }

    /**
     * Formata valor para exibição
     */
    formatDisplay(value) {
        return value;
    }

    /**
     * [CALC-01] Atualiza display principal
     */
    updateDisplay() {
        this.displayElement.textContent = this.currentValue;
    }

    /**
     * [CALC-02] Atualiza histórico
     */
    updateHistory() {
        this.historyElement.textContent = this.history;
    }

    /**
     * Suporte a teclado
     */
    handleKeyboard(e) {
        const key = e.key;

        if (key >= '0' && key <= '9') {
            this.handleAction('number', key);
        } else if (key === '+') {
            this.handleAction('operator', '+');
        } else if (key === '-') {
            this.handleAction('operator', '-');
        } else if (key === '*') {
            this.handleAction('operator', '×');
        } else if (key === '/') {
            e.preventDefault();
            this.handleAction('operator', '÷');
        } else if (key === 'Enter' || key === '=') {
            this.handleAction('equals');
        } else if (key === '.' || key === ',') {
            this.handleAction('decimal');
        } else if (key === 'Backspace') {
            this.handleAction('backspace');
        } else if (key === 'Escape') {
            this.handleAction('clear');
        } else if (key === 'Delete') {
            this.handleAction('clear-entry');
        }
    }
}

// Inicializa a calculadora quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
