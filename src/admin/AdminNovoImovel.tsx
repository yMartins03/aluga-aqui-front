import { useForm } from "react-hook-form"
import { toast, Toaster } from "sonner"
import { useEffect } from "react"
import type { TipoImovel } from "../utils/ImovelType"
import { useAdminStore } from "./context/AdminContext"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  titulo: string
  descricao: string
  endereco: string
  cidade: string
  bairro: string
  cep: string
  tipo: TipoImovel
  aluguelMensal: number
  disponivel: string  // HTML form retorna string
  fotos: string
}

export default function AdminNovoImovel() {
  const { admin } = useAdminStore()

  const {
    register,
    handleSubmit,
    reset,
    setFocus
  } = useForm<Inputs>()

  useEffect(() => {
    setFocus("titulo")
  }, [])

  async function incluirImovel(data: Inputs) {
    try {
      console.log('📊 Dados do formulário:', data)
      
      // Preparar dados conforme o schema do backend
      const novoImovel: any = {
        titulo: data.titulo,
        endereco: data.endereco,
        cidade: data.cidade,
        tipo: data.tipo,
        aluguelMensal: Number(data.aluguelMensal)
      }

      // Campos opcionais - só envia se tiver valor
      if (data.descricao && data.descricao.trim()) {
        novoImovel.descricao = data.descricao.trim()
      }
      
      if (data.bairro && data.bairro.trim()) {
        novoImovel.bairro = data.bairro.trim()
      }
      
      if (data.cep && data.cep.trim()) {
        novoImovel.cep = data.cep.trim()
      }
      
      if (data.fotos && data.fotos.trim()) {
        novoImovel.fotos = data.fotos.trim()
      }

      // Campo disponível (padrão true se não especificado)
      novoImovel.disponivel = data.disponivel === 'true'

      console.log('📤 Enviando para API:', novoImovel)
      console.log('🔗 URL da API:', `${apiUrl}/imoveis`)

      const response = await fetch(`${apiUrl}/imoveis`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin?.token || ''}`
        },
        body: JSON.stringify(novoImovel)
      })

      console.log('📥 Resposta da API:', response.status, response.statusText)

      if (response.status === 201) {
        const resultado = await response.json()
        console.log('✅ Imóvel criado:', resultado)
        toast.success("✅ Imóvel cadastrado com sucesso!")
        reset()
      } else {
        const erro = await response.text()
        console.error('❌ Erro da API:', response.status, erro)
        
        try {
          const erroJson = JSON.parse(erro)
          if (erroJson.erro && erroJson.erro.issues) {
            const mensagens = erroJson.erro.issues.map((issue: any) => 
              `${issue.path.join('.')}: ${issue.message}`
            ).join(', ')
            toast.error(`❌ Erro de validação: ${mensagens}`)
          } else {
            toast.error(`❌ Erro no cadastro: ${response.status} - ${erro}`)
          }
        } catch {
          toast.error(`❌ Erro no cadastro: ${response.status} - ${erro}`)
        }
      }
    } catch (error) {
      console.error('💥 Erro ao cadastrar imóvel:', error)
      toast.error("❌ Erro de conexão. Verifique se o backend está rodando.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl text-white">➕</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Novo <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Imóvel</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Adicione uma nova propriedade ao portfólio
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 overflow-hidden">
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit(incluirImovel)} className="space-y-6">
            {/* Título do imóvel */}
            <div>
              <label htmlFor="titulo" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>🏠</span>
                Título do Imóvel
              </label>
              <input 
                type="text" 
                id="titulo"
                placeholder="Ex: Apartamento moderno no centro da cidade"
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white"
                required
                {...register("titulo")} 
              />
            </div>

            {/* Grid de informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de imóvel */}
              <div>
                <label htmlFor="tipo" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>🏘️</span>
                  Tipo de Imóvel
                </label>
                <select 
                  id="tipo"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:text-white"
                  required
                  {...register("tipo")}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="CASA">🏠 Casa</option>
                  <option value="APARTAMENTO">🏢 Apartamento</option>
                  <option value="KITNET">🏠 Kitnet</option>
                  <option value="STUDIO">🏠 Studio</option>
                  <option value="COBERTURA">🏢 Cobertura</option>
                  <option value="SOBRADO">🏠 Sobrado</option>
                  <option value="COMERCIAL">🏪 Comercial</option>
                  <option value="SALA_COMERCIAL">🏢 Sala Comercial</option>
                  <option value="LOJA">🏪 Loja</option>
                  <option value="GALPAO">🏭 Galpão</option>
                  <option value="TERRENO">🌿 Terreno</option>
                  <option value="CHACARA">🌳 Chácara</option>
                </select>
              </div>

              {/* Aluguel mensal */}
              <div>
                <label htmlFor="aluguelMensal" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>💰</span>
                  Aluguel Mensal (R$)
                </label>
                <input 
                  type="number" 
                  id="aluguelMensal"
                  placeholder="1200.00"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white"
                  required
                  {...register("aluguelMensal")} 
                />
              </div>
            </div>

            {/* Grid de endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cidade */}
              <div>
                <label htmlFor="cidade" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>🌆</span>
                  Cidade
                </label>
                <input 
                  type="text" 
                  id="cidade"
                  placeholder="São Paulo"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white"
                  required
                  {...register("cidade")} 
                />
              </div>

              {/* Bairro */}
              <div>
                <label htmlFor="bairro" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>📍</span>
                  Bairro
                </label>
                <input 
                  type="text" 
                  id="bairro"
                  placeholder="Centro"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white"
                  {...register("bairro")} 
                />
              </div>

              {/* CEP */}
              <div>
                <label htmlFor="cep" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>📮</span>
                  CEP
                </label>
                <input 
                  type="text" 
                  id="cep"
                  placeholder="01234-567"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white"
                  {...register("cep")} 
                />
              </div>
            </div>

            {/* Endereço completo */}
            <div>
              <label htmlFor="endereco" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>🗺️</span>
                Endereço Completo
              </label>
              <input 
                type="text" 
                id="endereco"
                placeholder="Rua das Flores, 123 - Apto 45"
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white"
                required
                {...register("endereco")} 
              />
            </div>

            {/* Status do imóvel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="disponivel" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>✅</span>
                  Status do Imóvel
                </label>
                <select 
                  id="disponivel"
                  defaultValue="true"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:text-white"
                  {...register("disponivel")}
                >
                  <option value="true">✅ Disponível para aluguel</option>
                  <option value="false">❌ Indisponível</option>
                </select>
              </div>
              
              {/* Informação sobre proprietário automático */}
              <div className="flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
                <div className="text-center">
                  <span className="text-2xl mb-2 block">🤖</span>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                    Proprietário será definido automaticamente como você (admin logado)
                  </p>
                </div>
              </div>
            </div>

            {/* URL da foto */}
            <div>
              <label htmlFor="fotos" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>📸</span>
                URL da Foto Principal
              </label>
              <input 
                type="url" 
                id="fotos"
                placeholder="https://exemplo.com/foto-imovel.jpg"
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white"
                {...register("fotos")} 
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>📝</span>
                Descrição Detalhada
              </label>
              <textarea 
                id="descricao" 
                rows={4}
                placeholder="Descreva as características, comodidades e diferenciais do imóvel..."
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white resize-none"
                {...register("descricao")}
              />
            </div>

            {/* Botão de submit */}
            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>🏠</span>
                Cadastrar Imóvel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}

