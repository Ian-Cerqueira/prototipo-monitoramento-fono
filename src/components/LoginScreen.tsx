import { useState } from 'react';
import { User } from '../App';
import { Stethoscope } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - simula diferentes usuários
    if (email.includes('estagiario')) {
      onLogin({
        id: '1',
        name: 'João Silva',
        role: 'estagiario',
        email: email
      });
    } else {
      onLogin({
        id: '2',
        name: 'Dra. Maria Santos',
        role: 'professor',
        email: email
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-center text-gray-800 mb-2">Sistema de Prontuários</h1>
        <p className="text-center text-gray-600 mb-8">Clínica-Escola de Fonoaudiologia</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Usuários de teste:</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <strong>Estagiário:</strong> estagiario@exemplo.com
            </p>
            <p className="text-gray-700">
              <strong>Professor:</strong> professor@exemplo.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}