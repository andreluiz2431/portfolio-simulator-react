# Plano de Evolução e Novas Funcionalidades

Este documento descreve os próximos passos para evoluir o `portfolio-simulator-react`, adicionando novas funcionalidades e melhorando a experiência do usuário com base na estrutura atual do projeto.

## 🚀 Seção 1: Melhorias de UI/UX (Experiência do Usuário)

- [x] **Implementar Tooltips Explicativos no Resumo**: Adicionar tooltips (dicas de ajuda) nos cards de `SummaryMetrics`. Ao passar o mouse sobre um valor, o usuário verá uma breve explicação de como aquele número foi calculado.
    - *Exemplo para "Patrimônio Final"*: "Soma do total aportado com os juros e dividendos reinvestidos."
    - *Exemplo para "Rentabilidade Total"*: "Ganho percentual sobre o valor total aportado. Fórmula: `((Patrimônio Final - Total Aportado) / Total Aportado) * 100`."

- [x] **Adicionar Animações de Carregamento (Skeletons)**: Enquanto a simulação é processada, exibir componentes "esqueleto" que imitam o layout do dashboard. Isso melhora a percepção de velocidade e feedback para o usuário.

- [x] **Criar um Tema "Dark Mode"**: Implementar um seletor que permita ao usuário alternar entre o tema claro (padrão) e um tema escuro, utilizando o sistema de theming do Material-UI.

## ✨ Seção 2: Novas Funcionalidades

- [x] **Comparação de Múltiplas Carteiras**: Modificar a interface para permitir que o usuário adicione, configure e compare mais de duas carteiras de investimento na mesma simulação.

- [x] **Salvar e Carregar Simulações**: Implementar uma funcionalidade para salvar os parâmetros de uma simulação (e talvez os resultados) no `localStorage` do navegador. Isso permite que o usuário não perca suas configurações ao fechar a aba.

- [ ] **Detalhar Gráficos por Período**: Adicionar um filtro (ex: botões "Anual", "Total") para que o usuário possa visualizar os dados dos gráficos de forma consolidada por ano, além da visão mensal acumulada.

- [ ] **Exportar Relatório da Simulação**: Criar um botão "Exportar" que gere um relatório simples em formato PDF ou CSV com os dados do `SummaryMetrics` e a tabela de evolução mensal.

## 🧠 Seção 3: Lógica da Simulação e Dados

- [ ] **Adicionar Parâmetros Avançados**: Incrementar o motor de simulação para considerar novas variáveis:
    - [ ] Taxa de inflação (para calcular o ganho real).
    - [ ] Imposto de Renda sobre os ganhos.
    - [ ] Possibilidade de aportes esporádicos (ex: 13º salário).

- [ ] **Validar Parâmetros de Entrada**: Utilizar uma biblioteca como `Zod` para criar um schema de validação para os dados do formulário de simulação, exibindo mensagens de erro claras e prevenindo cálculos com dados inválidos.

- [ ] **Mover Simulação para um Web Worker**: Para simulações muito longas (ex: 40 anos com cálculos complexos), mover a lógica de processamento para um Web Worker. Isso evita que a interface do usuário congele durante o cálculo.

## 🛠️ Seção 4: Refatoração e Qualidade de Código

- [ ] **Centralizar Funções Utilitárias**: Mover as funções de formatação (`formatCurrency`, `formatPercentage`) para um arquivo `src/utils/formatters.ts` ou um hook customizado `useFormatters()` para evitar duplicação de código entre os componentes.

- [ ] **Componentizar Cards de Métrica**: Em `SummaryMetrics.tsx`, a estrutura para exibir os dados da carteira "Dividendos" e "Crescimento" é muito parecida. Criar um componente menor, como `MetricDisplay`, para reduzir a repetição no JSX.

- [ ] **Centralizar Constantes do Projeto**: As cores das carteiras (`#1976d2`, `#2e7d32`) e outros valores constantes devem ser definidos em um local central (ex: no tema do MUI ou em `src/styles/constants.ts`) para facilitar futuras alterações de design.