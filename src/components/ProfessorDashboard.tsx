import { useState } from 'react';
import { User, Prontuario } from '../App';
import { LogOut, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RevisionForm } from './RevisionForm';

interface ProfessorDashboardProps {
  user: User;
  onLogout: () => void;
}

// Mock data - mesmos prontuários do estagiário
const initialProntuarios: Prontuario[] = [
  {
    id: '1',
    pacienteNome: 'Ana Paula Costa',
    pacienteCPF: '123.456.789-00',
    pacienteDataNascimento: '1985-03-15',
    pacienteTelefone: '(11) 98765-4321',
    queixaPrincipal: 'Rouquidão persistente há 3 meses',
    historiaDoenca: 'Paciente professora de ensino fundamental relata rouquidão que se intensifica ao longo do dia, principalmente após muitas horas de aula. Nega dor ou desconforto à deglutição. Refere uso vocal intenso durante o trabalho sem técnicas de aquecimento vocal.',
    avaliacao_fono: 'Qualidade vocal: rouca, soprosa. Pitch rebaixado. Loudness adequada. Ressonância equilibrada. Sem sinais de tensão cervical.',
    hipoteseDiagnostica: 'Disfonia comportamental por uso vocal inadequado',
    plano_terapeutico: 'Terapia vocal com técnicas de higiene vocal, exercícios de aquecimento e desaquecimento vocal. Orientações sobre hidratação e uso adequado da voz profissional. 12 sessões, 2x por semana.',
    observacoes: 'Paciente orientada sobre a importância do repouso vocal. Sugerido avaliação otorrinolaringológica.',
    criadoPor: '1',
    criadoPorNome: 'João Silva',
    dataAtendimento: '2025-12-01',
    status: 'aprovado',
    feedback: 'Excelente anamnese! A conduta está adequada. Lembre-se de incluir orientações sobre postura durante o uso vocal.',
    revisadoPor: '2',
    revisadoPorNome: 'Dra. Maria Santos',
    dataRevisao: '2025-12-02'
  },
  {
    id: '2',
    pacienteNome: 'Miguel Henrique Santos',
    pacienteCPF: '987.654.321-00',
    pacienteDataNascimento: '2019-07-20',
    pacienteTelefone: '(11) 91234-5678',
    queixaPrincipal: 'Dificuldade na pronúncia de alguns sons',
    historiaDoenca: 'Criança de 6 anos trazida pela mãe com queixa de troca de sons na fala. Apresenta dificuldade principalmente nos fonemas /r/ e /l/. Desenvolvimento motor e cognitivo adequados para a idade. Sem intercorrências no período gestacional ou perinatal.',
    avaliacao_fono: 'Linguagem receptiva preservada. Vocabulário adequado para idade. Articulação: substituição sistemática de /r/ por /l/ (rotacismo). Motricidade orofacial sem alterações significativas. Respiração nasal.',
    hipoteseDiagnostica: 'Transtorno fonológico - distúrbio articulatório',
    plano_terapeutico: 'Terapia fonoaudiológica com foco em consciência fonológica e treino articulatório. Exercícios de motricidade orofacial. Orientação aos pais.',
    observacoes: '',
    criadoPor: '1',
    criadoPorNome: 'João Silva',
    dataAtendimento: '2025-12-03',
    status: 'pendente'
  },
  {
    id: '3',
    pacienteNome: 'Carlos Eduardo Mendes',
    pacienteCPF: '456.789.123-00',
    pacienteDataNascimento: '2017-11-08',
    pacienteTelefone: '(11) 97654-3210',
    queixaPrincipal: 'Gagueira',
    historiaDoenca: 'Apresenta disfluências há 2 meses',
    avaliacao_fono: 'Fala com bloqueios e repetições',
    hipoteseDiagnostica: 'Gagueira do desenvolvimento',
    plano_terapeutico: 'Terapia de fluência',
    observacoes: 'Encaminhar para avaliação neurológica',
    criadoPor: '1',
    criadoPorNome: 'João Silva',
    dataAtendimento: '2025-12-04',
    status: 'recusado',
    feedback: 'História clínica insuficiente. Preciso de mais informações: quando começou exatamente? Há fatores desencadeantes? Como é o ambiente familiar? Qual o tipo de disfluência (bloqueios, prolongamentos, repetições)? Frequência e gravidade? Há consciência do problema pela criança? Por favor, refaça com anamnese completa e avaliação detalhada da fluência.',
    revisadoPor: '2',
    revisadoPorNome: 'Dra. Maria Santos',
    dataRevisao: '2025-12-05'
  },
  {
    id: '4',
    pacienteNome: 'Beatriz Oliveira Santos',
    pacienteCPF: '321.654.987-00',
    pacienteDataNascimento: '2020-03-15',
    pacienteTelefone: '(11) 93456-7890',
    queixaPrincipal: 'Atraso no desenvolvimento da linguagem',
    historiaDoenca: 'Criança de 4 anos e 9 meses com histórico de poucas palavras e frases simples. Mãe relata que a criança comunica-se mais por gestos do que por palavras. Primeiras palavras surgiram apenas aos 2 anos e meio. Sem histórico de otites de repetição. Desenvolvimento motor adequado.',
    avaliacao_fono: 'Vocabulário expressivo reduzido (aproximadamente 50 palavras). Produz frases de 2 elementos. Compreensão verbal preservada para idade. Atenção compartilhada presente. Contato visual adequado. Ausência de estereotipias.',
    hipoteseDiagnostica: 'Atraso de linguagem expressiva',
    plano_terapeutico: 'Terapia fonoaudiológica com estimulação de linguagem expressiva, ampliação de vocabulário e estruturação frasal. Orientação familiar para estimulação em ambiente domiciliar. Sessões 2x por semana.',
    observacoes: 'Solicitada avaliação audiológica completa. Considerar avaliação neuropsicológica.',
    criadoPor: '1',
    criadoPorNome: 'João Silva',
    dataAtendimento: '2025-11-28',
    status: 'aprovado',
    feedback: 'Boa avaliação! A conduta está apropriada. Continue observando a evolução e documentando os progressos.',
    revisadoPor: '2',
    revisadoPorNome: 'Dra. Maria Santos',
    dataRevisao: '2025-11-29'
  }
];

export function ProfessorDashboard({ user, onLogout }: ProfessorDashboardProps) {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>(initialProntuarios);
  const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'recusado'>('pendente');

  const handleReview = (prontuarioId: string, status: 'aprovado' | 'recusado', feedback: string) => {
    setProntuarios(prontuarios.map(p =>
      p.id === prontuarioId
        ? {
            ...p,
            status,
            feedback,
            revisadoPor: user.id,
            revisadoPorNome: user.name,
            dataRevisao: new Date().toISOString().split('T')[0]
          }
        : p
    ));
    setSelectedProntuario(null);
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
                      Atendimento em {new Date(prontuario.dataAtendimento).toLocaleDateString('pt-BR')} por {prontuario.criadoPorNome}
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