import { useEffect, useState } from 'react';
import { Questao, Prova } from '../types';
import { toast } from 'react-hot-toast';

interface EditarProvaModalProps {
  isOpen: boolean;
  prova: Prova | null;
  questoesDisponiveis: Questao[];
  onClose: () => void;
  onUpdate: (provaId: number, questoes: number[], tipoDeResposta: 'LETRAS' | 'SOMA_EXPONENCIAL') => Promise<void>;
}

export default function EditarProvaModal({ isOpen, prova, questoesDisponiveis, onClose, onUpdate }: EditarProvaModalProps) {
  const [selectedQuestaoIds, setSelectedQuestaoIds] = useState<number[]>([]);
  const [tipoDeResposta, setTipoDeResposta] = useState<'LETRAS' | 'SOMA_EXPONENCIAL'>('LETRAS');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prova) {
      setSelectedQuestaoIds(prova.questoes.map((pq) => pq.questaoId));
      setTipoDeResposta(prova.tipoDeResposta);
    }
  }, [prova]);

  if (!isOpen || !prova) return null;

  const toggleQuestao = (id: number) => {
    setSelectedQuestaoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    if (selectedQuestaoIds.length === 0) {
      toast.error('Selecione ao menos uma questão');
      return;
    }

    try {
      setLoading(true);
      await onUpdate(prova.id, selectedQuestaoIds, tipoDeResposta);
      onClose();
      toast.success('Prova atualizada com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar prova');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Editar Prova #{prova.id}</h2>

        <p className="text-gray-700 mb-4">Tipo de avaliação</p>
        <div className="space-y-3 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tipoDeRespostaEdit"
              value="LETRAS"
              checked={tipoDeResposta === 'LETRAS'}
              onChange={() => setTipoDeResposta('LETRAS')}
              className="mr-3 cursor-pointer"
            />
            <span className="text-gray-700">Letras</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tipoDeRespostaEdit"
              value="SOMA_EXPONENCIAL"
              checked={tipoDeResposta === 'SOMA_EXPONENCIAL'}
              onChange={() => setTipoDeResposta('SOMA_EXPONENCIAL')}
              className="mr-3 cursor-pointer"
            />
            <span className="text-gray-700">Exponencial (1,2,4,8,...)</span>
          </label>
        </div>

        <div className="mb-4">
          <p className="font-semibold">Questões na prova</p>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto mt-2">
            {questoesDisponiveis.map((questao) => (
              <label key={questao.id} className="flex items-start gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedQuestaoIds.includes(questao.id)}
                  onChange={() => toggleQuestao(questao.id)}
                  className="mt-1"
                />
                <span className="text-sm">{questao.enunciado}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">Cancelar</button>
          <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </div>
  );
}
