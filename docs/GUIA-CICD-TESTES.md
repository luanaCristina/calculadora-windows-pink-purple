# 🚀 Guia Completo: CI/CD, Ambientes e Automação de Testes

> **Projeto:** Calculadora Windows — Pink, Purple & White Edition  
> **Stack:** HTML5, CSS3, JavaScript, Jest, Cypress, GitHub Actions

---

## 📑 Índice

1. [Módulo 1: Estratégia de Ambientes](#módulo-1-estratégia-de-ambientes)
2. [Módulo 2: Testes Unitários (Jest)](#módulo-2-testes-unitários)
3. [Módulo 3: Testes E2E (Cypress)](#módulo-3-testes-e2e)
4. [Módulo 4: Pipeline CI/CD (GitHub Actions)](#módulo-4-pipeline-cicd)

---

## Módulo 1: Estratégia de Ambientes

### 🎯 Por que usar e como funciona

| Ambiente | Propósito | Quem usa | Estabilidade |
|----------|-----------|----------|--------------|
| **DEV** (Local) | Desenvolvimento ativo, experimentação | Desenvolvedores | ⚠️ Instável |
| **STAGING** (HML) | Validação QA, testes integrados, aprovação PO | QA, PO, Devs | ✅ Estável |
| **PRODUÇÃO** (PROD) | Usuários finais, sistema real | Clientes | 🔒 Máxima estabilidade |

**Riscos de não usar:**
- 🚨 Deploy de código quebrado direto em produção
- 🚨 Bugs encontrados apenas por clientes
- 🚨 Impossibilidade de testar integrações antes de publicar

### 🌍 Analogia do Mundo Real

> Imagine uma **fábrica de automóveis**:
> - **DEV** = O engenheiro montando peças na bancada (pode errar, está experimentando)
> - **STAGING** = O carro montado na pista de teste interna (QA valida tudo antes)
> - **PRODUÇÃO** = O carro na concessionária pronto para o cliente dirigir

### 📁 Gerenciamento de Variáveis (.env)

```bash
# Estrutura no projeto:
.env.example          # Template público (vai para o Git)
.env.local            # Ambiente DEV (NÃO vai para Git)
.env.staging          # Ambiente STAGING (NÃO vai para Git)  
.env.production       # Ambiente PROD (NÃO vai para Git)
```

**Regra de ouro:** Arquivos `.env` reais NUNCA entram no repositório. Use `.env.example` como template.

### 🏃 Passo a Passo

```bash
# 1. Copiar o template para ambiente local
cp .env.example .env.local

# 2. Editar com suas configurações
nano .env.local

# 3. O .gitignore já bloqueia esses arquivos
cat .gitignore | grep env
# Saída: .env / .env.local / .env.staging / .env.production
```

### 🧩 Exercício Prático

**Desafio:** Adicione uma variável `APP_VERSION=1.0.0` no `.env.example` e faça com que o footer da calculadora exiba essa versão dinamicamente via JavaScript.

---

## Módulo 2: Testes Unitários

### 🎯 Por que usar e como funciona

**Pirâmide de Testes:**

```
         /\
        /E2E\         ← Poucos, lentos, caros
       /──────\
      / Integração \   ← Quantidade média
     /──────────────\
    /  UNITÁRIOS     \  ← MUITOS, rápidos, baratos
   /──────────────────\
```

| Característica | Teste Unitário |
|---|---|
| **Velocidade** | ⚡ Milissegundos |
| **Custo** | 💰 Baixíssimo |
| **Isolamento** | 🔒 Total (uma função por vez) |
| **Feedback** | 🎯 Imediato e preciso |
| **Cobertura** | 📊 80%+ recomendado |

**Padrão AAA (Arrange → Act → Assert):**

```javascript
test('Soma: 5 + 3 = 8', () => {
    // ARRANGE (Preparar) - Criar o objeto e definir estado
    const calc = new CalculatorCore();

    // ACT (Agir) - Executar a ação que queremos testar
    calc.inputNumber('5');
    calc.inputOperator('+');
    calc.inputNumber('3');
    calc.calculate();

    // ASSERT (Afirmar) - Verificar o resultado esperado
    expect(calc.currentValue).toBe('8');
});
```

### 🌍 Analogia do Mundo Real

> **Teste unitário** é como testar **cada peça de um carro isoladamente** na fábrica:
> - Testar o motor sozinho (funciona?)
> - Testar o freio sozinho (para?)
> - Testar o airbag sozinho (infla?)
>
> Se cada peça funciona individualmente, a chance do carro completo funcionar é altíssima.

### 🏃 Passo a Passo de Execução

```bash
# 1. Instalar dependências (primeira vez)
npm install

# 2. Rodar TODOS os testes unitários
npm test

# 3. Rodar em modo "watch" (re-executa ao salvar arquivo)
npm run test:watch

# 4. Ver relatório de cobertura no navegador
open coverage/lcov-report/index.html
```

**Saída esperada:**

```
 PASS  tests/unit/calculator.test.js
  [CALC-02] Operações Aritméticas Básicas
    ✓ Soma: 5 + 3 = 8 (2 ms)
    ✓ Subtração: 10 - 4 = 6 (1 ms)
    ✓ Multiplicação: 7 × 6 = 42 (1 ms)
    ✓ Divisão: 20 ÷ 4 = 5 (1 ms)
  [CALC-03] Divisão por Zero
    ✓ Divisão por zero exibe "Erro" (1 ms)
    ✓ Após erro, C reseta o estado (1 ms)
  [BUG-01] Prevenção de Vírgulas Duplicadas
    ✓ Impede segunda vírgula (1 ms)

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Coverage:    87.5% Statements | 82% Branches | 90% Functions
```

### 🧩 Exercício Prático (Quebra de Pipeline)

**Desafio:** Altere o `script.js` para que a soma retorne o resultado errado:

```javascript
// Em calculator.js, troque:
case '+': result = prev + current; break;
// Por:
case '+': result = prev - current; break; // BUG PROPOSITAL
```

Rode `npm test` e observe:

```
 FAIL  tests/unit/calculator.test.js
  ● [CALC-02] › Soma: 5 + 3 = 8
    Expected: "8"
    Received: "2"    ← FALHOU! O teste detectou o bug!
```

**Correção:** Reverta a alteração e rode `npm test` novamente. Pipeline verde! ✅

---

## Módulo 3: Testes E2E

### 🎯 Por que usar e como funciona

| Aspecto | Teste Unitário | Teste E2E |
|---------|---------------|-----------|
| **Escopo** | Uma função | Jornada completa |
| **Velocidade** | ⚡ ms | 🐢 segundos |
| **Navegador** | ❌ Não usa | ✅ Navegador real |
| **Confiança** | Boa (isolado) | Máxima (integrado) |
| **Custo** | 💰 Barato | 💰💰💰 Caro |

**Quando usar E2E:**
- Validar o fluxo completo do usuário
- Testar integrações entre frontend + backend
- Simular cenários reais de uso

### 🌍 Analogia do Mundo Real

> **Teste E2E** é como o **test drive completo** de um carro:
> - Ligar → Dar partida → Dirigir na estrada → Frear → Estacionar → Desligar
> - Testa TUDO funcionando junto, como o usuário final usaria.

### 🏃 Passo a Passo de Execução

```bash
# 1. Instalar dependências
npm install

# 2. Abrir Cypress em modo VISUAL (Interactive GUI)
# Ótimo para desenvolvimento e debug
npm run test:e2e:open

# 3. Rodar Cypress em modo HEADLESS (sem tela)
# Usado no CI/CD e em pipelines automatizadas
npm run test:e2e

# IMPORTANTE: O servidor precisa estar rodando!
# Em outro terminal:
npm run serve
# Depois em outro terminal:
npm run test:e2e
```

**Modo Visual (Cypress GUI):**
- Abre uma janela com o navegador Chrome embutido
- Mostra cada passo do teste em tempo real
- Permite "time-travel" (voltar passos e ver o estado do DOM)
- Ideal para debugging

**Modo Headless (CI/CD):**
- Executa sem abrir janela visual
- Gera vídeos e screenshots automaticamente
- Integra com GitHub Actions e outras pipelines

### 🧩 Exercício Prático

**Desafio:** Crie um novo teste E2E que valide o botão `%`:

```javascript
it('Percentual: 200 × 15% = 30', () => {
    cy.get('[data-value="2"]').click();
    cy.get('[data-value="0"]').click();
    cy.get('[data-value="0"]').click();
    cy.get('[data-value="×"]').click();
    cy.get('[data-value="1"]').click();
    cy.get('[data-value="5"]').click();
    cy.get('[data-action="percent"]').click();
    cy.get('[data-action="equals"]').click();
    cy.get('#display').should('contain', '30');
});
```

---

## Módulo 4: Pipeline CI/CD

### 🎯 Por que usar e como funciona

**CI (Integração Contínua):**
- A cada `git push` ou Pull Request, a pipeline **automaticamente**:
  - Instala dependências
  - Roda linter (qualidade do código)
  - Executa testes unitários
  - Executa testes E2E

**CD (Deploy Contínuo):**
- Merge em `develop` → Deploy automático para **Staging**
- Merge em `main` → Deploy automático para **Produção**

### 🌍 Analogia do Mundo Real

> **CI/CD** é como uma **esteira rolante de fábrica**:
> 1. 🔩 O operário coloca a peça na esteira (`git push`)
> 2. 🔍 Scanner de qualidade verifica defeitos (Lint)
> 3. 🧪 Estação de teste valida a peça (Testes Unitários)
> 4. 🚗 Teste drive automático na pista (E2E)
> 5. 📦 Empacotamento e envio para loja (Deploy)
>
> Se qualquer etapa falhar, a esteira PARA e o operário é notificado.

### 📊 Fluxo Visual da Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    git push / PR                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  JOB 1: 🔍 Lint + 🧪 Testes Unitários (Jest)           │
│  • npm ci                                               │
│  • npm run lint                                         │
│  • npm test --coverage                                  │
└────────────────────────┬────────────────────────────────┘
                         │ ✅ Passou?
                         ▼
┌─────────────────────────────────────────────────────────┐
│  JOB 2: 🎭 Testes E2E (Cypress Headless)               │
│  • Inicia servidor HTTP                                 │
│  • Cypress run --headless --browser chrome              │
│  • Captura screenshots/vídeos                           │
└────────────────────────┬────────────────────────────────┘
                         │ ✅ Passou?
                    ┌────┴────┐
                    │         │
             develop│         │main
                    ▼         ▼
┌──────────────────────┐  ┌──────────────────────────────┐
│ JOB 3: 🟡 Staging    │  │ JOB 4: 🟢 Produção (Pages)  │
│ Deploy para HML      │  │ Deploy para GitHub Pages     │
└──────────────────────┘  └──────────────────────────────┘
```

### 🏃 Passo a Passo - Disparar a Pipeline

```bash
# 1. Fazer uma alteração no código
echo "/* nova feature */" >> script.js

# 2. Commitar e fazer push
git add .
git commit -m "feat: nova funcionalidade"
git push origin develop

# 3. A pipeline dispara AUTOMATICAMENTE!
# Acompanhe em: https://github.com/luanaCristina/calculadora-windows-pink-purple/actions

# 4. Para deploy em produção:
git checkout main
git merge develop
git push origin main
# → Pipeline roda → Deploy automático para GitHub Pages
```

### 🧩 Exercício Prático (Quebra de Pipeline)

**Desafio:** Force a pipeline a falhar e depois corrija:

```bash
# 1. Introduza um bug no script.js
# Troque no calculate():
#   case '+': result = prev + current; break;
# Por:
#   case '+': result = prev * current; break;  // BUG!

# 2. Commite e faça push
git add script.js
git commit -m "feat: alteração na soma"
git push origin develop

# 3. Observe no GitHub Actions:
# ❌ JOB 1 FALHOU: teste "Soma: 5 + 3 = 8" quebrou
# ❌ JOB 2, 3, 4 NÃO EXECUTAM (dependem do Job 1)

# 4. CORREÇÃO: Reverta o bug
git revert HEAD
git push origin develop

# 5. Pipeline verde novamente! ✅
```

---

## 📋 Resumo Executivo - Comandos Essenciais

| Comando | O que faz |
|---------|-----------|
| `npm install` | Instala todas as dependências |
| `npm test` | Roda testes unitários + cobertura |
| `npm run test:watch` | Testes em modo watch (auto-rerun) |
| `npm run test:e2e:open` | Abre Cypress visual (GUI) |
| `npm run test:e2e` | Roda Cypress headless (CI) |
| `npm run serve` | Inicia servidor local na porta 3000 |
| `npm run lint` | Executa análise estática do código |
| `npm run ci` | Roda lint + unit + e2e (simulação local) |

---

## 🏆 Checklist de Qualidade

- [x] ✅ Testes unitários com 80%+ de cobertura
- [x] ✅ Testes E2E cobrindo caminhos feliz, alternativo e exceção
- [x] ✅ Pipeline CI/CD automatizada no GitHub Actions
- [x] ✅ Deploy automático para Staging (develop) e Produção (main)
- [x] ✅ Screenshots e vídeos capturados em falhas de E2E
- [x] ✅ Variáveis de ambiente isoladas por contexto
- [x] ✅ Lint para consistência de código

---

> 📝 **Documento criado por:** Luana Crystinne  
> 📅 **Última atualização:** Agosto 2026  
> 🔗 **Repositório:** [GitHub - calculadora-windows-pink-purple](https://github.com/luanaCristina/calculadora-windows-pink-purple)
