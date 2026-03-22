import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DataTable from '../components/DataTable';
import ProvasTable from '../components/ProvasTable';
import QuestaoModal from '../components/QuestaoModal';
import CriarProvaModal from '../components/CriarProvaModal';
import EditarProvaModal from '../components/EditarProvaModal';
import QuestaoAccordion from '../components/QuestaoAccordion';
import { useQuestoes } from '../hooks/useApi';
import { Questao, Prova } from '../types';

export default function Home() {
  const { questoes, loading, createQuestao, updateQuestao, deleteQuestao, createProva, fetchProvas, deleteProva, updateProva } = useQuestoes();
  const [modalOpen, setModalOpen] = useState(false);
  const [criarProvaModalOpen, setCriarProvaModalOpen] = useState(false);
  const [editarProvaModalOpen, setEditarProvaModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingQuestao, setEditingQuestao] = useState<Questao | undefined>();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [provas, setProvas] = useState<Prova[]>([]);
  const [selectedProva, setSelectedProva] = useState<Prova | null>(null);

  const handleNewQuestao = () => {
    setEditingQuestao(undefined);
    setModalOpen(true);
  };

  const handleEdit = (questao: Questao) => {
    setEditingQuestao(questao);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta questão?')) {
      try {
        await deleteQuestao(id);
        if (expandedRow === id) setExpandedRow(null);
        toast.success('Questão excluída com sucesso!');
      } catch (err) {
        toast.error('Erro ao excluir questão');
      }
    }
  };

  const handleSave = async (enunciado: string, alternativas: any[]) => {
    try {
      if (editingQuestao) {
        await updateQuestao(editingQuestao.id, enunciado, alternativas);
        toast.success('Questão atualizada com sucesso!');
      } else {
        await createQuestao(enunciado, alternativas);
        toast.success('Questão criada com sucesso!');
      }
    } catch (err) {
      toast.error('Erro ao salvar questão');
      throw err;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const provasData = await fetchProvas();
        setProvas(provasData);
      } catch (error: any) {
        toast.error(error.message || 'Erro ao carregar provas');
      }
    })();
   }, []);

  const handleRowClick = (questao: Questao) => {
    setExpandedRow(expandedRow === questao.id ? null : questao.id);
  };

  const handleCriarProva = async (tipoDeResposta: 'LETRAS' | 'NUMEROS') => {
    try {
      const prova = await createProva(selectedIds, tipoDeResposta);
      const provasData = await fetchProvas();
      setProvas(provasData);
      toast.success('Prova criada com sucesso!');
      setSelectedIds([]);
      setCriarProvaModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar prova');
      throw error;
    }
  };

  const handleDeleteProva = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta prova?')) return;
    try {
      await deleteProva(id);
      const provasData = await fetchProvas();
      setProvas(provasData);
      if (selectedProva?.id === id) setSelectedProva(null);
      toast.success('Prova excluída com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir prova');
    }
  };

  const handleEditProva = (prova: Prova) => {
    setSelectedProva(prova);
    setEditarProvaModalOpen(true);
  };

  const handleAtualizarProva = async (provaId: number, questoes: number[], tipoDeResposta: 'LETRAS' | 'NUMEROS') => {
    await updateProva(provaId, questoes, tipoDeResposta);
    const provasData = await fetchProvas();
    setProvas(provasData);
    const provaAtualizada = provasData.find((p: Prova) => p.id === provaId) || null;
    setSelectedProva(provaAtualizada);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gerenciamento de Questões</h2>
          <div className="flex gap-2">
            <button
              onClick={handleNewQuestao}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Nova Questão
            </button>
            <button
              onClick={() => setCriarProvaModalOpen(true)}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Criar Prova
            </button>
          </div>
        </div>

        <DataTable
          data={questoes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        {expandedRow && (
          <div className="mt-4">
            <QuestaoAccordion questao={questoes.find(q => q.id === expandedRow)!} />
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Provas Geradas</h2>
          <ProvasTable
            provas={provas}
            onSelect={setSelectedProva}
            onEdit={handleEditProva}
            onDelete={handleDeleteProva}
          />

          {selectedProva && (
            <div className="mt-4 p-4 border border-gray-300 rounded bg-white">
              <h3 className="text-xl font-semibold mb-2">Questões da Prova #{selectedProva.id}</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedProva.questoes.map((pq) => (
                  <li key={pq.questao.id}>{pq.questao.enunciado}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <QuestaoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        questao={editingQuestao}
      />

      <CriarProvaModal
        isOpen={criarProvaModalOpen}
        onClose={() => setCriarProvaModalOpen(false)}
        onConfirm={handleCriarProva}
        selectedCount={selectedIds.length}
      />

      <EditarProvaModal
        isOpen={editarProvaModalOpen}
        onClose={() => setEditarProvaModalOpen(false)}
        prova={selectedProva}
        questoesDisponiveis={questoes}
        onUpdate={handleAtualizarProva}
      />
    </div>
  );
}
