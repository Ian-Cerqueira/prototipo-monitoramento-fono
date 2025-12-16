import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TiSaudeLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // O modal devolve o token (string) para quem o chamou
  onSuccess: (token: string) => void; 
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
      // 1. Chama a Edge Function apenas para pegar o token
      const { data, error } = await supabase.functions.invoke('hyper-task', {
        body: { login: login, password: password }
      });

      if (error) throw error;
      if (!data || !data.token) throw new Error('Token não retornado pela API.');

      console.log("✅ [Modal] Token capturado. Devolvendo ao Dashboard...");

      // 2. Passa o token para o componente pai e fecha
      onSuccess(data.token);
      onOpenChange(false);

    } catch (err: any) {
      console.error(err);
      const msg = err.context?.json?.error || err.message || "Erro ao fazer login.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[9998] bg-black/90" />
        
        <DialogPrimitive.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="
            fixed left-[50%] top-[50%] z-[9999]
            w-[90vw] max-w-[350px]
            translate-x-[-50%] translate-y-[-50%]
            rounded-xl bg-white shadow-2xl border border-gray-200 focus:outline-none
          "
        >
          <div className="bg-slate-900 px-6 py-6 rounded-t-xl text-center">
            <DialogPrimitive.Title className="text-xl font-bold text-white m-0">
              Login TiSaude
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-slate-300 mt-2 text-sm m-0">
              Sessão expirada. Autentique-se para continuar.
            </DialogPrimitive.Description>
          </div>

          <form onSubmit={handleLogin} className="p-6 grid gap-4">
            <div className="grid gap-2">
              <Label className="text-slate-700 font-bold">Usuário</Label>
              <Input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="h-11 border-slate-400"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-700 font-bold">Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-slate-400"
                required
              />
            </div>

            {errorMsg && (
              <div className="text-red-600 text-sm font-bold text-center bg-red-100 p-2 rounded">
                {errorMsg}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg">
              {loading ? 'Autenticando...' : 'ENTRAR'}
            </Button>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}