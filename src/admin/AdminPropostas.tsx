import { useEffect, useState } from "react"

import type { PropostaType } from "../utils/PropostaType"

const apiUrl = import.meta.env.VITE_API_URL

function ControlePropostas() {
  const [propostas, setPropostas] = useState<PropostaType[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')

  useEffect(() => {
    async function getPropostas() {
      try {
        console.log('Tentando buscar propostas:', `${apiUrl}/propostas`)
        const response = await fetch(`${apiUrl}/propostas`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const dados = await response.json()
        console.log('Propostas recebidas:', dados)
        setPropostas(dados)
      } catch (error) {
        console.error('Erro ao buscar propostas:', error)
        setPropostas([]) // Define array vazio em caso de erro
      }
    }
    getPropostas()
  }, [])

  // Função para determinar status baseado na resposta
  const getStatus = (proposta: PropostaType) => {
    if (!proposta.resposta) return 'PENDENTE'
    if (proposta.resposta.includes('aprovada') || proposta.resposta.includes('Aprovada')) return 'APROVADA'
    if (proposta.resposta.includes('rejeitada') || proposta.resposta.includes('Rejeitada')) return 'REJEITADA'
    return 'RESPONDIDA'
  }

  // Filtrar propostas por status
  const propostasFiltradas = filtroStatus === 'TODOS' 
    ? propostas 
    : propostas.filter(p => getStatus(p) === filtroStatus)

  async function atualizarResposta(propostaId: number, resposta: string) {
    try {
      const response = await fetch(`${apiUrl}/propostas/${propostaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resposta })
      })

      if (response.ok) {
        // Atualizar a proposta na lista local
        setPropostas(propostas.map(p => 
          p.id === propostaId 
            ? { ...p, resposta }
            : p
        ))
      }
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📝</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Gerenciar <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Propostas</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Controle e responda às solicitações de aluguel
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-4">
            <select 
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-4 py-2 border-2 border-orange-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-orange-600 dark:text-white"
            >
              <option value="TODOS">📋 Todas as propostas</option>
              <option value="PENDENTE">⏳ Pendentes</option>
              <option value="APROVADA">✅ Aprovadas</option>
              <option value="REJEITADA">❌ Rejeitadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Propostas */}
      <div className="grid gap-6">
        {propostasFiltradas.map(proposta => (
          <div key={proposta.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-orange-100 dark:border-orange-700 overflow-hidden">
            <div className="p-6">
              {/* Header da proposta */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Proposta #{proposta.id}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(proposta.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    getStatus(proposta) === 'APROVADA' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    getStatus(proposta) === 'REJEITADA' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {getStatus(proposta) === 'APROVADA' ? '✅ Aprovada' :
                     getStatus(proposta) === 'REJEITADA' ? '❌ Rejeitada' :
                     '⏳ Pendente'}
                  </span>
                </div>
              </div>

              {/* Informações do cliente e imóvel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Dados do cliente */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>👤</span> Dados do Cliente
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-1">
                    <p className="text-sm"><span className="font-medium">Nome:</span> {proposta.cliente?.nome || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {proposta.cliente?.email || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">ID:</span> {proposta.cliente?.id || 'N/A'}</p>
                  </div>
                </div>

                {/* Dados do imóvel */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🏠</span> Imóvel Solicitado
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-1">
                    <p className="text-sm"><span className="font-medium">Título:</span> {proposta.imovel?.titulo || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Tipo:</span> {proposta.imovel?.tipo || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Cidade:</span> {proposta.imovel?.cidade || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Aluguel:</span> R$ {Number(proposta.imovel?.aluguelMensal || 0).toLocaleString('pt-BR')}/mês</p>
                  </div>
                </div>
              </div>

              {/* Descrição da proposta */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                  <span>💬</span> Mensagem do Cliente
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-gray-700 dark:text-gray-300">
                    {proposta.descricao || 'Nenhuma mensagem adicional.'}
                  </p>
                </div>
              </div>

              {/* Resposta (se houver) */}
              {proposta.resposta && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                    <span>💼</span> Resposta da Administração
                  </h4>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-3 rounded">
                    <p className="text-gray-700 dark:text-gray-300">
                      {proposta.resposta}
                    </p>
                  </div>
                </div>
              )}

              {/* Ações */}
              {getStatus(proposta) === 'PENDENTE' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => atualizarResposta(proposta.id, 'Proposta aprovada! Entraremos em contato em breve.')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors duration-200"
                  >
                    <span>✅</span> Aprovar
                  </button>
                  <button
                    onClick={() => atualizarResposta(proposta.id, 'Infelizmente não foi possível aprovar esta proposta no momento.')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200"
                  >
                    <span>❌</span> Rejeitar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {propostasFiltradas.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {filtroStatus === 'TODOS' ? 'Nenhuma proposta encontrada' : `Nenhuma proposta ${filtroStatus.toLowerCase()}`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filtroStatus === 'TODOS' 
              ? 'Quando os clientes enviarem propostas, elas aparecerão aqui.'
              : 'Tente ajustar o filtro para ver outras propostas.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default ControlePropostas