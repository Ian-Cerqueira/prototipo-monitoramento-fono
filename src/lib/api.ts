import { supabase } from "./supabase";

export type IntegrationResult = {
  success: boolean;
  message: string;
  action?: 'LOGIN_REQUIRED' | 'CHECK_CPF' | 'RETRY' | 'NONE';
};

export async function connectToEdge(prontuarioId: string): Promise<IntegrationResult> {
  try {
    console.log(`📡 Enviando prontuário ${prontuarioId}...`);

    // Agora o 'error' só vem se a internet cair ou o servidor explodir (500)
    // Erros de negócio (Login, CPF) virão dentro de 'data'
    const { data, error } = await supabase.functions.invoke('postTiSaude', {
      body: { record_id: prontuarioId }
    });

    if (error) {
      console.error('❌ Erro de Infraestrutura:', error);
      return { success: false, message: "Falha de conexão com o servidor.", action: 'RETRY' };
    }

    if (data && data.success === false) {
      const msg = data.error || "Erro desconhecido";
      console.warn("⚠️ Erro de Negócio retornado:", msg);

      if (msg.includes("401") || msg.includes("TiSaude") || msg.includes("Token")) {
        return {
           success: false, 
           message: "Sessão do TiSaude expirada. Faça login novamente.", 
           action: 'LOGIN_REQUIRED' 
        };
      }

      if (msg.includes("CPF") || msg.includes("encontrado")) {
        return { 
           success: false, 
           message: "CPF não encontrado no sistema externo.", 
           action: 'CHECK_CPF' 
        };
      }

      return { success: false, message: msg, action: 'RETRY' };
    }

    return { success: true, message: "Integração realizada com sucesso!", action: 'NONE' };

  } catch (err: any) {
    console.error('Erro local:', err);
    return { success: false, message: "Erro inesperado na aplicação.", action: 'RETRY' };
  }
}