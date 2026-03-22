import { Prova } from '../types';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface ProvasTableProps {
  provas: Prova[];
  onSelect: (prova: Prova) => void;
  onEdit: (prova: Prova) => void;
  onDelete: (id: number) => void;
}

export default function ProvasTable({ provas, onSelect, onEdit, onDelete }: ProvasTableProps) {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Tipo de Avaliação</th>
            <th className="border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {provas.map((prova) => (
            <tr
              key={prova.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(prova)}
            >
              <td className="border border-gray-300 px-4 py-2">{prova.id}</td>
              <td className="border border-gray-300 px-4 py-2">{prova.tipoDeResposta === 'SOMA_EXPONENCIAL' ? 'Exponencial (2^n)' : 'Letras'}</td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(prova);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(prova.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
