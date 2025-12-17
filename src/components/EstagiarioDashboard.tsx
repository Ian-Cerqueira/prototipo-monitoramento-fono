import { useEffect, useState } from 'react';
import { User, Prontuario } from '../App';
import { LogOut, Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ProntuarioForm } from './ProntuarioForm';
import { supabase } from '../lib/supabase';

interface EstagiarioDashboardProps {
  user: User;
  onLogout: () => void;
}

export function EstagiarioDashboard({ user, onLogout }: EstagiarioDashboardProps) {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingProntuario, setEditingProntuario] = useState<Prontuario | null>(null);
  const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);

  useEffect(() => {
    fetchProntuarios();
  }, []);

  async function fetchProntuarios() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prontuarios')
        .select('*')
        //.eq('criado_por', user.id) // Descomente quando quiser filtrar
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const prontuariosFormatados = data.map((item: any) => ({
          id: item.id,
          // Mapeamento Banco -> Interface
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
          revisadoPor: item.revisado_por, // Adicionei caso precise no futuro
          revisadoPorNome: item.revisado_por_nome, // Adicionei caso precise no futuro
          dataRevisao: item.data_revisao // Adicionei caso precise no futuro
        }));
        
        setProntuarios(prontuariosFormatados);
      }
    } catch (error) {
      console.error('Erro ao buscar prontuários:', error);
      alert('Erro ao carregar seus prontuários.');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProntuario = async (prontuario: Omit<Prontuario, 'id' | 'criadoPor' | 'criadoPorNome' | 'status'>) => {
    // Mapeamento Interface -> Banco
    const dadosProntuarioParaBanco = {
      paciente_nome: prontuario.pacienteNome,
      paciente_cpf: prontuario.pacienteCPF,
      paciente_data_nascimento: prontuario.pacienteDataNascimento,
      paciente_telefone: prontuario.pacienteTelefone,
      data_atendimento: prontuario.dataAtendimento,
      queixa_principal: prontuario.queixaPrincipal,
      historia_doenca: prontuario.historiaDoenca,
      avaliacao_fono: prontuario.avaliacao_fono,
      hipotese_diagnostica: prontuario.hipoteseDiagnostica,
      plano_terapeutico: prontuario.plano_terapeutico,
      observacoes: prontuario.observacoes
    };

    try {
      if (editingProntuario) {
        // Editar
        if(editingProntuario.status === 'aprovado') {
          alert('Não é possível editar um documento aprovado');
          return;
        }
        const { error } = await supabase
          .from('prontuarios')
          .update({
            ...dadosProntuarioParaBanco,
            status: 'pendente',
            feedback: null,
            data_revisao: null
          })
          .eq('id', editingProntuario.id);
        
        if(error) throw error;

      } else {
        // Criar
        const { error } = await supabase
          .from('prontuarios')
          .insert({
            ...dadosProntuarioParaBanco,
            criado_por: user.id,
            criado_por_nome: user.name,
            status: 'pendente'
          });
  
        if(error) throw error;
      }
      
      await fetchProntuarios();
      setShowForm(false);
      setEditingProntuario(null);
      
    } catch (error: any) {
       console.error('Erro ao salvar:', error);
       alert('Erro ao salvar: ' + error.message);
    }
  };

  const handleEdit = (prontuario: Prontuario) => {
    setEditingProntuario(prontuario);
    setShowForm(true);
    setSelectedProntuario(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'recusado': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'recusado': return 'Recusado';
      default: return 'Pendente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'recusado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (showForm) {
    return (
      <ProntuarioForm
        user={user}
        prontuario={editingProntuario}
        onSave={handleSaveProntuario}
        onCancel={() => {
          setShowForm(false);
          setEditingProntuario(null);
        }}
      />
    );
  }

  if (selectedProntuario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-gray-800">Detalhes do Prontuário</h1>
            <button
              onClick={() => setSelectedProntuario(null)}
              className="text-blue-600 hover:text-blue-700"
            >
              Voltar
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(selectedProntuario.status)}`}>
                  {getStatusIcon(selectedProntuario.status)}
                  <span>{getStatusText(selectedProntuario.status)}</span>
                </div>
              </div>
              {(selectedProntuario.status === 'pendente' || selectedProntuario.status === 'recusado') && (
                <button
                  onClick={() => handleEdit(selectedProntuario)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Editar Prontuário
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-gray-800 mb-4">Dados do Paciente</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nome Completo</p>
                    <p className="text-gray-800">{selectedProntuario.pacienteNome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CPF</p>
                    <p className="text-gray-800">{selectedProntuario.pacienteCPF}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data de Nascimento</p>
                    {/* CORREÇÃO 1: Timezone UTC */}
                    <p className="text-gray-800">
                      {new Date(selectedProntuario.pacienteDataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="text-gray-800">{selectedProntuario.pacienteTelefone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-gray-800 mb-4">Informações Clínicas</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Data do Atendimento</p>
                    {/* CORREÇÃO 2: Timezone UTC */}
                    <p className="text-gray-800">
                      {new Date(selectedProntuario.dataAtendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Queixa Principal</p>
                    <p className="text-gray-800">{selectedProntuario.queixaPrincipal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">História da Doença Atual</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedProntuario.historiaDoenca}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avaliação Fonoaudiológica</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedProntuario.avaliacao_fono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hipótese Diagnóstica</p>
                    <p className="text-gray-800">{selectedProntuario.hipoteseDiagnostica}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plano Terapêutico</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedProntuario.plano_terapeutico}</p>
                  </div>
                  {selectedProntuario.observacoes && (
                    <div>
                      <p className="text-sm text-gray-600">Observações</p>
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedProntuario.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedProntuario.feedback && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-gray-800 mb-4">Feedback do Professor</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedProntuario.feedback}</p>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-sm text-gray-600">
                        Revisado por: {selectedProntuario.revisadoPorNome} em {selectedProntuario.dataRevisao ? new Date(selectedProntuario.dataRevisao).toLocaleDateString('pt-BR') : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-gray-800">Meus Prontuários</h1>
            <p className="text-gray-600">Bem-vindo, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Novo Prontuário
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid gap-4">
          {prontuarios.map((prontuario) => (
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
                      {/* CORREÇÃO 3: Timezone UTC */}
                      Atendimento em {new Date(prontuario.dataAtendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
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
                  <p className="text-sm text-gray-600 mb-1">Feedback do professor:</p>
                  <p className="text-gray-700 line-clamp-2">{prontuario.feedback}</p>
                </div>
              )}
            </div>
          ))}

          {prontuarios.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum prontuário encontrado</p>
              <p className="text-gray-500 text-sm">Clique em &quot;Novo Prontuário&quot; para começar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}