import type { ImovelType } from "./utils/ImovelType"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  descricao: string
}

export default function Detalhes() {
  const params = useParams()

  const [imovel, setImovel] = useState<ImovelType>()
  const { cliente } = useClienteStore()

  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/imoveis/${params.imovelId}`)
      const dados = await response.json()
      console.log('Imóvel carregado:', dados)
      setImovel(dados)
    }
    buscaDados()
  }, [])

  async function enviaProposta(data: Inputs) {

    const response = await fetch(`${apiUrl}/propostas`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        clienteId: cliente.id,
        imovelId: Number(params.imovelId),
        descricao: data.descricao
      })
    })

    if (response.status == 201) {
      toast.success("Obrigado. Sua proposta foi enviada. Aguarde retorno")
      reset()
    } else {
      toast.error("Erro... Não foi possível enviar sua proposta")
    }
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
  
  const tipoIcon = tipoIcons[imovel?.tipo || ''] || '🏠'

  if (!imovel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🏠</span>
          <p className="text-gray-500 text-lg">Carregando detalhes do imóvel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 focus:ring-4 focus:outline-none focus:ring-emerald-300"
          >
            <span className="mr-2">←</span>
            Voltar aos Imóveis
          </button>
        </div>

        {/* Card principal do imóvel */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800 mb-8">
          <div className="md:flex">
            {/* Imagem */}
            <div className="md:w-1/2 relative">
              <img 
                className="w-full h-96 md:h-full object-cover"
                src={imovel.fotos || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&crop=center"} 
                alt="Foto do Imóvel" 
              />
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${
                  imovel.disponivel 
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-red-500 text-white shadow-lg'
                }`}>
                  {imovel.disponivel ? '✓ Disponível' : '✗ Ocupado'}
                </span>
              </div>
            </div>
            
            {/* Detalhes */}
            <div className="md:w-1/2 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{tipoIcon}</span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {imovel.titulo}
                </h1>
              </div>

              {/* Preço destacado */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-6">
                <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  R$ {Number(imovel.aluguelMensal).toLocaleString("pt-br", {
                    minimumFractionDigits: 2
                  })}
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/mês</span>
                </p>
              </div>

              {/* Informações principais */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏷️</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{imovel.tipo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {imovel.cidade}{imovel.bairro && `, ${imovel.bairro}`}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🗺️</span>
                  <span className="text-gray-700 dark:text-gray-300">{imovel.endereco}</span>
                </div>
                {imovel.cep && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📮</span>
                    <span className="text-gray-700 dark:text-gray-300">CEP: {imovel.cep}</span>
                  </div>
                )}
              </div>

              {/* Descrição */}
              {imovel.descricao && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📝 Descrição</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {imovel.descricao}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção de proposta */}
        {cliente.id ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💬</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interessado? Faça uma proposta!
              </h2>
            </div>
            
            <form onSubmit={handleSubmit(enviaProposta)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  👤 Solicitante
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400" 
                  value={`${cliente.nome} (${cliente.email})`} 
                  disabled 
                  readOnly 
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📝 Sua Proposta
                </label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full p-3 text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                  placeholder="Descreva sua proposta para este imóvel... (Ex: Valor oferecido, observações, etc.)"
                  required
                  {...register("descricao")}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span className="mr-2">📤</span>
                Enviar Proposta
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-8 text-center dark:from-emerald-900/30 dark:to-teal-900/30">
            <span className="text-4xl mb-4 block">🔑</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Gostou deste imóvel?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Faça login para enviar uma proposta e entrar em contato com o proprietário!
            </p>
            <a 
              href="/login"
              className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium transition-all duration-200"
            >
              <span className="mr-2">🚀</span>
              Fazer Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}