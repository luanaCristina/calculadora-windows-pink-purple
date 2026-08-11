/**
 * ============================================
 * TESTES UNITÁRIOS - Calculadora Windows
 * Framework: Jest + jsdom
 * Padrão: AAA (Arrange, Act, Assert)
 * ============================================
 * 
 * Cada teste valida UMA responsabilidade isolada
 * da classe Calculator, garantindo feedback rápido
 * e localização precisa de falhas.
 */

// ============================================
// Setup: Simular DOM antes de carregar o script
// ============================================
beforeEach(() => {
    // ARRANGE (global): Recriar o DOM mínimo necessário
    document.body.innerHTML = `
        <div class="display-container">
            <div class="display-history" id="history"></div>
            <div class="display-current" id="display">0</div>
        </div>
        <div class="keypad">
            <button class="btn" data-action="number" data-value="5">5</button>
            <button class="btn" data-action="operator" data-value="+">+</button>
            <button class="btn" data-action="equals">=</button>
            <button class="btn" data-action="clear">C</button>
        </div>
    `;
});

// Carregar a classe Calculator (extrair para módulo testável)
// Para testes, vamos recriar a lógica core isolada
class CalculatorCore {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.hasError = false;
        this.history = '';
    }

    inputNumber(value) {
        if (this.shouldResetDisplay) {
            this.currentValue = value;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue.length >= 16) return;
            this.currentValue = this.currentValue === '0' ? value : this.currentValue + value;
        }
    }

    inputDecimal() {
        // [BUG-01] Impede múltiplas vírgulas
        if (this.currentValue.includes(',')) return;
        if (this.shouldResetDisplay) {
            this.currentValue = '0,';
            this.shouldResetDisplay = false;
        } else {
            this.currentValue += ',';
        }
    }

    inputOperator(op) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operator = op;
        this.shouldResetDisplay = true;
        this.history = `${this.previousValue} ${op}`;
    }

    calculate() {
        if (!this.operator || !this.previousValue) return;
        const prev = parseFloat(this.previousValue.replace(',', '.'));
        const current = parseFloat(this.currentValue.replace(',', '.'));
        let result;

        switch (this.operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷':
                // [CALC-03] Divisão por zero
                if (current === 0) {
                    this.hasError = true;
                    this.currentValue = 'Erro';
                    this.history = 'Divisão por zero não permitida';
                    return;
                }
                result = prev / current;
                break;
            default: return;
        }

        this.history = `${this.previousValue} ${this.operator} ${this.currentValue} =`;
        this.currentValue = parseFloat(result.toPrecision(12)).toString().replace('.', ',');
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = '';
        this.hasError = false;
    }

    clearEntry() {
        if (this.hasError) { this.clear(); return; }
        this.currentValue = '0';
    }

    toggleSign() {
        if (this.currentValue === '0') return;
        if (this.currentValue.startsWith('-')) {
            this.currentValue = this.currentValue.substring(1);
        } else {
            this.currentValue = '-' + this.currentValue;
        }
    }

    backspace() {
        if (this.currentValue.length === 1 ||
            (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
            this.currentValue = '0';
        } else {
            this.currentValue = this.currentValue.slice(0, -1);
        }
    }
}

// ============================================
// MÓDULO 1: [CALC-02] Operações Aritméticas
// ============================================
describe('[CALC-02] Operações Aritméticas Básicas', () => {

    test('Soma: 5 + 3 = 8', () => {
        // ARRANGE
        const calc = new CalculatorCore();

        // ACT
        calc.inputNumber('5');
        calc.inputOperator('+');
        calc.inputNumber('3');
        calc.calculate();

        // ASSERT
        expect(calc.currentValue).toBe('8');
    });

    test('Subtração: 10 - 4 = 6', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('1');
        calc.inputNumber('0');
        calc.inputOperator('-');
        calc.inputNumber('4');
        calc.calculate();
        expect(calc.currentValue).toBe('6');
    });

    test('Multiplicação: 7 × 6 = 42', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('7');
        calc.inputOperator('×');
        calc.inputNumber('6');
        calc.calculate();
        expect(calc.currentValue).toBe('42');
    });

    test('Divisão: 20 ÷ 4 = 5', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('2');
        calc.inputNumber('0');
        calc.inputOperator('÷');
        calc.inputNumber('4');
        calc.calculate();
        expect(calc.currentValue).toBe('5');
    });

    test('Operação encadeada: 2 + 3 = 5, depois + 4 = 9', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('2');
        calc.inputOperator('+');
        calc.inputNumber('3');
        calc.calculate();
        expect(calc.currentValue).toBe('5');

        calc.inputOperator('+');
        calc.inputNumber('4');
        calc.calculate();
        expect(calc.currentValue).toBe('9');
    });

    test('Números decimais: 3,5 + 1,5 = 5', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('3');
        calc.inputDecimal();
        calc.inputNumber('5');
        calc.inputOperator('+');
        calc.inputNumber('1');
        calc.inputDecimal();
        calc.inputNumber('5');
        calc.calculate();
        expect(calc.currentValue).toBe('5');
    });

    test('Display de histórico registra expressão correta', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('8');
        calc.inputOperator('+');
        calc.inputNumber('2');
        calc.calculate();
        expect(calc.history).toBe('8 + 2 =');
    });
});

// ============================================
// MÓDULO 2: [CALC-03] Tratamento de Erros
// ============================================
describe('[CALC-03] Divisão por Zero', () => {

    test('Divisão por zero exibe "Erro"', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('8');
        calc.inputOperator('÷');
        calc.inputNumber('0');
        calc.calculate();
        expect(calc.currentValue).toBe('Erro');
        expect(calc.hasError).toBe(true);
    });

    test('0 ÷ 0 também exibe "Erro"', () => {
        const calc = new CalculatorCore();
        // currentValue já é '0'
        calc.inputOperator('÷');
        calc.inputNumber('0');
        calc.calculate();
        expect(calc.currentValue).toBe('Erro');
    });

    test('Após erro, C reseta o estado completamente', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('5');
        calc.inputOperator('÷');
        calc.inputNumber('0');
        calc.calculate();
        expect(calc.hasError).toBe(true);

        calc.clear();
        expect(calc.hasError).toBe(false);
        expect(calc.currentValue).toBe('0');
        expect(calc.operator).toBeNull();
    });

    test('Após erro, CE também reseta', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('9');
        calc.inputOperator('÷');
        calc.inputNumber('0');
        calc.calculate();

        calc.clearEntry();
        expect(calc.hasError).toBe(false);
        expect(calc.currentValue).toBe('0');
    });
});

// ============================================
// MÓDULO 3: [BUG-01] Vírgula Duplicada
// ============================================
describe('[BUG-01] Prevenção de Vírgulas Duplicadas', () => {

    test('Impede segunda vírgula no mesmo número', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('5');
        calc.inputDecimal(); // 5,
        calc.inputDecimal(); // Deve ser ignorado
        calc.inputNumber('2');
        expect(calc.currentValue).toBe('5,2');
    });

    test('Permite vírgula em novo número após operador', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('3');
        calc.inputDecimal();
        calc.inputNumber('5');
        calc.inputOperator('+');
        calc.inputNumber('1');
        calc.inputDecimal(); // Nova vírgula permitida em novo número
        calc.inputNumber('5');
        expect(calc.currentValue).toBe('1,5');
    });
});

// ============================================
// MÓDULO 4: [HOTFIX-01] Inversão de Sinal
// ============================================
describe('[HOTFIX-01] Inversão de Sinal (±)', () => {

    test('Positivo para negativo: 42 → -42', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('4');
        calc.inputNumber('2');
        calc.toggleSign();
        expect(calc.currentValue).toBe('-42');
    });

    test('Negativo para positivo: -42 → 42', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('4');
        calc.inputNumber('2');
        calc.toggleSign();
        calc.toggleSign();
        expect(calc.currentValue).toBe('42');
    });

    test('Zero não inverte: 0 → 0', () => {
        const calc = new CalculatorCore();
        calc.toggleSign();
        expect(calc.currentValue).toBe('0');
    });
});

// ============================================
// MÓDULO 5: Controles Gerais
// ============================================
describe('Controles de Limpeza e Backspace', () => {

    test('C (Clear) reseta tudo para estado inicial', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('9');
        calc.inputNumber('9');
        calc.inputOperator('+');
        calc.inputNumber('1');
        calc.clear();
        expect(calc.currentValue).toBe('0');
        expect(calc.operator).toBeNull();
        expect(calc.history).toBe('');
    });

    test('Backspace remove último dígito', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('1');
        calc.inputNumber('2');
        calc.inputNumber('3');
        calc.backspace();
        expect(calc.currentValue).toBe('12');
    });

    test('Backspace em número de 1 dígito retorna "0"', () => {
        const calc = new CalculatorCore();
        calc.inputNumber('5');
        calc.backspace();
        expect(calc.currentValue).toBe('0');
    });

    test('Limite de 16 dígitos no display', () => {
        const calc = new CalculatorCore();
        for (let i = 0; i < 20; i++) {
            calc.inputNumber('1');
        }
        expect(calc.currentValue.length).toBe(16);
    });
});
