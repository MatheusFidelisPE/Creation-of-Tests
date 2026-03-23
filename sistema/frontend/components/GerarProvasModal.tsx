import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Prova } from '../types';

interface GerarProvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  provas: Prova[];
  onConfirm: (data: {
    prova_id: number;
    quantidade_provas: number;
    nome_professor: string;
    nome_disciplina: string;
    data: string;
  }) => Promise<void>;
}

export default function GerarProvasModal({
  isOpen,
  onClose,
  provas,
  onConfirm,
}: GerarProvasModalProps) {
  const [selectedProvaId, setSelectedProvaId] = useState<number | ''>('');
  const [quantidadeProvas, setQuantidadeProvas] = useState<number>(5);
  const [nomeProfessor, setNomeProfessor] = useState<string>('');
  const [nomeDisciplina, setNomeDisciplina] = useState<string>('');
  const [dataProva, setDataProva] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form cuando se cierra el modal
      setSelectedProvaId('');
      setQuantidadeProvas(5);
      setNomeProfessor('');
      setNomeDisciplina('');
      setDataProva('');
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    // Validação
    if (!selectedProvaId) {
      toast.error('Selecione uma prova');
      return;
    }

    if (quantidadeProvas < 1) {
      toast.error('A quantidade de provas deve ser no mínimo 1');
      return;
    }

    if (!nomeProfessor.trim()) {
      toast.error('Informe o nome do professor');
      return;
    }

    if (!nomeDisciplina.trim()) {
      toast.error('Informe o nome da disciplina');
      return;
    }

    if (!dataProva) {
      toast.error('Informe a data da prova');
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        prova_id: Number(selectedProvaId),
        quantidade_provas: quantidadeProvas,
        nome_professor: nomeProfessor,
        nome_disciplina: nomeDisciplina,
        data: dataProva,
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao gerar provas');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Gerar Provas Aleatórias</h2>

        {/* Seleção de Prova */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prova
          </label>
          <select
            value={selectedProvaId}
            onChange={(e) => setSelectedProvaId(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Selecione uma prova --</option>
            {provas.map((prova) => (
              <option key={prova.id} value={prova.id}>
                Prova #{prova.id} - {prova.questoes.length} questões
              </option>
            ))}
          </select>
        </div>

        {/* Quantidade de Provas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade de Provas
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={quantidadeProvas}
            onChange={(e) => setQuantidadeProvas(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nome do Professor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Professor
          </label>
          <input
            type="text"
            value={nomeProfessor}
            onChange={(e) => setNomeProfessor(e.target.value)}
            placeholder="Ex: Prof. João Silva"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nome da Disciplina */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Disciplina
          </label>
          <input
            type="text"
            value={nomeDisciplina}
            onChange={(e) => setNomeDisciplina(e.target.value)}
            placeholder="Ex: Matemática"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Data da Prova */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data da Prova
          </label>
          <input
            type="date"
            value={dataProva}
            onChange={(e) => setDataProva(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <span className="animate-spin">⏳</span>}
            {loading ? 'Gerando...' : 'Gerar Provas'}
          </button>
        </div>
      </div>
    </div>
  );
}
