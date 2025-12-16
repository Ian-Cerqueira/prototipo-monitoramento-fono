import { useState, useEffect } from 'react';
import { User, Prontuario } from '../App';
import { LogOut, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RevisionForm } from './RevisionForm';
import { supabase } from '../lib/supabase';
import { connectToEdge } from '../lib/api';
import { TiSaudeLoginModal } from './tiSaudeLoginModal';

interface ProfessorDashboardProps {
  user: User;
  onLogout: () => void;
}
//
export function ProfessorDashboard({ user, onLogout }: ProfessorDashboardProps) {
  // Estado dos dados
  const [prontuarios, setProntuarios] = useState<any[]>([]);
  const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'recusado'>('pendente');
  
  // Estado do Modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // NOVO: Guarda o ID do prontuário que ficou pendente enquanto fazemos login
  const [pendingRetryId, setPendingRetryId] = useState<string | null>(null);

  // Busca inicial dos dados
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

  // Carrega ao iniciar
  useEffect(() => {
    fetchProntuarios();
  }, []);

  async function handleApi(prontuarioId: string) {
    const res : any = await connectToEdge(prontuarioId);
    return res;
  }

  // --- REVIEW LOGIC ---
  const handleReview = async (prontuarioId: string, status: 'aprovado' | 'recusado', feedback: string) => {
    try {
      // 1. Salva no banco primeiro (Garante que status/feedback fiquem salvos)
      const { error } = await supabase
        .from('prontuarios')
        .update({
          status: status,
          feedback: feedback,
          revisado_por: user.id,
          revisado_por_nome: user.name,
          data_revisao: new Date().toISOString()
        })
        .eq('id', prontuarioId);

      if (error) throw error;
      
      // 2. Se aprovado, tenta integrar com API
      if (status === 'aprovado') {
          const nextMove = await handleApi(prontuarioId);
          
          if(nextMove.action === "RETRY") {
            alert("Erro técnico na integração: " + nextMove.message);
          }
          
          // --- CORREÇÃO DO CONGELAMENTO ---
          if(nextMove.action === "LOGIN_REQUIRED") {
            console.log("🔒 Login necessário. Salvando estado e abrindo modal...");
            
            // a) Guarda o ID para usar depois do login
            setPendingRetryId(prontuarioId);

            // b) Fecha o formulário para destravar a interface de fundo
            setSelectedProntuario(null);

            // c) Abre o modal
            setShowLoginModal(true);
            
            // d) Interrompe a execução aqui
            return; 
          }
          
          if(nextMove.action === "CHECK_CPF") {
            alert("Aviso: " + nextMove.message);
          }

          if (nextMove.success) {
            alert(`✅ Prontuário aprovado e integrado com sucesso!`);
          }
      } else {
          alert(`Prontuário recusado.`);
      }

      // 3. Limpeza padrão (Só chega aqui se não tiver caído no return do Login)
      setSelectedProntuario(null);
      fetchProntuarios();

    } catch (error: any) {
      console.error('Erro ao salvar revisão:', error);
      alert('Erro ao salvar: ' + error.message);
    }
  };

  // --- NOVA FUNÇÃO: Recebe o token do modal e resolve a pendência ---
  const handleTokenReceived = async (newToken: string) => {
    // Verifica se temos um ID pendente na memória (já que selectedProntuario foi fechado)
    if (!pendingRetryId) {
        console.warn("Nenhum prontuário pendente para reprocessar.");
        return;
    }

    try {
      console.log(`💾 Salvando token no perfil do professor e reprocessando prontuário ${pendingRetryId}...`);

      // 1. Atualiza o token no banco de dados (Tabela PROFILES, usando ID do User Logado)
      const { error } = await supabase
        .from('profiles')
        .update({ authtoken: newToken })
        .eq('id', user.id); // <--- Usa o ID do professor logado, que nunca é nulo

      if (error) throw error;

      // 2. Tenta aprovar novamente usando o ID guardado
      console.log("🔄 Dashboard: Retentando integração...");
      
      // Passamos status 'aprovado' novamente. O feedback já foi salvo na tentativa anterior, 
      // mas podemos passar uma string genérica ou vazia aqui se necessário.
      await handleReview(pendingRetryId, 'aprovado', 'Integração autorizada após login.');

      // Limpa o ID pendente
      setPendingRetryId(null);

    } catch (err: any) {
      console.error("Erro ao processar token:", err);
      alert("Erro ao salvar token de acesso: " + err.message);
    }
  };

  const filteredProntuarios = filter === 'todos' 
    ? prontuarios 
    : prontuarios.filter(p => p.status === filter);

  // Helpers de UI
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

  const pendingCount = prontuarios.filter(p => p.status === 'pendente').length;

  return (
    <>
      {selectedProntuario ? (
        <RevisionForm
          user={user}
          prontuario={selectedProntuario}
          onReview={handleReview}
          onCancel={() => setSelectedProntuario(null)}
        />
      ) : (
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
              {[
                  { id: 'pendente', label: `Pendentes (${pendingCount})`, color: 'yellow' },
                  { id: 'aprovado', label: 'Aprovados', color: 'green' },
                  { id: 'recusado', label: 'Recusados', color: 'red' },
                  { id: 'todos', label: 'Todos', color: 'blue' }
              ].map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => setFilter(btn.id as any)}
                    className={`px-4 py-2 rounded-lg ${
                      filter === btn.id 
                        ? `bg-${btn.color}-100 text-${btn.color}-800` 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {btn.label}
                  </button>
              ))}
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
                    <p className="text-gray-700"><strong>Queixa:</strong> {prontuario.queixaPrincipal}</p>
                    <p className="text-gray-700"><strong>Hipótese:</strong> {prontuario.hipoteseDiagnostica}</p>
                  </div>
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
      )}

      {/* 2. MODAL FLUTUANTE GLOBAL */}
      <TiSaudeLoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onSuccess={handleTokenReceived}
      />
    </>
  );
}