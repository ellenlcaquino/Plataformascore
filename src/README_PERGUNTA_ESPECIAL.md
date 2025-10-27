# Documentação Técnica: Pergunta Especial QualityScore

## ⚠️ ATENÇÃO - Tratamento de Pergunta Não-Numérica

### Contexto
O formulário QualityScore possui **91 perguntas**, sendo que **90 são numéricas** (escala 0-5) e **1 é especial** (múltipla escolha).

### Pergunta Especial
**Texto:** "Quais modalidades de teste hoje os QA's aplicam?"
**ID:** `test12`  
**Pilar:** Modalidades de Testes
**Tipo:** Checkbox (múltipla escolha)

### Formato Esperado
```
Funcional;API;Unitário
Performance;Segurança;Acessibilidade
Funcional;Manual;Smoke;Regressão
```

### Tratamento no Sistema

#### ✅ O que DEVE acontecer:
- ✅ Identificar a pergunta pelo texto exato ou ID `test12`
- ✅ NÃO aplicar validação de escala 0-5
- ✅ Processar como array de strings separadas por `;`
- ✅ Permitir resposta vazia (não obrigatória)
- ✅ Armazenar para análise qualitativa
- ✅ NÃO interferir no cálculo de score dos pilares

#### ❌ O que NÃO deve acontecer:
- ❌ Bloquear importação por conter texto
- ❌ Tentar converter para número
- ❌ Aplicar validação numérica
- ❌ Considerar como erro de formato

### Implementação Técnica

#### 1. Identificação de Perguntas Textuais
```typescript
// IDs de perguntas que são textuais e não devem ser incluídas nos cálculos numéricos
const TEXTUAL_QUESTION_IDS = new Set(['test12']);
```

#### 2. Processamento da Pergunta Especial
```typescript
// Identificação da pergunta especial
if (questionInfo.id === 'test12') {
  // Processar como array de modalidades
  if (rawValue && typeof rawValue === 'string') {
    const modalidades = rawValue.split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    respostaTexto[questionInfo.id] = modalidades;
  } else {
    respostaTexto[questionInfo.id] = [];
  }
} else {
  // Perguntas numéricas normais (0-5)
  // ... validação numérica
}
```

#### 3. Cálculos Numéricos (Ignorando Pergunta Especial)
```typescript
// Calcular médias por pilar (ignorando perguntas textuais)
if (
  !TEXTUAL_QUESTION_IDS.has(questionId) &&
  respostas[questionId] !== undefined && 
  typeof respostas[questionId] === 'number'
) {
  pillarSums[pillar] += respostas[questionId] as number;
  pillarCounts[pillar]++;
}
```

#### Interface TypeScript
```typescript
export interface ImportedUser {
  // ... outros campos
  respostas: Record<string, number | string[]>; // Permite arrays para test12
  modalidadesTestes?: string[]; // Campo específico para análise
}
```

### Validação de Arquivo
- ✅ Arquivo deve ter **99 colunas** (8 metadados + 91 perguntas)
- ✅ Pergunta especial está na **coluna 58** (índice 57)
- ✅ Pertence ao pilar "Modalidades de Testes"

### Análise de Dados
A pergunta especial é usada para:
- 📊 Análise qualitativa das modalidades mais utilizadas
- 📈 Estatísticas de adoção por modalidade
- 🎯 Identificação de gaps nas práticas de teste
- ❌ **NÃO** interfere no cálculo numérico do score

### Exemplos de Uso

#### Entrada Válida:
```csv
UserID,Email,Nome,...,Quais modalidades de teste hoje os QA's aplicam?
USER001,user@test.com,Usuário,...,Funcional;API;Unitário;Performance
USER002,user2@test.com,Usuário 2,...,Manual;Smoke;Regressão
USER003,user3@test.com,Usuário 3,...,
```

#### Saída Processada:
```json
{
  "modalidadesTestes": ["Funcional", "API", "Unitário", "Performance"],
  "respostas": {
    "test12": ["Funcional", "API", "Unitário", "Performance"]
  }
}
```

### Alertas de Sistema
- 🟡 Se arquivo trata todas as perguntas como numéricas = **INCORRETO**
- 🟡 Se bloqueia importação por texto na pergunta especial = **INCORRETO**  
- 🟡 Se inclui test12 nos cálculos de média dos pilares = **INCORRETO**
- 🟢 Se processa test12 como array de strings = **CORRETO**
- 🟢 Se ignora test12 nos cálculos numéricos = **CORRETO**

### ✅ Correções Implementadas (v2)
- ✅ Constante `TEXTUAL_QUESTION_IDS` para identificar perguntas especiais
- ✅ Função `calculatePillarAverages` ignora explicitamente test12
- ✅ Função `groupResponsesByPillar` ignora explicitamente test12  
- ✅ Distribuição de respostas filtra apenas valores numéricos
- ✅ Validação de respostas suficientes desconta perguntas textuais
- ✅ Logging detalhado para debugging e monitoramento

---

**⚠️ Qualquer sistema que trate todas as perguntas como obrigatoriamente numéricas estará incorreto. Esta exceção deve ser explicitamente codificada.**