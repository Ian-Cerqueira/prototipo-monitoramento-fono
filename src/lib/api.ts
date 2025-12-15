import { supabase } from "./supabase";


export async function connectToEdge(prontuarioId: string) {
    //const edge_function_url = 'https://fesxpuopelzwjuwpkinw.supabase.co/functions/v1/postTiSaude';
    try {
        const { data, error } = await supabase.functions.invoke('postTiSaude', {
            body: { record_id: prontuarioId }
        });

        if(error) {
            throw error;
        }

        return true;
    } catch(err: any) {
        console.log('erro em connect to edge', err);
        return false;
    }
}