import { useState } from 'react';
import { User, Prontuario } from '../App';
import { ArrowLeft, Save } from 'lucide-react';

interface ProntuarioFormProps {
  user: User;
  prontuario: Prontuario | null;
  onSave: (prontuario: Omit<Prontuario, 'id' | 'criadoPor' | 'criadoPorNome' | 'status'>) => void;
  onCancel: () => void;
}

export function ProntuarioForm({ prontuario, onSave, onCancel }: ProntuarioFormProps) {
  const [formData, setFormData] = useState({
    pacienteNome: prontuario?.pacienteNome || '',
    pacienteCPF: prontuario?.pacienteCPF || '',
    pacienteDataNascimento: prontuario?.pacienteDataNascimento || '',
    pacienteTelefone: prontuario?.pacienteTelefone || '',
    dataAtendimento: prontuario?.dataAtendimento || new Date().toISOString().split('T')[0],
    queixaPrincipal: prontuario?.queixaPrincipal || '',
    historiaDoenca: prontuario?.historiaDoenca || '',
    exameFisico: prontuario?.exameFisico || '',
    hipoteseDiagnostica: prontuario?.hipoteseDiagnostica || '',
    conduta: prontuario?.conduta || '',
    observacoes: prontuario?.observacoes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            <h1 className="text-gray-800">
              {prontuario ? 'Editar Prontuário' : 'Novo Prontuário'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-gray-800 mb-4">Dados do Paciente</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="pacienteNome" className="block text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="pacienteNome"
                  name="pacienteNome"
                  value={formData.pacienteNome}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="pacienteCPF" className="block text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  id="pacienteCPF"
                  name="pacienteCPF"
                  value={formData.pacienteCPF}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div>
                <label htmlFor="pacienteDataNascimento" className="block text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  id="pacienteDataNascimento"
                  name="pacienteDataNascimento"
                  value={formData.pacienteDataNascimento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="pacienteTelefone" className="block text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="pacienteTelefone"
                  name="pacienteTelefone"
                  value={formData.pacienteTelefone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div>
                <label htmlFor="dataAtendimento" className="block text-gray-700 mb-2">
                  Data do Atendimento *
                </label>
                <input
                  type="date"
                  id="dataAtendimento"
                  name="dataAtendimento"
                  value={formData.dataAtendimento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-gray-800 mb-4">Informações Clínicas</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="queixaPrincipal" className="block text-gray-700 mb-2">
                  Queixa Principal *
                </label>
                <input
                  type="text"
                  id="queixaPrincipal"
                  name="queixaPrincipal"
                  value={formData.queixaPrincipal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ex: Dificuldade na pronúncia de sons, rouquidão, gagueira..."
                  required
                />
              </div>

              <div>
                <label htmlFor="historiaDoenca" className="block text-gray-700 mb-2">
                  História da Doença Atual *
                </label>
                <textarea
                  id="historiaDoenca"
                  name="historiaDoenca"
                  value={formData.historiaDoenca}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Descreva detalhadamente a história da doença atual..."
                  required
                />
              </div>

              <div>
                <label htmlFor="exameFisico" className="block text-gray-700 mb-2">
                  Avaliação Fonoaudiológica *
                </label>
                <textarea
                  id="exameFisico"
                  name="exameFisico"
                  value={formData.exameFisico}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Descreva os achados da avaliação: linguagem, fala, voz, motricidade orofacial, audição..."
                  required
                />
              </div>

              <div>
                <label htmlFor="hipoteseDiagnostica" className="block text-gray-700 mb-2">
                  Hipótese Diagnóstica *
                </label>
                <input
                  type="text"
                  id="hipoteseDiagnostica"
                  name="hipoteseDiagnostica"
                  value={formData.hipoteseDiagnostica}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ex: Transtorno fonológico, disfonia, atraso de linguagem..."
                  required
                />
              </div>

              <div>
                <label htmlFor="conduta" className="block text-gray-700 mb-2">
                  Plano Terapêutico *
                </label>
                <textarea
                  id="conduta"
                  name="conduta"
                  value={formData.conduta}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Descreva o plano terapêutico: técnicas, exercícios, frequência das sessões, orientações..."
                  required
                />
              </div>

              <div>
                <label htmlFor="observacoes" className="block text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Observações adicionais (opcional)..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />
              Salvar Prontuário
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}