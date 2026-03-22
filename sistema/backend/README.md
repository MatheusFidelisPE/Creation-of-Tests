# Sistema de Gerenciamento de Provas

Um sistema backend para criar, gerenciar e corrigir provas de forma aleatória. Desenvolvido com **Node.js**, **TypeScript**, **Express** e **Prisma**.

## Arquitetura

O backend segue uma **arquitetura em camadas** para melhor organização e manutenibilidade:

```
src/
├── models/          # DTOs e tipos TypeScript
├── repositories/    # Acesso aos dados (Prisma)
├── services/        # Lógica de negócio
├── controllers/     # Handlers das requisições HTTP
├── routes/          # Definição das rotas
├── utils/           # Funções auxiliares
└── index.ts         # Arquivo principal
```

### Camadas

1. **Models**: Definem os DTOs (Data Transfer Objects) e interfaces TypeScript
2. **Repositories**: Implementam o acesso aos dados usando Prisma
3. **Services**: Contêm a lógica de negócio (geração de provas, correção, etc)
4. **Controllers**: Tratam as requisições HTTP
5. **Routes**: Definem as rotas da API

## Entidades

### Questao
- **QuestaoID**: Identificador único
- **Enunciado**: Texto da questão
- **dataCriacao**: Data de criação

### Alternativa
- **AlternativaID**: Identificador único
- **QuestaoID**: Referência à questão
- **Correta**: Booleano indicando se é a alternativa correta
- **Descricao**: Texto da alternativa

### Prova
- **ProvaID**: Identificador único
- **TipoDeResposta**: "LETRAS" ou "SOMA_EXPONENCIAL"
- **Questões**: Conjunto de questões (relação muitos-para-muitos)
- **dataCriacao**: Data de criação
- **dataModificacao**: Data da última modificação

## Tipos de Resposta

### LETRAS
O usuário fornece a sequência de letras das alternativas corretas. Ex: "a, b, d"

### SOMA_EXPONENCIAL
O usuário fornece a soma de potências de 2 (1, 2, 4, 8, 16...). 
Exemplo: Se as alternativas corretas são a 1ª e 3ª, a resposta é 1 + 4 = 5

## API Endpoints

### Questões

```bash
# Criar uma questão
POST /api/questoes
{
  "enunciado": "Qual é a capital do Brasil?"
}

# Listar todas as questões
GET /api/questoes

# Buscar uma questão
GET /api/questoes/:id

# Atualizar uma questão
PUT /api/questoes/:id
{
  "enunciado": "Novo enunciado"
}

# Deletar uma questão
DELETE /api/questoes/:id
```

### Alternativas

```bash
# Criar uma alternativa
POST /api/alternativas
{
  "questaoId": 1,
  "correta": true,
  "descricao": "Brasília"
}

# Listar alternativas de uma questão
GET /api/alternativas/questao/:questaoId

# Atualizar uma alternativa
PUT /api/alternativas/:id
{
  "correta": false,
  "descricao": "São Paulo"
}

# Deletar uma alternativa
DELETE /api/alternativas/:id
```

### Provas

```bash
# Gerar uma prova com questões aleatórias
POST /api/provas/gerar
{
  "quantidadeQuestoes": 5,
  "tipoDeResposta": "LETRAS"
}

# Listar todas as provas
GET /api/provas

# Buscar uma prova
GET /api/provas/:id

# Corrigir uma prova
POST /api/provas/:id/corrigir
{
  "respostas": [
    {
      "questaoId": 1,
      "resposta": "b"
    },
    {
      "questaoId": 2,
      "resposta": "5"
    }
  ]
}

# Deletar uma prova
DELETE /api/provas/:id
```

## Instalação e Uso

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o banco de dados

O arquivo `.env` já está configurado com SQLite. Para usar outro banco, edite a variável `DATABASE_URL`.

```bash
# Executar migrações
npx prisma migrate dev --name init
```

### 3. Popular banco de dados (opcional)

```bash
# Executar seed com dados de exemplo
npx prisma db seed
```

Para que o seed funcione, adicione ao `package.json`:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### 4. Iniciar o servidor

#### Modo desenvolvimento (com hot reload)
```bash
npm run dev
```

#### Modo produção
```bash
npm run build
npm start
```

O servidor estará acessível em `http://localhost:3001`

## Exemplo de Uso

### 1. Criar questões com alternativas

```bash
curl -X POST http://localhost:3001/api/questoes \
  -H "Content-Type: application/json" \
  -d '{"enunciado": "Qual é a capital do Brasil?"}'
```

```bash
curl -X POST http://localhost:3001/api/alternativas \
  -H "Content-Type: application/json" \
  -d '{
    "questaoId": 1,
    "correta": true,
    "descricao": "Brasília"
  }'
```

### 2. Gerar uma prova

```bash
curl -X POST http://localhost:3001/api/provas/gerar \
  -H "Content-Type: application/json" \
  -d '{
    "quantidadeQuestoes": 3,
    "tipoDeResposta": "LETRAS"
  }'
```

Resposta:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "questoes": [...],
    "tipoDeResposta": "LETRAS",
    "dataCriacao": "2026-03-21T...",
    "dataModificacao": "2026-03-21T..."
  }
}
```

### 3. Corrigir a prova

```bash
curl -X POST http://localhost:3001/api/provas/1/corrigir \
  -H "Content-Type: application/json" \
  -d '{
    "respostas": [
      {"questaoId": 1, "resposta": "b"},
      {"questaoId": 3, "resposta": "a"},
      {"questaoId": 5, "resposta": "c"}
    ]
  }'
```

Resposta:
```json
{
  "success": true,
  "data": {
    "provaId": 1,
    "totalQuestoes": 3,
    "questoesCorretas": 2,
    "percentualAcerto": 66.67,
    "detalhes": [...]
  }
}
```

## Estrutura do Banco de Dados

```sql
-- Questões
CREATE TABLE questoes (
  id INTEGER PRIMARY KEY,
  enunciado TEXT NOT NULL,
  dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Alternativas
CREATE TABLE alternativas (
  id INTEGER PRIMARY KEY,
  questaoId INTEGER NOT NULL,
  correta BOOLEAN NOT NULL,
  descricao TEXT NOT NULL,
  FOREIGN KEY (questaoId) REFERENCES questoes(id)
);

-- Provas
CREATE TABLE provas (
  id INTEGER PRIMARY KEY,
  tipoDeResposta TEXT DEFAULT 'LETRAS',
  dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  dataModificacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Relacionamento Prova-Questão
CREATE TABLE prova_questoes (
  id INTEGER PRIMARY KEY,
  provaId INTEGER NOT NULL,
  questaoId INTEGER NOT NULL,
  ordem INTEGER DEFAULT 0,
  UNIQUE(provaId, questaoId),
  FOREIGN KEY (provaId) REFERENCES provas(id),
  FOREIGN KEY (questaoId) REFERENCES questoes(id)
);
```

## Tecnologias

- **Node.js**: Runtime JavaScript
- **TypeScript**: Tipagem estática
- **Express**: Framework web
- **Prisma**: ORM para banco de dados
- **SQLite**: Banco de dados (padrão)

## Próximos Passos

- [ ] Adicionar autenticação
- [ ] Implementar paginação nas listagens
- [ ] Adicionar testes unitários
- [ ] Criar documentação Swagger/OpenAPI
- [ ] Implementar tratamento de erros mais robusto
- [ ] Adicionar logging
- [ ] Implementar cache
- [ ] Criar integração com frontend

## Licença

Este projeto é parte de um trabalho acadêmico do programa de Mestrado em IA e Computação.
