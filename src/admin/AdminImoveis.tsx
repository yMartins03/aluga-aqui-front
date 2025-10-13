import { useEffect, useState } from "react"

// import ItemImovel from './components/ItemImovel' // Não usado mais - usando cards inline
import type { ImovelType } from "../utils/ImovelType"
import { Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminImoveis() {
  const [imoveis, setImoveis] = useState<ImovelType[]>([])

  useEffect(() => {
    async function getImoveis() {
      const response = await fetch(`${apiUrl}/imoveis`)
      const dados = await response.json()
      setImoveis(dados)
    }
    getImoveis()
  }, [])

  // Agora usando cards inline no JSX ao invés de componente separado

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">🏠</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Gerenciar <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Imóveis</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Controle total do seu portfólio imobiliário
              </p>
            </div>
          </div>
          <Link 
            to="/admin/imoveis/novo" 
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>➕</span>
            Novo Imóvel
          </Link>
        </div>
      </div>

      {/* Cards Grid de Imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {imoveis.map(imovel => (
          <div key={imovel.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 overflow-hidden transform hover:scale-105 transition-all duration-200">
            {/* Imagem do imóvel */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              {imovel.fotos ? (
                <img 
                  src={imovel.fotos} 
                  alt={imovel.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-gray-400">🏠</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold">
                  {imovel.tipo}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${imovel.disponivel ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {imovel.disponivel ? '✅ Disponível' : '❌ Ocupado'}
                </span>
              </div>
            </div>

            {/* Conteúdo do card */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {imovel.titulo}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                📍 {imovel.endereco}, {imovel.cidade}
              </p>
              
              {/* Detalhes do imóvel */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <span>🏠 {imovel.tipo}</span>
                {imovel.bairro && <span>� {imovel.bairro}</span>}
              </div>

              {/* Preço */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  R$ {Number(imovel.aluguelMensal).toLocaleString('pt-BR')}
                  <span className="text-sm text-gray-500">/mês</span>
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                  ✏️ Editar
                </button>
                <button className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                  🗑️ Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {imoveis.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">🏠</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Nenhum imóvel cadastrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comece adicionando seu primeiro imóvel ao portfólio
          </p>
          <Link 
            to="/admin/imoveis/novo"
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 font-bold transition-all duration-200"
          >
            <span>➕</span>
            Adicionar Primeiro Imóvel
          </Link>
        </div>
      )}
    </div>
  )
}