# AI Coding Rules

Este arquivo contém as regras que devem ser seguidas durante o desenvolvimento deste projeto para garantir a estabilidade e qualidade do código.

## 1. Verificação Pré-Commit
Sempre realize uma verificação de build antes de finalizar qualquer tarefa ou realizar um commit. Isso evita que erros de tipagem (TypeScript) ou erros de compilação do Next.js cheguem ao ambiente de produção.

**Comando de verificação:**
```bash
npm run build
```

## 2. Consistência de Layout
Ao modificar componentes de layout (`Sidebar`, `Topbar`, `DashboardLayout`), certifique-se de que a responsividade seja testada e que o `z-index` dos elementos esteja correto para evitar sobreposições indesejadas.

## 3. Limpeza de Imports
Sempre remova imports não utilizados. Se um componente ou ícone for removido do JSX, o import correspondente deve ser limpo para manter o código leve e evitar avisos do linter.

## 4. Estética Premium
Mantenha os padrões de design definidos:
- Uso de variáveis de CSS (`globals.css`).
- Efeitos de profundidade (3D/Shadows) em elementos fixos.
- Micro-animações e estados de hover consistentes.

## 5. Documentação de Código
Sempre adicione comentários explicativos no código, especialmente em componentes complexos, funções de lógica de negócio e arquivos de estilo. Isso facilita a colaboração e a manutenção futura por outros desenvolvedores.
- Use comentários JSDoc para componentes e funções principais.
- Explique o "porquê" de certas decisões de design ou lógica.
- Mantenha os comentários em português, conforme o padrão do projeto.

## 6. Padrão de Nomenclatura de Branches
Sempre que uma nova branch for criada, ela deve seguir estritamente o padrão identificando o tipo (`fix` ou `feature`), seguido por um número sequencial de 4 dígitos e o nome em inglês da funcionalidade.
**Formato:** `<tipo>/<numero_sequencial>/<nome-em-ingles>`
**Exemplos:**
- `feature/0001/sales`
- `fix/0002/login`
- `feature/0004/team-management`

## 7. Estrutura de Rotas (Route Groups)
Sempre que uma nova tela relacionada ao painel de controle (telas privadas que possuem Sidebar e Topbar) for criada, ela deve ser obrigatoriamente colocada dentro da pasta `src/app/(panel)/`. 
- Isso garante que os módulos (ex: `/finance`, `/sales`, `/settings`) fiquem organizados e não usem prefixos longos (como `/dashboard/finance`).
- Rotas públicas (como `/login` ou a `page.tsx` raiz) devem permanecer na raiz de `src/app/`.

## 8. Verificação de Dados Sensíveis
Sempre que formos finalizar o dia de trabalho, deve ser feita uma varredura para identificar se qualquer dado sensível (como arquivos .env, chaves de API, senhas ou tokens) foi exposto ou adicionado ao projeto. Caso afirmativo, esses arquivos devem ser adicionados imediatamente ao `.gitignore`, removidos do controle de versão e feito um commit com essas proteções.

---

## 9. Integração com a API Superfin

### Base URL
```
https://api.sandbox.superfin.com.br
```
> Para produção, use a variável de ambiente `NEXT_PUBLIC_API_URL`.

### Autenticação
Todas as rotas autenticadas exigem o header:
```
Authorization: Bearer <access_token>
```
O token é armazenado em `localStorage` com a chave `tronnus_token` e injetado automaticamente pelo `fetchApi` em `src/services/api/client.ts`.

---

### 9.1 Cobranças Avulsas (`/charges`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/charges` | Lista cobranças (suporta filtros via query params) |
| `GET` | `/charges/:token` | Detalhe de uma cobrança |
| `POST` | `/charges` | Cria nova cobrança |

**Query params do GET /charges:**
```
price, status, payer_name, payer_email,
expiration_date_gt, expiration_date_lt, page, per_page
```

**Body do POST /charges:**
```json
{
  "charge": {
    "description": "Nome da Cobrança",
    "expiration_date": "DD/MM/YYYY",
    "payer_name": "Nome do Pagador",
    "payer_email": "email@exemplo.com",
    "products": [
      { "name": "Produto", "price": "10.00", "quantity": "1", "description": "Opcional" }
    ]
  }
}
```

**Status possíveis:** `NOT_PAID` | `PAID` | `EXPIRED` | `CANCELLED`

---

### 9.2 Planos de Assinatura (`/subscription/plans`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/subscription/plans` | Lista planos |
| `GET` | `/subscription/plans/:token` | Detalhe de um plano |
| `POST` | `/subscription/plans` | Cria novo plano |
| `PUT` | `/subscription/plans/:token` | Atualiza plano existente |

**Body do POST /subscription/plans:**
```json
{
  "name": "Plano Mensal Premium",
  "description": "Descrição do plano",
  "price": "99.90",
  "periodicity": 1,
  "public": true
}
```

**Periodicidade (`periodicity`):**
| Valor | Significado |
|-------|-------------|
| `1` | Mensal |
| `3` | Trimestral |
| `6` | Semestral |
| `12` | Anual |

---

### 9.3 Assinaturas (`/subscription/subscriptions`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/subscription/subscriptions` | Lista assinaturas |
| `GET` | `/subscription/subscriptions/:token` | Detalhe de uma assinatura |
| `POST` | `/subscription/subscriptions` | Cria assinatura para um cliente |
| `PUT` | `/subscription/subscriptions/cancel/:token` | Cancela assinatura |

**Body do POST /subscription/subscriptions:**
```json
{
  "subscription": {
    "customer": {
      "name": "Nome do Cliente",
      "email": "email@exemplo.com",
      "document": "000.000.000-00",
      "phone": "(00) 00000-0000"
    },
    "plans": [{ "id": "<plan_token>" }]
  }
}
```

**Status possíveis:** `active` | `cancelled` | `suspended`

---

### 9.4 Faturas de Assinatura (`/subscription/invoices`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/subscription/invoices` | Lista faturas |
| `GET` | `/subscription/invoices/:token` | Detalhe de uma fatura |

**Status possíveis:** `waiting_payment` | `paid` | `expired`

---

### 9.5 Pagamentos (`/payments`)

#### Cobrança avulsa — `POST /payments`
```json
{
  "token": "<charge_token>",
  "payment_method": "credit_card",
  "customer_name": "João Silva",
  "customer_email": "joao@email.com",
  "customer_document": "000.000.000-00",
  "customer_phone": "(11) 99999-9999",
  "card_number": "4111111111111111",
  "card_holder_name": "JOAO SILVA",
  "card_expiration_date": "12/28",
  "card_cvv": "123",
  "installments": 1
}
```
> Para Pix, omita os campos de cartão. A resposta retornará `qr_code` e `qr_code_text`.

#### Primeiro pagamento de assinatura — `POST /payments/full`
```json
{
  "plan_token": "<plan_token>",
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "document": "000.000.000-00",
    "phone": "(11) 99999-9999"
  },
  "payment": {
    "method": "credit_card",
    "recurrency": true,
    "card_number": "4111111111111111",
    "card_holder_name": "JOAO SILVA",
    "card_expiration_date": "12/28",
    "card_cvv": "123",
    "installments": 1
  }
}
```

#### Pagar fatura de assinatura — `POST /payments/pay`
```json
{
  "order_type": "invoice",
  "token": "<invoice_token>",
  "customer": { "name": "...", "email": "...", "document": "..." },
  "payment": { "method": "pix" }
}
```

---

### 9.6 Camada de Serviço (onde implementar)

Toda chamada à API deve passar pelo `fetchApi` em `src/services/api/client.ts`.
Os serviços estão organizados em `src/services/api/`:

| Arquivo | Serviço exportado | Responsabilidade |
|---------|-------------------|-----------------|
| `charges.ts` | `chargesService` | Cobranças avulsas |
| `charges.ts` | `plansService` | Planos de assinatura |
| `charges.ts` | `subscriptionsService` | Assinaturas e pagamento inicial |
| `charges.ts` | `invoicesService` | Faturas de assinatura |
| `auth.ts` | `authService` | Login (email + OneID) |
| `transactions.ts` | `transactionsService` | Transações/vendas |
| `withdrawals.ts` | `withdrawalsService` | Saques |
| `bankAccounts.ts` | `bankAccountsService` | Contas bancárias |

**Nunca chame `fetch` diretamente nas páginas.** Sempre use os serviços acima via `import { api } from '@/services/api'` ou importando o serviço específico.

---

### 9.7 Convenções de Uso

- **Nunca** exponha tokens, API keys ou credenciais no código-fonte.
- Variáveis de ambiente prefixadas com `NEXT_PUBLIC_` são acessíveis no browser — use apenas para a URL base.
- Dados sensíveis do usuário (token JWT) ficam em `localStorage` com a chave `tronnus_token`.
- Em caso de erro `401`, redirecionar para `/login` e limpar o token.
- Sempre trate erros de API com `try/catch` e exiba mensagens amigáveis ao usuário.
