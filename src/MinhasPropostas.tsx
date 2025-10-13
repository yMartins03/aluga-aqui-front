import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import type { PropostaType } from "./utils/PropostaType";

const apiUrl = import.meta.env.VITE_API_URL

export default function MinhasPropostas() {
    const [propostas, setPropostas] = useState<PropostaType[]>([])
    const { cliente } = useClienteStore()

    useEffect(() => {
        async function buscaDados() {
            try {
                console.log('🔍 Buscando propostas para cliente:', cliente.id)
                const response = await fetch(`${apiUrl}/propostas/${cliente.id}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const dados = await response.json()
                console.log('📋 Propostas encontradas:', dados)
                setPropostas(dados)
            } catch (error) {
                console.error('❌ Erro ao buscar propostas:', error)
                setPropostas([])
            }
        }
        if (cliente.id) {
            buscaDados()
        }
    }, [cliente.id])

    // Formatar data para o padrão brasileiro
    function formatarData(data: string) {
        return new Date(data).toLocaleDateString("pt-BR")
    }

    const tipoIcons: Record<string, string> = {
        'APARTAMENTO': '🏢',
        'CASA': '🏠',
        'KITNET': '🏠',
        'STUDIO': '🏠',
        'COBERTURA': '🏢',
        'SOBRADO': '🏠',
        'COMERCIAL': '🏪',
        'SALA_COMERCIAL': '🏢',
        'LOJA': '🏪',
        'GALPAO': '🏭',
        'TERRENO': '🟫',
        'CHACARA': '🌳'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-4xl">📋</span>
                        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                            Minhas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Propostas</span>
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Acompanhe o status das suas propostas de imóveis
                    </p>
                </div>

                {/* Conteúdo */}
                {propostas.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="text-8xl mb-6 block">📭</span>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Nenhuma proposta encontrada
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Você ainda não fez propostas para imóveis. Que tal começar a explorar?
                        </p>
                        <a 
                            href="/"
                            className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium transition-all duration-200"
                        >
                            <span className="mr-2">🏠</span>
                            Ver Imóveis Disponíveis
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Contador de propostas */}
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📊</span>
                                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                    Total: {propostas.length} proposta{propostas.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Lista de propostas */}
                        <div className="grid gap-6">
                            {propostas.map(proposta => {
                                const tipoIcon = tipoIcons[proposta.imovel?.tipo || ''] || '🏠'
                                
                                return (
                                    <div key={proposta.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 overflow-hidden">
                                        <div className="md:flex">
                                            {/* Imagem do imóvel */}
                                            <div className="md:w-1/3">
                                                <img 
                                                    src={proposta.imovel?.fotos || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop&crop=center"} 
                                                    alt="Foto do Imóvel"
                                                    className="w-full h-48 md:h-full object-cover"
                                                />
                                            </div>
                                            
                                            {/* Conteúdo */}
                                            <div className="md:w-2/3 p-6">
                                                {/* Título do imóvel */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-2xl">{tipoIcon}</span>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {proposta.imovel?.titulo || 'Imóvel'}
                                                    </h3>
                                                </div>

                                                {/* Informações do imóvel */}
                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            <span>🏷️</span>
                                                            <span>{proposta.imovel?.tipo || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <span>📍</span>
                                                            <span>{proposta.imovel?.cidade || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                            R$ {Number(proposta.imovel?.aluguelMensal || 0).toLocaleString("pt-br", {
                                                                minimumFractionDigits: 2
                                                            })}/mês
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Proposta enviada */}
                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                                    <div className="flex items-start gap-2 mb-2">
                                                        <span className="text-lg">📝</span>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                                Sua Proposta
                                                            </h4>
                                                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                                {proposta.descricao}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                Enviado em: {formatarData(proposta.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Resposta */}
                                                <div className="flex items-start gap-2">
                                                    {proposta.resposta ? (
                                                        <>
                                                            <span className="text-lg">✅</span>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                                                                    Resposta do Aluga Aqui
                                                                </h4>
                                                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                                                                    {proposta.resposta}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Respondido em: {formatarData(proposta.updatedAt as string)}
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-lg animate-pulse">⏳</span>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
                                                                    Aguardando resposta...
                                                                </h4>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    Sua proposta foi recebida e está sendo analisada
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}