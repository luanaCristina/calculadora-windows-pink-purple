/**
 * ============================================
 * CONFIGURAÇÃO CYPRESS - Testes E2E
 * Calculadora Windows Pink Purple
 * ============================================
 */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        // URL base da aplicação em ambiente de testes
        baseUrl: 'http://localhost:3000',

        // Pasta dos testes E2E
        specPattern: 'tests/e2e/**/*.cy.js',

        // Pasta de suporte
        supportFile: false,

        // Configurações de viewport (simular desktop)
        viewportWidth: 1280,
        viewportHeight: 720,

        // Timeout para comandos
        defaultCommandTimeout: 5000,

        // Screenshots em caso de falha
        screenshotOnRunFailure: true,
        screenshotsFolder: 'tests/e2e/screenshots',

        // Vídeos da execução
        video: true,
        videosFolder: 'tests/e2e/videos',
    }
});
