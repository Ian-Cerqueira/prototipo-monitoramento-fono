import { useEffect, useState } from 'react';
import { User, Prontuario } from '../App';
import { LogOut, Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ProntuarioForm } from './ProntuarioForm';
import { supabase } from '../lib/supabase';

interface EstagiarioDashboardProps {
  user: User;
  onLogout: () => void;
}

// Mock data
// const initialProntuarios: Prontuario[] = [
//   {
//     id: '1',
//     pacienteNome: 'Ana Paula Costa',
//     pacienteCPF: '123.456.789-00',
//     pacienteDataNascimento: '1985-03-15',
//     pacienteTelefone: '(11) 98765-4321',
//     queixaPrincipal: 'Rouquidão persistente há 3 meses',
//     historiaDoenca: 'Paciente professora de ensino fundamental relata rouquidão que se intensifica ao longo do dia, principalmente após muitas horas de aula. Nega dor ou desconforto à deglutição. Refere uso vocal intenso durante o trabalho sem técnicas de aquecimento vocal.',
//     exameFisico: 'Qualidade vocal: rouca, soprosa. Pitch rebaixado. Loudness adequada. Ressonância equilibrada. Sem sinais de tensão cervical.',
//     hipoteseDiagnostica: 'Disfonia comportamental por uso vocal inadequado',
//     conduta: 'Terapia vocal com técnicas de higiene vocal, exercícios de aquecimento e desaquecimento vocal. Orientações sobre hidratação e uso adequado da voz profissional. 12 sessões, 2x por semana.',
//     observacoes: 'Paciente orientada sobre a importância do repouso vocal. Sugerido avaliação otorrinolaringológica.',
//     criadoPor: '1',
//     criadoPorNome: 'João Silva',
//     dataAtendimento: '2025-12-01',
//     status: 'aprovado',
//     feedback: 'Excelente anamnese! A conduta está adequada. Lembre-se de incluir orientações sobre postura durante o uso vocal.',
//     revisadoPor: '2',
//     revisadoPorNome: 'Dra. Maria Santos',
//     dataRevisao: '2025-12-02'
//   },
//   {
//     id: '2',
//     pacienteNome: 'Miguel Henrique Santos',
//     pacienteCPF: '987.654.321-00',
//     pacienteDataNascimento: '2019-07-20',
//     pacienteTelefone: '(11) 91234-5678',
//     queixaPrincipal: 'Dificuldade na pronúncia de alguns sons',
//     historiaDoenca: 'Criança de 6 anos trazida pela mãe com queixa de troca de sons na fala. Apresenta dificuldade principalmente nos fonemas /r/ e /l/. Desenvolvimento motor e cognitivo adequados para a idade. Sem intercorrências no período gestacional ou perinatal.',
//     exameFisico: 'Linguagem receptiva preservada. Vocabulário adequado para idade. Articulação: substituição sistemática de /r/ por /l/ (rotacismo). Motricidade orofacial sem alterações significativas. Respiração nasal.',
//     hipoteseDiagnostica: 'Transtorno fonológico - distúrbio articulatório',
//     conduta: 'Terapia fonoaudiológica com foco em consciência fonológica e treino articulatório. Exercícios de motricidade orofacial. Orientação aos pais.',
//     observacoes: '',
//     criadoPor: '1',
//     criadoPorNome: 'João Silva',
//     dataAtendimento: '2025-12-03',
//     status: 'pendente'
//   },
//   {
//     id: '3',
//     pacienteNome: 'Carlos Eduardo Mendes',
//     pacienteCPF: '456.789.123-00',
//     pacienteDataNascimento: '2017-11-08',
//     pacienteTelefone: '(11) 97654-3210',
//     queixaPrincipal: 'Gagueira',
//     historiaDoenca: 'Apresenta disfluências há 2 meses',
//     exameFisico: 'Fala com bloqueios e repetições',
//     hipoteseDiagnostica: 'Gagueira do desenvolvimento',
//     conduta: 'Terapia de fluência',
//     observacoes: 'Encaminhar para avaliação neurológica',
//     criadoPor: '1',
//     criadoPorNome: 'João Silva',
//     dataAtendimento: '2025-12-04',
//     status: 'recusado',
//     feedback: 'História clínica insuficiente. Preciso de mais informações: quando começou exatamente? Há fatores desencadeantes? Como é o ambiente familiar? Qual o tipo de disfluência (bloqueios, prolongamentos, repetições)? Frequência e gravidade? Há consciência do problema pela criança? Por favor, refaça com anamnese completa e avaliação detalhada da fluência.',
//     revisadoPor: '2',
//     revisadoPorNome: 'Dra. Maria Santos',
//     dataRevisao: '2025-12-05'
//   },
//   {
//     id: '4',
//     pacienteNome: 'Beatriz Oliveira Santos',
//     pacienteCPF: '321.654.987-00',
//     pacienteDataNascimento: '2020-03-15',
//     pacienteTelefone: '(11) 93456-7890',
//     queixaPrincipal: 'Atraso no desenvolvimento da linguagem',
//     historiaDoenca: 'Criança de 4 anos e 9 meses com histórico de poucas palavras e frases simples. Mãe relata que a criança comunica-se mais por gestos do que por palavras. Primeiras palavras surgiram apenas aos 2 anos e meio. Sem histórico de otites de repetição. Desenvolvimento motor adequado.',
//     exameFisico: 'Vocabulário expressivo reduzido (aproximadamente 50 palavras). Produz frases de 2 elementos. Compreensão verbal preservada para idade. Atenção compartilhada presente. Contato visual adequado. Ausência de estereotipias.',
//     hipoteseDiagnostica: 'Atraso de linguagem expressiva',
//     conduta: 'Terapia fonoaudiológica com estimulação de linguagem expressiva, ampliação de vocabulário e estruturação frasal. Orientação familiar para estimulação em ambiente domiciliar. Sessões 2x por semana.',
//     observacoes: 'Solicitada avaliação audiológica completa. Considerar avaliação neuropsicológica.',
//     criadoPor: '1',
//     criadoPorNome: 'João Silva',
//     dataAtendimento: '2025-11-28',
//     status: 'aprovado',
//     feedback: 'Boa avaliação! A conduta está apropriada. Continue observando a evolução e documentando os progressos.',
//     revisadoPor: '2',
//     revisadoPorNome: 'Dra. Maria Santos',
//     dataRevisao: '2025-11-29'
//   }
// ];

export function EstagiarioDashboard({ user, onLogout }: EstagiarioDashboardProps) {
  // --- 1. ESTADOS (Mude o valor inicial para array vazio []) ---
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]); // Começa vazio!
  const [loading, setLoading] = useState(true); // Novo estado de loading
  
  const [showForm, setShowForm] = useState(false);
  const [editingProntuario, setEditingProntuario] = useState<Prontuario | null>(null);
  const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);

  // --- 2. O EFEITO (Roda assim que a tela abre) ---
  useEffect(() => {
    fetchProntuarios();
  }, []);

  // --- 3. A FUNÇÃO DE BUSCA (Chama o Supabase) ---
  async function fetchProntuarios() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prontuarios')
        .select('*')
        //.eq('criado_por', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProntuarios(data as any);
      }
    } catch (error) {
      console.error('Erro ao buscar prontuários:', error);
      alert('Erro ao carregar seus prontuários.');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProntuario = async (prontuario: Omit<Prontuario, 'id' | 'criadoPor' | 'criadoPorNome' | 'status'>) => {
    if (editingProntuario) {
      // Editar prontuário existente
      const { error } = supabase
        .from('prontuarios')
        .update
        
    } else {
      // Criar novo prontuário
      const newProntuario: Prontuario = {
        ...prontuario,
        id: Date.now().toString(),
        criadoPor: user.id,
        criadoPorNome: user.name,
        status: 'pendente'
      };
      setProntuarios([newProntuario, ...prontuarios]);
    }
    setShowForm(false);
    setEditingProntuario(null);
  };

  const handleEdit = (prontuario: Prontuario) => {
    setEditingProntuario(prontuario);
    setShowForm(true);
    setSelectedProntuario(null);
  };

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
                    <p className="text-gray-800">{new Date(selectedProntuario.pacienteDataNascimento).toLocaleDateString('pt-BR')}</p>
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
                    <p className="text-gray-800">{new Date(selectedProntuario.dataAtendimento).toLocaleDateString('pt-BR')}</p>
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
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedProntuario.exameFisico}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hipótese Diagnóstica</p>
                    <p className="text-gray-800">{selectedProntuario.hipoteseDiagnostica}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plano Terapêutico</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedProntuario.conduta}</p>
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
                      Atendimento em {new Date(prontuario.dataAtendimento).toLocaleDateString('pt-BR')}
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