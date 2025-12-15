import { useState } from 'react';
import { User, Prontuario } from '../App';
import { LogOut, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RevisionForm } from './RevisionForm';
import { supabase } from '../lib/supabase';

interface ProfessorDashboardProps {
  user: User;
  onLogout: () => void;
}

// Mock data - mesmos prontuários do estagiário
const { data, error } = await supabase
      .from('prontuarios')
      .select('*')
      .order('created_at', { ascending: false });
    
const prontuariosFormatados = data.map((item: any) => ({
  id: item.id,
  pacienteNome: item.paciente_nome,
  pacienteCPF: item.paciente_cpf,
  pacienteDataNascimento: item.paciente_data_nascimento,
  pacienteTelefone: item.paciente_telefone,
  dataAtendimento: item.data_atendimento,
  queixaPrincipal: item.queixa_principal,
  historiaDoenca: item.historia_doenca,
  avaliacao_fono: item.avaliacao_fono, 
  hipoteseDiagnostica: item.hipotese_diagnostica,
  plano_terapeutico: item.plano_terapeutico,
  observacoes: item.observacoes,
  criadoPor: item.criado_por,
  criadoPorNome: item.criado_por_nome,
  status: item.status,
  feedback: item.feedback,
  revisadoPor: item.revisado_por,
  revisadoPorNome: item.revisado_por_nome,
  dataRevisao: item.data_revisao
}));

export function ProfessorDashboard({ user, onLogout }: ProfessorDashboardProps) {
  const [prontuarios, setProntuarios] = useState<any>(prontuariosFormatados);
  const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'recusado'>('pendente');

  async function fetchProntuarios() {
    try {
      const { data, error } = await supabase
        .from('prontuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const prontuariosFormatados = data.map((item: any) => ({
          id: item.id,
          pacienteNome: item.paciente_nome,
          pacienteCPF: item.paciente_cpf,
          pacienteDataNascimento: item.paciente_data_nascimento,
          pacienteTelefone: item.paciente_telefone,
          dataAtendimento: item.data_atendimento,
          queixaPrincipal: item.queixa_principal,
          historiaDoenca: item.historia_doenca,
          avaliacao_fono: item.avaliacao_fono, 
          hipoteseDiagnostica: item.hipotese_diagnostica,
          plano_terapeutico: item.plano_terapeutico,
          observacoes: item.observacoes,
          criadoPor: item.criado_por,
          criadoPorNome: item.criado_por_nome,
          status: item.status,
          feedback: item.feedback,
          revisadoPor: item.revisado_por,
          revisadoPorNome: item.revisado_por_nome,
          dataRevisao: item.data_revisao
        }));
        
        setProntuarios(prontuariosFormatados);
      }
    } catch (error) {
      console.error('Erro ao buscar prontuários:', error);
      alert('Erro ao carregar seus prontuários.');
    }
  }

  const handleReview = async (prontuarioId: string, status: 'aprovado' | 'recusado', feedback: string) => {
    try {
      // 1. Envia para o Supabase (Banco de Dados)
      const { error } = await supabase
        .from('prontuarios')
        .update({
          status: status,
          feedback: feedback,
          // Mapeamento para snake_case (como está no banco)
          revisado_por: user.id,
          revisado_por_nome: user.name,
          data_revisao: new Date().toISOString()
        })
        .eq('id', prontuarioId); // Onde o ID for igual ao do prontuário

      if (error) throw error;
      
      // 3. Fecha a tela de detalhes
      setSelectedProntuario(null);
      alert(`Prontuário ${status} com sucesso!`);
      fetchProntuarios();

    } catch (error: any) {
      console.error('Erro ao salvar revisão:', error);
      alert('Erro ao salvar: ' + error.message);
    }
};

  const filteredProntuarios = filter === 'todos' 
    ? prontuarios 
    : prontuarios.filter(p => p.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'recusado':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'recusado':
        return 'Recusado';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'recusado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const pendingCount = prontuarios.filter(p => p.status === 'pendente').length;

  if (selectedProntuario) {
    return (
      <RevisionForm
        user={user}
        prontuario={selectedProntuario}
        onReview={handleReview}
        onCancel={() => setSelectedProntuario(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-gray-800">Revisão de Prontuários</h1>
            <p className="text-gray-600">Bem-vindo, {user.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('pendente')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pendente'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('aprovado')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'aprovado'
                ? 'bg-green-100 text-green-800'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Aprovados
          </button>
          <button
            onClick={() => setFilter('recusado')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'recusado'
                ? 'bg-red-100 text-red-800'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Recusados
          </button>
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'todos'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
        </div>

        <div className="grid gap-4">
          {filteredProntuarios.map((prontuario) => (
            <div
              key={prontuario.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProntuario(prontuario)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-gray-800">{prontuario.pacienteNome}</h3>
                    <p className="text-sm text-gray-600">
                      Atendimento em {new Date(prontuario.dataAtendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} por {prontuario.criadoPorNome}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(prontuario.status)}`}>
                  {getStatusIcon(prontuario.status)}
                  <span className="text-sm">{getStatusText(prontuario.status)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Queixa:</strong> {prontuario.queixaPrincipal}
                </p>
                <p className="text-gray-700">
                  <strong>Hipótese Diagnóstica:</strong> {prontuario.hipoteseDiagnostica}
                </p>
              </div>

              {prontuario.feedback && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Seu feedback:</p>
                  <p className="text-gray-700 line-clamp-2">{prontuario.feedback}</p>
                </div>
              )}
            </div>
          ))}

          {filteredProntuarios.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum prontuário encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}