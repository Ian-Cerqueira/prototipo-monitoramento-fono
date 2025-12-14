import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { EstagiarioDashboard } from './components/EstagiarioDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';

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
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
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
