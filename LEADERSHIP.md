# 📊 Parte 2 – Escalar o Marketplace (Squad Leader)

## 🎯 1. Diagnóstico e Priorização

### Análise do Marketplace Atual

Analisando o marketplace desenvolvido e considerando o objetivo de escalar para **10 mil usuários ativos no próximo trimestre**, identifiquei os seguintes gargalos potenciais:

#### Gargalos Identificados:
- **Performance do Backend**: Consultas ao banco de dados sem otimização (falta de índices, queries N+1)
- **Ausência de Cache**: Todas as requisições batem diretamente no banco
- **Sistema de Upload**: Imagens sendo armazenadas localmente sem CDN
- **Falta de Observabilidade**: Sem monitoramento de erros e métricas
- **Ausência de Testes**: Código sem cobertura de testes automatizados
- **Infraestrutura Básica**: Aplicação rodando em servidor único sem escalabilidade horizontal

### 🔴 3 Frentes Críticas Prioritárias

Com base no impacto e na urgência para suportar 10 mil usuários, as 3 frentes críticas são:

#### **Frente 1: Performance e Escalabilidade do Backend**
**Por quê?** Com 10 mil usuários, o backend atual não aguenta a carga. Consultas lentas vão derrubar o sistema.
- Otimização de queries e índices no banco
- Implementação de cache (Redis)
- Paginação adequada em todas as listagens

#### **Frente 2: Infraestrutura e Observabilidade**
**Por quê?** Precisamos saber quando algo quebra antes do usuário reclamar. E precisamos poder escalar recursos conforme demanda.
- Migração para arquitetura cloud (AWS/Azure)
- Implementação de monitoramento (logs, métricas, alertas)
- Setup de CI/CD para deploys seguros

#### **Frente 3: Qualidade e Confiabilidade**
**Por quê?** Bugs em produção afetam a experiência e geram churn. Testes automatizados previnem regressões.
- Cobertura de testes (unit, integration, e2e)
- Sistema de gerenciamento de imagens escalável (S3 + CloudFront)
- Documentação técnica e API

---

## 📅 2. Planejamento de 3 Sprints (2 semanas cada)

### 🚀 Sprint 1: Performance e Escalabilidade (Semanas 1-2)

**Objetivo:** Tornar o backend capaz de suportar alta carga de requisições.

#### Entregáveis:
- [ ] Implementar Redis para cache de listagens de produtos
- [ ] Adicionar índices no banco de dados (produtos, usuários)
- [ ] Otimizar queries N+1 (usar eager loading)
- [ ] Implementar rate limiting nas APIs
- [ ] Adicionar paginação com cursor nas listagens
- [ ] Configurar connection pooling no banco

#### Métricas de Sucesso:
- Tempo de resposta da API de listagem de produtos < 200ms (atualmente ~800ms)
- Redução de 70% nas queries ao banco (via cache)
- Suporte a 100 requisições/segundo sem degradação

#### Riscos:
- Configuração incorreta do Redis pode gerar dados inconsistentes
- **Mitigação:** Implementar invalidação de cache adequada e testes de integração

---

### 🏗️ Sprint 2: Infraestrutura e Observabilidade (Semanas 3-4)

**Objetivo:** Garantir visibilidade do sistema e capacidade de escalar horizontalmente.

#### Entregáveis:
- [ ] Configurar ambiente na AWS (EC2, RDS, S3)
- [ ] Implementar logging centralizado (CloudWatch ou ELK)
- [ ] Adicionar monitoramento de métricas (Prometheus + Grafana ou DataDog)
- [ ] Criar dashboards de métricas críticas (latência, erros, uso de recursos)
- [ ] Setup de alertas (Slack/Discord) para erros críticos
- [ ] Pipeline CI/CD com GitHub Actions
- [ ] Migrar uploads para S3 + CloudFront

#### Métricas de Sucesso:
- 100% das APIs monitoradas com alertas configurados
- Deploy automatizado em menos de 10 minutos
- Redução de 90% no custo de storage (via S3)
- Tempo de detecção de incidentes < 2 minutos

#### Riscos:
- Complexidade da migração de infraestrutura pode atrasar entregas
- **Mitigação:** Fazer migração incremental, começando por ambiente de staging

---

### ✅ Sprint 3: Qualidade e Confiabilidade (Semanas 5-6)

**Objetivo:** Garantir estabilidade do sistema através de testes e documentação.

#### Entregáveis:
- [ ] Cobertura de testes backend mínima de 70%
- [ ] Testes E2E para fluxos críticos (login, compra, cadastro)
- [ ] Documentação da API (Swagger/OpenAPI)
- [ ] Implementar health checks (liveness e readiness)
- [ ] Configurar backups automáticos do banco
- [ ] Política de retry e circuit breaker nas integrações
- [ ] Guia de troubleshooting para o time

#### Métricas de Sucesso:
- 70% de code coverage em testes automatizados
- Zero bugs críticos em produção no final da sprint
- 100% das APIs documentadas
- Tempo de recuperação de incidentes (MTTR) < 15 minutos

#### Riscos:
- Time pode subestimar tempo necessário para escrever testes
- **Mitigação:** Fazer pair programming para disseminar conhecimento

---

## 📈 3. Project Report e Roadmap

### Modelo de Report Executivo (Template)

```
# Report Semanal - Projeto Marketplace

**Período:** [Data início] - [Data fim]
**Sprint:** [Número da Sprint]

## 📊 Status Geral
🟢 No prazo | 🟡 Atenção necessária | 🔴 Atrasado

**Status atual:** [🟢/🟡/🔴]

## ✅ Entregas da Semana
- [Item 1]: Concluído ✓
- [Item 2]: Em progresso (80%)
- [Item 3]: Bloqueado (descrever bloqueio)

## 📈 Métricas Principais
| Métrica | Atual | Meta | Status |
|---------|-------|------|--------|
| Tempo de resposta API | 300ms | <200ms | 🟡 |
| Taxa de erro | 0.5% | <1% | 🟢 |
| Uptime | 99.8% | >99.5% | 🟢 |
| Usuários ativos | 2.500 | 10.000 | 🟡 |

## 🚧 Bloqueios e Impedimentos
1. [Bloqueio 1] - Responsável: [Nome] - ETA: [Data]

## 🎯 Próximos Passos
- [ ] Tarefa 1
- [ ] Tarefa 2

## 💡 Insights e Aprendizados
- [Insight relevante para stakeholders]

## ⚠️ Riscos Identificados
- [Risco] - Probabilidade: [Alta/Média/Baixa] - Impacto: [Alto/Médio/Baixo]
```

### Roadmap Trimestral (3 Meses)

---

#### 🎯 ÉPICO 1: Performance e Escalabilidade (Mês 1)

**Objetivo:** Preparar o sistema para suportar 10 mil usuários simultâneos.

##### OKRs:
- **O:** Reduzir o tempo de resposta das APIs críticas
  - **KR1:** Tempo de resposta da listagem de produtos < 200ms (baseline: 800ms)
  - **KR2:** Implementar cache em 100% das listagens
  - **KR3:** Reduzir queries ao banco em 70%

- **O:** Aumentar a capacidade de processamento
  - **KR1:** Sistema suportando 100 req/s sem degradação (baseline: 20 req/s)
  - **KR2:** Implementar rate limiting em todas as APIs
  - **KR3:** Connection pooling configurado com limite adequado

##### Critérios de Aceite:
- [ ] Testes de carga comprovando 100 req/s sem erros
- [ ] Cache implementado com estratégia de invalidação documentada
- [ ] Métricas de performance monitoradas e alertas configurados

---

#### 🏗️ ÉPICO 2: Infraestrutura Cloud e Observabilidade (Mês 2)

**Objetivo:** Ter visibilidade completa do sistema e capacidade de escalar sob demanda.

##### OKRs:
- **O:** Migrar para infraestrutura escalável
  - **KR1:** 100% da aplicação rodando em cloud (AWS)
  - **KR2:** Auto-scaling configurado baseado em métricas
  - **KR3:** Custo de storage reduzido em 90% (S3 vs local)

- **O:** Implementar observabilidade completa
  - **KR1:** 100% das APIs com logs estruturados e métricas
  - **KR2:** Dashboards com métricas críticas (4 golden signals)
  - **KR3:** Alertas automáticos para incidentes críticos (<2min detecção)

##### Critérios de Aceite:
- [ ] Ambiente de produção rodando em AWS com multi-AZ
- [ ] Pipeline CI/CD funcionando com deploy automatizado
- [ ] Dashboard de métricas acessível para todo o time
- [ ] Runbook de incidentes documentado

---

#### ✅ ÉPICO 3: Qualidade e Confiabilidade (Mês 3)

**Objetivo:** Garantir estabilidade e confiança no sistema através de testes e documentação.

##### OKRs:
- **O:** Aumentar cobertura de testes automatizados
  - **KR1:** 70% de code coverage no backend
  - **KR2:** 100% dos fluxos críticos com testes E2E
  - **KR3:** Zero bugs críticos em produção

- **O:** Melhorar experiência do desenvolvedor
  - **KR1:** 100% das APIs documentadas (Swagger)
  - **KR2:** Guia de onboarding para novos devs (<2h setup)
  - **KR3:** Tempo de recuperação de incidentes < 15 minutos

##### Critérios de Aceite:
- [ ] Relatório de cobertura de testes com mínimo 70%
- [ ] Documentação da API completa e atualizada
- [ ] Backups automáticos configurados e testados
- [ ] SLA de 99.5% de uptime alcançado

---

#### 📊 Visão Consolidada - Trimestre

| Mês | Épico | Objetivo Principal | Impacto Esperado |
|-----|-------|-------------------|------------------|
| 1 | Performance | Backend escalável | Suporta 3k usuários |
| 2 | Infraestrutura | Visibilidade e cloud | Suporta 7k usuários |
| 3 | Qualidade | Estabilidade | Suporta 10k+ usuários |

**Meta Final:** Sistema suportando **10 mil usuários ativos** com SLA de **99.5% uptime** e tempo de resposta médio **< 200ms**.

---

## 👥 4. Cultura e Engajamento - Case Prático

### 🔍 Análise do Problema

**Situação:** Squad não acompanha burndown, atrasa entregas, falta em rituais e demonstra desengajamento.

#### Possíveis Causas Raiz:
1. **Falta de clareza:** Time não entende o propósito do trabalho
2. **Sobrecarga:** Demandas irrealistas ou muito esforço em tarefas técnicas complexas
3. **Problemas pessoais:** Questões individuais afetando performance
4. **Falta de autonomia:** Time se sente microgerenciado ou sem voz
5. **Dívida técnica:** Frustração com código legado difícil de manter

---

### 🚨 Ações Imediatas (Primeiras 48 horas)

#### 1. **Conversa Individual (1:1)**
- Agendar 1:1 com cada membro do time (30-45 min)
- Perguntas-chave:
  - "Como você está se sentindo no projeto?"
  - "O que está te impedindo de entregar?"
  - "O que podemos mudar para melhorar?"
- **Objetivo:** Entender o problema real sem julgamentos

#### 2. **Retrospectiva de Emergência**
- Reunir o time para uma retro focada no problema
- Usar formato "Start, Stop, Continue"
- **Regra de ouro:** Foco em problemas do processo, não em pessoas
- Deixar o time propor soluções (ownership)

#### 3. **Revisar Prioridades**
- Validar se o backlog está realista
- Cortar escopo se necessário (qualidade > quantidade)
- Renegociar prazos com stakeholders se for o caso

---

### 🛠️ Ações de Curto Prazo (2 semanas)

#### 1. **Ajustar Rituais**
- Tornar daily assíncrona (se o time preferir)
- Reduzir duração de reuniões (timeboxing rígido)
- Gravar reuniões para quem não puder comparecer
- **Compromisso:** Se marcar presença, estar presente

#### 2. **Melhorar Visibilidade**
- Criar quadro visual do burndown (físico ou Miro)
- Celebrar pequenas vitórias diariamente
- Tornar bloqueios explícitos e resolver RÁPIDO

#### 3. **Empoderamento Técnico**
- Destinar 20% do tempo da sprint para resolver dívidas técnicas
- Permitir que o time escolha como resolver problemas
- Pair programming para disseminar conhecimento

#### 4. **Reconhecimento**
- Dar feedback positivo público, críticas em privado
- Celebrar entregas, mesmo que pequenas
- Agradecer presença e esforço nos rituais

---

### 🔄 Ações Preventivas (Longo Prazo)

#### 1. **Cultura de Transparência**
- Time se sente seguro para falar de problemas
- "Não sei" é uma resposta válida
- Erros são oportunidades de aprendizado

#### 2. **Ownership e Autonomia**
- Time define como resolver problemas técnicos
- Decisões descentralizadas quando possível
- Tech leads são facilitadores, não mandatários

#### 3. **Equilíbrio Sustentável**
- Respeitar horários (sem horas extras constantes)
- Férias e descanso são incentivados
- Workload distribuído de forma justa

#### 4. **Desenvolvimento Contínuo**
- Budget para cursos e certificações
- Tempo para estudar novas tecnologias
- Compartilhamento de conhecimento (tech talks)

---

### 🔥 Reforçando a Cultura "Bora Moer"

A cultura "Bora Moer" não é sobre trabalhar até a exaustão, mas sobre **execução com propósito e energia**.

#### Como aplicar na prática:

##### 1. **Clareza de Propósito**
```
❌ "Precisamos entregar essa feature"
✅ "Essa feature vai permitir que 10 mil usuários comprem mais fácil. 
   Vamos impactar diretamente a receita da empresa e melhorar a vida 
   dos nossos usuários. Bora moer isso!"
```

##### 2. **Energia Positiva**
- Começar dailies com uma vitória do dia anterior
- Criar um canal de memes/celebrações no Slack
- Playlist colaborativa para coding sessions

##### 3. **Execução Focada**
- Bloquear tempos de foco profundo (sem reuniões)
- "Moer" significa fazer com qualidade, não rapidez
- Priorizar ruthlessly (se tudo é urgente, nada é)

##### 4. **Suporte Mútuo**
```
Quando alguém está travado:
1. Oferecer ajuda sem julgamento
2. Pair programming para destrancar
3. "Bora moer juntos!" é um grito de guerra, não pressão
```

##### 5. **Celebrar Vitórias**
- Toda sexta: retrospectiva das conquistas da semana
- "Hall da Fama" dos PRs/features mais legais
- Pizza/happy hour quando bater metas importantes

#### O que NÃO é "Bora Moer":
- ❌ Trabalhar até tarde todo dia
- ❌ Ignorar burnout
- ❌ Sacrificar qualidade por velocidade
- ❌ Pressionar quem está com dificuldades

#### O que É "Bora Moer":
- ✅ Trabalhar com energia e propósito
- ✅ Ajudar o colega do lado
- ✅ Comemorar vitórias juntos
- ✅ Persistir nos desafios com resiliência
- ✅ Se divertir enquanto entrega valor

---

### 📋 Checklist de Recuperação do Time

**Semana 1:**
- [ ] Realizar 1:1 com todos os membros
- [ ] Fazer retrospectiva de emergência
- [ ] Identificar e remover bloqueadores principais
- [ ] Renegociar expectativas com stakeholders

**Semana 2:**
- [ ] Implementar mudanças nos rituais (se necessário)
- [ ] Criar visibilidade melhor do progresso
- [ ] Celebrar primeira entrega pequena
- [ ] Agendar 1:1s recorrentes

**Semana 3-4:**
- [ ] Monitorar métricas de engajamento (presença, entregas)
- [ ] Ajustar abordagem baseado em feedback
- [ ] Continuar celebrando vitórias
- [ ] Avaliar se as ações estão funcionando

**Indicadores de Sucesso:**
- Time volta a comparecer nos rituais (95%+ presença)
- Burndown volta a ser acompanhado e reflete realidade
- Entregas voltam ao ritmo esperado
- Clima do time melhora (avaliar em retro)

---

## 🎯 Conclusão

Escalar um marketplace de 0 para 10 mil usuários é um desafio técnico **e humano**. 

**Tecnicamente**, focamos nas frentes críticas: performance, infraestrutura e qualidade.

**Humanamente**, garantimos que o time tem clareza, autonomia, suporte e razões para estar engajado.

Um Tech Lead Junior precisa equilibrar entregas técnicas com cuidado com as pessoas. Afinal, **código não se escreve sozinho** — são as pessoas que fazem a diferença.

**Bora moer!** 🚀 (com equilíbrio e propósito)

---

**Desenvolvido por:** [Seu Nome]  
**Data:** Outubro 2025  
**Contexto:** Desafio Técnico - Tech Lead Junior

