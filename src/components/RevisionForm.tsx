import { useState } from 'react';
import { User, Prontuario } from '../App';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface RevisionFormProps {
  user: User;
  prontuario: Prontuario;
  onReview: (prontuarioId: string, status: 'aprovado' | 'recusado', feedback: string) => void;
  onCancel: () => void;
}

export function RevisionForm({ prontuario, onReview, onCancel }: RevisionFormProps) {
  const [feedback, setFeedback] = useState(prontuario.feedback || '');

  const handleApprove = () => {
    if (!feedback.trim()) {
      alert('Por favor, forneça um feedback para o aluno.');
      return;
    }
    onReview(prontuario.id, 'aprovado', feedback);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      alert('Por favor, forneça um feedback explicando o motivo da recusa.');
      return;
    }
    onReview(prontuario.id, 'recusado', feedback);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-gray-800">Revisar Prontuário</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-gray-800 mb-2">Informações do Atendimento</h2>
            <p className="text-gray-600">
              Estagiário: {prontuario.criadoPorNome} • Data: {new Date(prontuario.dataAtendimento).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Dados do Paciente</h2>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Nome Completo</p>
                  <p className="text-gray-800">{prontuario.pacienteNome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="text-gray-800">{prontuario.pacienteCPF}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data de Nascimento</p>
                  <p className="text-gray-800">{new Date(prontuario.pacienteDataNascimento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="text-gray-800">{prontuario.pacienteTelefone}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-gray-800 mb-4">Informações Clínicas</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Queixa Principal</p>
                  <p className="text-gray-800">{prontuario.queixaPrincipal}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">História da Doença Atual</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{prontuario.historiaDoenca}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Exame Físico</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{prontuario.exameFisico}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Hipótese Diagnóstica</p>
                  <p className="text-gray-800">{prontuario.hipoteseDiagnostica}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Plano Terapêutico</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{prontuario.conduta}</p>
                </div>

                {prontuario.observacoes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Observações</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{prontuario.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-gray-800 mb-4">Feedback para o Estagiário</h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-4"
            placeholder="Forneça um feedback construtivo para o estagiário..."
          />

          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={prontuario.status !== 'pendente'}
            >
              <CheckCircle className="w-5 h-5" />
              Aprovar Prontuário
            </button>
            <button
              onClick={handleReject}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              disabled={prontuario.status !== 'pendente'}
            >
              <XCircle className="w-5 h-5" />
              Recusar Prontuário
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Voltar
            </button>
          </div>

          {prontuario.status !== 'pendente' && (
            <p className="mt-4 text-sm text-gray-600">
              Este prontuário já foi revisado e não pode ser alterado.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}