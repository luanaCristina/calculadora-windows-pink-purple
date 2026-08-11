/**
 * ============================================
 * TESTES END-TO-END (E2E) - Calculadora Windows
 * Framework: Cypress
 * 
 * Valida a jornada completa do usuário simulando
 * interação real com o navegador.
 * ============================================
 */

describe('🧮 Calculadora Windows - Testes E2E', () => {

    beforeEach(() => {
        // Visitar a calculadora antes de cada teste
        cy.visit('/');
    });

    // ============================================
    // [CALC-01] Interface Visual
    // ============================================
    describe('[CALC-01] Interface Visual Windows', () => {

        it('Deve exibir a janela da calculadora centralizada', () => {
            cy.get('.calculator-window')
                .should('be.visible')
                .and('have.css', 'border-radius', '12px');
        });

        it('Deve exibir barra de título com controles de janela', () => {
            cy.get('.title-bar').should('be.visible');
            cy.get('.title-text').should('contain', 'Calculadora');
            cy.get('.control-btn.minimize').should('exist');
            cy.get('.control-btn.maximize').should('exist');
            cy.get('.control-btn.close').should('exist');
        });

        it('Deve exibir display com fonte mínima de 2.5rem', () => {
            cy.get('#display')
                .should('be.visible')
                .and('contain', '0');

            // Verificar tamanho da fonte (2.8rem definido no CSS)
            cy.get('#display').then(($el) => {
                const fontSize = parseFloat(window.getComputedStyle($el[0]).fontSize);
                expect(fontSize).to.be.greaterThan(39); // 2.5rem ≈ 40px
            });
        });

        it('Botões numéricos devem ter feedback visual no hover', () => {
            cy.get('.btn-number').first()
                .should('have.css', 'cursor', 'pointer')
                .trigger('mouseover');
        });

        it('Deve exibir todos os 10 dígitos (0-9)', () => {
            for (let i = 0; i <= 9; i++) {
                cy.get(`[data-value="${i}"]`).should('exist');
            }
        });

        it('Deve exibir todos os operadores (+, -, ×, ÷)', () => {
            const operators = ['+', '-', '×', '÷'];
            operators.forEach(op => {
                cy.get(`[data-value="${op}"]`).should('exist');
            });
        });
    });

    // ============================================
    // [CALC-02] Operações Aritméticas - Happy Path
    // ============================================
    describe('[CALC-02] Operações Aritméticas - Caminho Feliz', () => {

        it('Soma: 5 + 3 = 8', () => {
            cy.get('[data-value="5"]').click();
            cy.get('[data-value="+"]').click();
            cy.get('[data-value="3"]').click();
            cy.get('[data-action="equals"]').click();

            cy.get('#display').should('contain', '8');
            cy.get('#history').should('contain', '5 + 3 =');
        });

        it('Subtração: 10 - 4 = 6', () => {
            cy.get('[data-value="1"]').click();
            cy.get('[data-value="0"]').click();
            cy.get('[data-value="-"]').click();
            cy.get('[data-value="4"]').click();
            cy.get('[data-action="equals"]').click();

            cy.get('#display').should('contain', '6');
        });

        it('Multiplicação: 7 × 6 = 42', () => {
            cy.get('[data-value="7"]').click();
            cy.get('[data-value="×"]').click();
            cy.get('[data-value="6"]').click();
            cy.get('[data-action="equals"]').click();

            cy.get('#display').should('contain', '42');
        });

        it('Divisão: 20 ÷ 4 = 5', () => {
            cy.get('[data-value="2"]').click();
            cy.get('[data-value="0"]').click();
            cy.get('[data-value="÷"]').click();
            cy.get('[data-value="4"]').click();
            cy.get('[data-action="equals"]').click();

            cy.get('#display').should('contain', '5');
        });

        it('Número decimal: 3,5 + 1,5 = 5', () => {
            cy.get('[data-value="3"]').click();
            cy.get('[data-action="decimal"]').click();
            cy.get('[data-value="5"]').click();
            cy.get('[data-value="+"]').click();
            cy.get('[data-value="1"]').click();
            cy.get('[data-action="decimal"]').click();
            cy.get('[data-value="5"]').click();
            cy.get('[data-action="equals"]').click();

            cy.get('#display').should('contain', '5');
        });
    });

    // ============================================
    // [CALC-03] Divisão por Zero - E2E
    // ============================================
    describe('[CALC-03] Divisão por Zero - Caminho de Exceção', () => {

        it('Deve exibir "Erro" ao dividir por zero', () => {
            cy.get('[data-value="8"]').click();
            cy.get('[data-value="÷"]').click();
            cy.get('[data-value="0"]').click();
            cy.get('[data-action="equals"]').click();

            cy.get('#display')
                .should('contain', 'Erro')
                .and('have.class', 'error');
        });

        it('Deve bloquear operações após erro até clicar C', () => {
            // Provocar erro
            cy.get('[data-value="5"]').click();
            cy.get('[data-value="÷"]').click();
            cy.get('[data-value="0"]').click();
            cy.get('[data-action="equals"]').click();
            cy.get('#display').should('contain', 'Erro');

            // Tentar digitar (deve ser bloqueado)
            cy.get('[data-value="3"]').click();
            cy.get('#display').should('contain', 'Erro');

            // Reset com C
            cy.get('[data-action="clear"]').click();
            cy.get('#display').should('contain', '0');

            // Agora deve funcionar normalmente
            cy.get('[data-value="4"]').click();
            cy.get('#display').should('contain', '4');
        });
    });

    // ============================================
    // [BUG-01] Vírgula Duplicada - E2E
    // ============================================
    describe('[BUG-01] Prevenção de Vírgulas Duplicadas', () => {

        it('Não deve permitir duas vírgulas no mesmo número', () => {
            cy.get('[data-value="5"]').click();
            cy.get('[data-action="decimal"]').click();
            cy.get('[data-action="decimal"]').click(); // Segunda vírgula ignorada
            cy.get('[data-value="2"]').click();

            cy.get('#display').should('contain', '5,2');
            cy.get('#display').invoke('text').should('not.contain', '5,,2');
        });
    });

    // ============================================
    // [HOTFIX-01] Inversão de Sinal - E2E
    // ============================================
    describe('[HOTFIX-01] Inversão de Sinal (±)', () => {

        it('Deve inverter positivo para negativo', () => {
            cy.get('[data-value="4"]').click();
            cy.get('[data-value="2"]').click();
            cy.get('[data-action="toggle-sign"]').click();

            cy.get('#display').should('contain', '-42');
        });

        it('Deve inverter negativo para positivo', () => {
            cy.get('[data-value="7"]').click();
            cy.get('[data-action="toggle-sign"]').click();
            cy.get('#display').should('contain', '-7');

            cy.get('[data-action="toggle-sign"]').click();
            cy.get('#display').should('contain', '7');
        });
    });

    // ============================================
    // Jornada Completa E2E (Ponta a Ponta)
    // ============================================
    describe('Jornada Completa do Usuário', () => {

        it('Fluxo completo: operação → erro → reset → nova operação', () => {
            // 1. Operação bem-sucedida
            cy.get('[data-value="9"]').click();
            cy.get('[data-value="+"]').click();
            cy.get('[data-value="1"]').click();
            cy.get('[data-action="equals"]').click();
            cy.get('#display').should('contain', '10');

            // 2. Limpar e provocar erro
            cy.get('[data-action="clear"]').click();
            cy.get('[data-value="5"]').click();
            cy.get('[data-value="÷"]').click();
            cy.get('[data-value="0"]').click();
            cy.get('[data-action="equals"]').click();
            cy.get('#display').should('contain', 'Erro');

            // 3. Recuperar do erro
            cy.get('[data-action="clear"]').click();
            cy.get('#display').should('contain', '0');

            // 4. Nova operação funcional
            cy.get('[data-value="2"]').click();
            cy.get('[data-value="5"]').click();
            cy.get('[data-value="×"]').click();
            cy.get('[data-value="4"]').click();
            cy.get('[data-action="equals"]').click();
            cy.get('#display').should('contain', '100');
        });
    });
});
