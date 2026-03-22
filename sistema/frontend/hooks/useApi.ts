import { useState, useEffect } from 'react';
import axios from 'axios';
import { Questao, Alternativa } from '../types';

const API_BASE = 'http://localhost:3001/api';

export const useQuestoes = () => {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestoes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/questoes`);
      setQuestoes(response.data.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar questões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestoes();
  }, []);

  const createQuestao = async (enunciado: string, alternativas: Omit<Alternativa, 'id' | 'questaoId'>[]) => {
    try {
      const response = await axios.post(`${API_BASE}/questoes`, { enunciado, alternativas });
      setQuestoes(prev => [...prev, response.data.data]);
      return response.data.data;
    } catch (err) {
      throw new Error('Erro ao criar questão');
    }
  };

  const updateQuestao = async (id: number, enunciado: string, alternativas: Omit<Alternativa, 'id' | 'questaoId'>[]) => {
    try {
      const response = await axios.put(`${API_BASE}/questoes/${id}`, { enunciado, alternativas });
      setQuestoes(prev => prev.map(q => q.id === id ? response.data.data : q));
      return response.data.data;
    } catch (err) {
      throw new Error('Erro ao atualizar questão');
    }
  };

  const deleteQuestao = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/questoes/${id}`);
      setQuestoes(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      throw new Error('Erro ao excluir questão');
    }
  };

  const fetchProvas = async () => {
    try {
      const response = await axios.get(`${API_BASE}/provas`);
      return response.data.data;
    } catch (err) {
      throw new Error('Erro ao carregar provas');
    }
  };

  const deleteProva = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/provas/${id}`);
    } catch (err) {
      throw new Error('Erro ao excluir prova');
    }
  };

  const updateProva = async (id: number, questoes: number[], tipoDeResposta: 'LETRAS' | 'NUMEROS') => {
    try {
      const response = await axios.put(`${API_BASE}/provas/${id}`, { questoes, tipoDeResposta });
      return response.data.data;
    } catch (err) {
      throw new Error('Erro ao atualizar prova');
    }
  };

  const createProva = async (questoes: number[], tipoDeResposta: 'LETRAS' | 'NUMEROS') => {
    try {
      const response = await axios.post(`${API_BASE}/provas`, {
        questoes,
        tipoDeResposta,
      });
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao criar prova');
    }
  };

  return { questoes, loading, error, fetchQuestoes, createQuestao, updateQuestao, deleteQuestao, createProva, fetchProvas, deleteProva, updateProva };
};