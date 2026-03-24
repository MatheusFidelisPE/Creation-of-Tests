import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ResultadoCorrecao {
  id_prova: string;
  nota: number;
}

interface CorrecaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCorrigir: (
    gabaritosFile: File,
    respostasFile: File,
    tipoResposta: 'LETRAS' | 'SOMA_EXPONENCIAL',
    rigor: boolean
  ) => Promise<ResultadoCorrecao[]>;
}

export default function CorrecaoModal({
  isOpen,
  onClose,
  onCorrigir,
}: CorrecaoModalProps) {
  const [gabaritosFile, setGabaritosFile] = useState<File | null>(null);
  const [respostasFile, setRespostasFile] = useState<File | null>(null);
  const [tipoResposta, setTipoResposta] = useState<'LETRAS' | 'SOMA_EXPONENCIAL'>('LETRAS');
  const [rigor, setRigor] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<ResultadoCorrecao[] | null>(null);

  const handleGabaritosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setGabaritosFile(files[0]);
    }
  };

  const handleRespostasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setRespostasFile(files[0]);
    }
  };

  const handleCorrigir = async () => {
    // Validações
    if (!gabaritosFile) {
      toast.error('Selecione o arquivo de gabaritos');
      return;
    }

    if (!respostasFile) {
      toast.error('Selecione o arquivo de respostas');
      return;
    }

    // Validar nomes dos arquivos
    if (!gabaritosFile.name.toLowerCase().endsWith('.csv')) {
      toast.error('Arquivo de gabaritos deve ser um CSV');
      return;
    }

    if (!respostasFile.name.toLowerCase().endsWith('.csv')) {
      toast.error('Arquivo de respostas deve ser um CSV');
      return;
    }

    setLoading(true);
    try {
      const resultado = await onCorrigir(gabaritosFile, respostasFile, tipoResposta, rigor);
      setResultados(resultado);
      toast.success('Provas corrigidas com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao corrigir provas');
    } finally {
      setLoading(false);
    }
  };

  const handleFechar = () => {
    setGabaritosFile(null);
    setRespostasFile(null);
    setTipoResposta('LETRAS');
    setRigor(false);
    setResultados(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Corrigir Provas</h2>

        {!resultados ? (
          <>
            {/* Upload de Gabaritos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo de Gabaritos (CSV)
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleGabaritosChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {gabaritosFile && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {gabaritosFile.name}
                </p>
              )}
            </div>

            {/* Upload de Respostas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo de Respostas (CSV)
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleRespostasChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {respostasFile && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {respostasFile.name}
                </p>
              )}
            </div>

            {/* Tipo de Alternativas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Alternativas
              </label>
              <select
                value={tipoResposta}
                onChange={(e) => setTipoResposta(e.target.value as 'LETRAS' | 'SOMA_EXPONENCIAL')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LETRAS">LETRAS (A, B, C, AC, etc)</option>
                <option value="SOMA_EXPONENCIAL">SOMA_EXPONENCIAL (1, 2, 3, 4, etc)</option>
              </select>
            </div>

            {/* Rigor */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rigor}
                  onChange={(e) => setRigor(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Correção Rigorosa (tudo ou nada)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {rigor
                  ? 'Resposta só vale ponto se for exatamente igual ao gabarito'
                  : 'Resposta pode valer ponto parcial se acertar algumas alternativas'}
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <button
                onClick={handleCorrigir}
                disabled={loading || !gabaritosFile || !respostasFile}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Corrigindo...' : 'Corrigir'}
              </button>
              <button
                onClick={handleFechar}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Fechar
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4">Resultados da Correção</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID Prova</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((resultado) => {
                    const isAprovada = resultado.nota >= 7;
                    const bgColor = isAprovada ? 'bg-green-100' : 'bg-red-100';
                    const textColor = isAprovada ? 'text-green-800' : 'text-red-800';

                    return (
                      <tr key={resultado.id_prova} className={bgColor}>
                        <td className={`border border-gray-300 px-4 py-2 ${textColor}`}>
                          {resultado.id_prova}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 font-bold ${textColor}`}>
                          {resultado.nota.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Botão para voltar */}
            <div className="flex gap-2">
              <button
                onClick={() => setResultados(null)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Voltar
              </button>
              <button
                onClick={handleFechar}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
