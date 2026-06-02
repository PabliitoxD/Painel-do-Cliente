<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Isolamento de Branches
Sempre garanta que a branch ativa corresponda estritamente ao assunto/tarefa em desenvolvimento. Se o escopo ou assunto do trabalho mudar, **crie ou mude para uma nova branch adequada** seguindo o formato `<tipo>/<numero_sequencial>/<nome-em-ingles>` antes de realizar qualquer modificação ou commit.

# Proibição de Mocks e Integração 100% Real
* **Sem Mocks nas APIs:** É terminantemente proibido o uso de `Promise.resolve` ou estruturas estáticas/fakes de retorno na camada de serviços (`src/services/api/`) para simular o backend. Toda integração de API deve ser 100% real, batendo de ponta a ponta no ambiente configurado.
* **Consentimento Prévio:** Qualquer mock temporário de desenvolvimento ou fallback deve ser previamente acordado com o usuário.

