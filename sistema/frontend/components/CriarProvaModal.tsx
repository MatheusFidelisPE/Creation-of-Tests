import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface CriarProvaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tipoDeResposta: 'LETRAS' | 'SOMA_EXPONENCIAL') => Promise<void>;
  selectedCount: number;
}

export default function CriarProvaModal({ isOpen, onClose, onConfirm, selectedCount }: CriarProvaModalProps) {
  const [tipoDeResposta, setTipoDeResposta] = useState<'LETRAS' | 'SOMA_EXPONENCIAL'>('LETRAS');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(tipoDeResposta);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar prova');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Criar Prova</h2>
        <p className="text-gray-700 mb-6">Você selecionou {selectedCount} questão(ões).</p>

        <p className="text-gray-700 mb-4">Como deseja que a prova seja estruturada?</p>

        <div className="space-y-3 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tipoDeResposta"
              value="LETRAS"
              checked={tipoDeResposta === 'LETRAS'}
              onChange={(e) => setTipoDeResposta(e.target.value as 'LETRAS' | 'SOMA_EXPONENCIAL')}
              className="mr-3 cursor-pointer"
            />
            <span className="text-gray-700">Respostas por Letras (A, B, C, D, ...)</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tipoDeResposta"
              value="SOMA_EXPONENCIAL"
              checked={tipoDeResposta === 'SOMA_EXPONENCIAL'}
              onChange={(e) => setTipoDeResposta(e.target.value as 'LETRAS' | 'SOMA_EXPONENCIAL')}
              className="mr-3 cursor-pointer"
            />
            <span className="text-gray-700">Respostas por Números Exponenciais de 2 (1, 2, 4, 8, 16, ...)</span>
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
