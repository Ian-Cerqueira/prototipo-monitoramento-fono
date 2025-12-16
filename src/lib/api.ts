import { supabase } from "./supabase";


export async function connectToEdge(prontuarioId: string): Promise<{}> {
    //const edge_function_url = 'https://fesxpuopelzwjuwpkinw.supabase.co/functions/v1/postTiSaude';
    try {
        const { data, error } = await supabase.functions.invoke('postTiSaude', {
            body: { record_id: prontuarioId }
        });

        if(error) {
            console.log('erro na execucao da edge function');
            let errorMessage = '';
            if(error instanceof Error) {
                errorMessage = error.message;
            }

            if (errorMessage.includes("não conectou") || errorMessage.includes("Token")) {
                return {
                    success: false,
                    message: "Você precisa conectar sua conta do TiSaude antes de aprovar.",
                    action: 'LOGIN_REQUIRED'
                };
            }

            if (errorMessage.includes("não encontrado") || errorMessage.includes("CPF")) {
                return {
                    success: false,
                    message: "O CPF deste paciente não foi encontrado no TiSaude. Verifique o cadastro.",
                    action: 'CHECK_CPF'
                };
            }

            return {
                success: false,
                message: "outro Erro durante a execucao da edge function",
                action: 'RETRY'
            };
        
        }

        return {
            success: true,
            message: "Documento enviado para o tisaude",
            action: 'NONE'
        };

    } catch(err: any) {
        console.log('erro em conexão a edge function', err);
        return {
            success: false,
            message: "Erro na conexão com a edge function",
            action: 'RETRY'
        };
    }
}