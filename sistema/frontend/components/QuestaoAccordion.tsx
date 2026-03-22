import { useState } from 'react';
import { Questao } from '../types';

interface QuestaoAccordionProps {
  questao: Questao;
}

export default function QuestaoAccordion({ questao }: QuestaoAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 rounded-md mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold">{questao.enunciado}</span>
          <span>{isOpen ? '−' : '+'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-300">
          <p className="font-semibold mb-2">{questao.enunciado}</p>
          <ul className="space-y-2">
            {questao.alternativas.map((alt, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{alt.descricao}</span>
                <span className={`px-2 py-1 rounded text-sm ${alt.correta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {alt.correta ? 'Correta' : 'Incorreta'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}