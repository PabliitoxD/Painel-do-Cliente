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
