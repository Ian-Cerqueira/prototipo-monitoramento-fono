import { useState } from 'react';
import { supabase } from '../lib/supabase';
// Certifique-se que o caminho abaixo está correto para o seu projeto
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TiSaudeLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TiSaudeLoginModal({ open, onOpenChange, onSuccess }: TiSaudeLoginModalProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('login-externo', {
        body: { 
            email_externo: login, 
            senha_externa: password 
        }
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      alert("✅ Conectado com sucesso!");
      onOpenChange(false);
      if (onSuccess) onSuccess();

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        // 1. BLOQUEIOS: Impede fechar clicando fora ou apertando ESC
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        
        // 2. CSS AGRESSIVO:
        className="
          /* POSICIONAMENTO: Força o centro da tela ignorando animações */
          fixed 
          top-[50%] 
          left-[50%] 
          !translate-x-[-50%] 
          !translate-y-[-50%] 
          z-50

          /* FORMATO RETRATO (Estilo Mobile Card): */
          w-[90vw]       /* Ocupa 90% da tela no celular */
          max-w-[320px]  /* Trava em 320px no desktop (bem estreito/alto) */
          rounded-xl 
          border 
          bg-white 
          shadow-2xl 
          p-0 
          gap-0

          /* REMOVE O BOTÃO 'X': Esconde qualquer botão filho direto do container */
          [&>button]:hidden
        "
      >
        
        {/* Cabeçalho */}
        <div className="bg-slate-50 px-6 py-8 border-b border-slate-100 flex flex-col items-center text-center rounded-t-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800 text-center">
              Integração TiSaude
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-3 text-sm text-center leading-relaxed">
              Para sua segurança, faça login para continuar aprovando prontuários.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="p-6 grid gap-6">
          
          <div className="grid gap-2">
            <Label htmlFor="ts-login" className="text-slate-700 font-semibold ml-1">
              Usuário
            </Label>
            <Input
              id="ts-login"
              type="text" 
              placeholder="Ex: professor.silva"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="h-12 text-lg" // Input mais alto para toque
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ts-password"className="text-slate-700 font-semibold ml-1">
              Senha
            </Label>
            <Input
              id="ts-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 text-lg"
            />
          </div>

          {errorMsg && (
            <div className="text-sm text-red-600 font-medium text-center bg-red-50 p-3 rounded-md border border-red-100">
              {errorMsg}
            </div>
          )}

          <DialogFooter className="mt-2">
            {/* Apenas o botão de conectar. Botão cancelar foi removido. */}
            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold shadow-md">
              {loading ? 'Verificando...' : 'Entrar no Sistema'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}