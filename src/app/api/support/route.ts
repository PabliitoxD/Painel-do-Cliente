import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, accountId, message } = await req.json();

    // Recupere as variáveis de ambiente
    const token = process.env.TOMTICKET_API_TOKEN;
    const departmentId = process.env.TOMTICKET_DEPARTMENT_ID;

    // Se as chaves não estiverem configuradas, simular retorno positivo (modo fallback para testes)
    if (!token || !departmentId) {
      console.warn("Chaves TOMTICKET_API_TOKEN ou TOMTICKET_DEPARTMENT_ID não configuradas. Retornando simulação.");
      return NextResponse.json({ 
        success: true, 
        message: "Chamado simulado com sucesso (modo de testes/desenvolvimento)." 
      });
    }

    // Cria os parâmetros em Form Data para a API do Tomticket
    const formData = new URLSearchParams();
    formData.append('customer_id', email);
    formData.append('customer_id_type', 'E'); // E para e-mail
    formData.append('department_id', departmentId);
    formData.append('subject', `Suporte - ID Conta: ${accountId || 'N/A'}`);
    formData.append('message', `Nome do Cliente: ${name}\nE-mail: ${email}\nID da Conta: ${accountId || 'N/A'}\n\nMensagem:\n${message}`);
    formData.append('priority', '1'); // Baixa

    const response = await fetch('https://api.tomticket.com/v2.0/ticket/new', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tomticket API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Erro ao abrir chamado no Tomticket:", err);
    return NextResponse.json({ success: false, error: err.message || "Erro desconhecido ao abrir chamado." }, { status: 500 });
  }
}
