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
