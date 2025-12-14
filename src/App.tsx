import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LoginScreen } from './components/LoginScreen';
import { EstagiarioDashboard } from './components/EstagiarioDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { Loader2 } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  role: 'estagiario' | 'professor';
  email: string;
}

export interface Prontuario {
  id: string;
  pacienteNome: string;
  pacienteCPF: string;
  pacienteDataNascimento: string;
  pacienteTelefone: string;
  queixaPrincipal: string;
  historiaDoenca: string;
  exameFisico: string;
  hipoteseDiagnostica: string;
  conduta: string;
  observacoes: string;
  criadoPor: string;
  criadoPorNome: string;
  dataAtendimento: string;
  status: 'pendente' | 'aprovado' | 'recusado';
  feedback?: string;
  revisadoPor?: string;
  revisadoPorNome?: string;
  dataRevisao?: string;
  urlPublicacao?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id, session.user.email!);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setLoading(false);
    }
  }

  async function fetchProfile(userId: string, email: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          role: data.role as 'estagiario' | 'professor',
          email: email
        });
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      // Se der erro, desloga por segurança
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'estagiario' ? (
        <EstagiarioDashboard user={user} onLogout={handleLogout} />
      ) : (
        <ProfessorDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;