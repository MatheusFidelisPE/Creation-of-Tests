import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Questao, Alternativa } from '../types';

interface QuestaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (enunciado: string, alternativas: Omit<Alternativa, 'id' | 'questaoId'>[]) => Promise<void>;
  questao?: Questao;
}

export default function QuestaoModal({ isOpen, onClose, onSave, questao }: QuestaoModalProps) {
  const [enunciado, setEnunciado] = useState('');
  const [alternativas, setAlternativas] = useState<Omit<Alternativa, 'id' | 'questaoId'>[]>([
    { descricao: '', correta: false },
    { descricao: '', correta: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (questao) {
      setEnunciado(questao.enunciado);
      setAlternativas(questao.alternativas.map(a => ({ descricao: a.descricao, correta: a.correta })));
    } else {
      setEnunciado('');
      setAlternativas([
        { descricao: '', correta: false },
        { descricao: '', correta: false },
      ]);
    }
    setErrors([]);
  }, [questao, isOpen]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!enunciado.trim()) newErrors.push('Enunciado é obrigatório');
    if (alternativas.length < 2) newErrors.push('Deve haver pelo menos 2 alternativas');
    if (!alternativas.some(a => a.correta)) newErrors.push('Deve haver pelo menos uma alternativa correta');
    if (alternativas.some(a => !a.descricao.trim())) newErrors.push('Todas as alternativas devem ter descrição');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(enunciado, alternativas);
      onClose();
    } catch (err) {
      setErrors(['Erro ao salvar']);
    } finally {
      setLoading(false);
    }
  };

  const addAlternativa = () => {
    setAlternativas([...alternativas, { descricao: '', correta: false }]);
  };

  const removeAlternativa = (index: number) => {
    if (alternativas.length > 2) {
      setAlternativas(alternativas.filter((_, i) => i !== index));
    }
  };

  const updateAlternativa = (index: number, field: keyof Omit<Alternativa, 'id' | 'questaoId'>, value: any) => {
    setAlternativas(alternativas.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              {questao ? 'Editar Questão' : 'Nova Questão'}
            </Dialog.Title>

            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <ul>
                  {errors.map((error, i) => <li key={i}>{error}</li>)}
                </ul>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Enunciado da Questão</label>
              <textarea
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Alternativas</label>
              {alternativas.map((alt, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={alt.descricao}
                    onChange={(e) => updateAlternativa(index, 'descricao', e.target.value)}
                    placeholder="Descrição da alternativa"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={alt.correta}
                      onChange={(e) => updateAlternativa(index, 'correta', e.target.checked)}
                      className="mr-2"
                    />
                    Correta
                  </label>
                  {alternativas.length > 2 && (
                    <button
                      onClick={() => removeAlternativa(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addAlternativa}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FaPlus className="mr-2" />
                Adicionar Alternativa
              </button>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}