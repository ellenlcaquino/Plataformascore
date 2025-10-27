# Estrutura das Perguntas - QualityScore

## Como Editar as Perguntas

A estrutura de perguntas do QualityScore está organizada de forma modular no arquivo `/components/QualityScoreAssessment.tsx`.

### Localização das Perguntas

As perguntas estão organizadas em arrays constantes, cada um representando um pilar:

```typescript
// Perguntas do pilar Processos e Estratégia (16 perguntas)
const PROCESSES_QUESTIONS: Question[] = [
  { id: 'process1', text: 'Pergunta aqui...', type: 'scale', category: 'processes' },
  // ... mais perguntas
];

// Perguntas do pilar Testes Automatizados (16 perguntas)
const AUTOMATION_QUESTIONS: Question[] = [
  // ... perguntas
];

// E assim por diante para todos os pilares...
```

### Estrutura de uma Pergunta

Cada pergunta segue esta estrutura:

```typescript
{
  id: string,           // ID único da pergunta (ex: 'process1', 'auto1')
  text: string,         // Texto da pergunta
  type: 'scale' | 'checkbox',  // Tipo da pergunta
  category: string,     // Categoria/pilar da pergunta
  options?: string[]    // Opções (apenas para perguntas checkbox)
}
```

### Tipos de Pergunta Suportados

1. **Scale (0-5)**: Pergunta com escala de avaliação de 0 a 5
   ```typescript
   { id: 'process1', text: 'Pergunta...', type: 'scale', category: 'processes' }
   ```

2. **Checkbox**: Pergunta de múltipla escolha
   ```typescript
   { 
     id: 'test12', 
     text: 'Quais modalidades...?', 
     type: 'checkbox', 
     category: 'testModalities',
     options: ['Opção 1', 'Opção 2', 'Opção 3'] 
   }
   ```

### Pilares Atuais

1. **Processos e Estratégia** - 16 perguntas
2. **Testes Automatizados** - 16 perguntas  
3. **Métricas** - 14 perguntas
4. **Documentações** - 11 perguntas
5. **Modalidades de Testes** - 12 perguntas (inclui 1 pergunta checkbox)
6. **QAOps** - 10 perguntas
7. **Liderança** - 12 perguntas

**Total: 91 perguntas**

### Para Adicionar/Editar Perguntas:

1. Localize o array da categoria desejada
2. Adicione/edite a pergunta seguindo a estrutura acima
3. Atualize o `questionCount` no array `STEPS` se necessário
4. Atualize o número total de perguntas na descrição da overview

### Exemplo: Pergunta Checkbox

Apenas uma pergunta no formulário é do tipo checkbox (a última pergunta de Modalidades de Testes):

```typescript
{ 
  id: 'test12', 
  text: 'Quais modalidades de teste hoje os QA´s aplicam?', 
  type: 'checkbox', 
  category: 'testModalities',
  options: [
    'Funcional', 'Carga e Estresse', 'Performance', 'API', 'Unitário', 
    'Integração', 'Aceitação', 'Usabilidade', 'Acessibilidade', 'Segurança', 
    'Automatizados', 'Compatibilidade', 'Smoke', 'Regressão', 'Exploratórios', 
    'Beta/Produção', 'Contrato', 'Recuperação', 'Observabilidade', 'Outros'
  ]
}
```

### Importante

- **NÃO EDITE** o array `ALL_QUESTIONS` - ele é construído automaticamente
- **NÃO EDITE** as funções de navegação entre categorias
- Mantenha a consistência nos IDs das perguntas (ex: 'process1', 'process2', etc.)
- Atualize o total de perguntas na descrição quando modificar quantidades