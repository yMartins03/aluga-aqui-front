import { CardImovel } from "./components/CardImovel";
import { InputPesquisa } from "./components/InputPesquisa";
import type { ImovelType } from "./utils/ImovelType";
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [imoveis, setImoveis] = useState<ImovelType[]>([])
  const { logaCliente } = useClienteStore()  

  useEffect(() => {
    async function buscaDados() {
      try {
        console.log('Tentando buscar dados em:', `${apiUrl}/imoveis`)
        const response = await fetch(`${apiUrl}/imoveis`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const dados = await response.json()
        console.log('Dados recebidos:', dados)
        setImoveis(dados)
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error)
        setImoveis([]) // Define array vazio em caso de erro
      }
    }
    buscaDados()

    async function buscaCliente(id: string) {
      try {
        console.log('Tentando buscar cliente:', `${apiUrl}/clientes/${id}`)
        const response = await fetch(`${apiUrl}/clientes/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const dados = await response.json()
        console.log('Cliente encontrado:', dados)
        logaCliente(dados)
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
      }
    }
    if (localStorage.getItem("clienteKey")) {
      const idCliente = localStorage.getItem("clienteKey")
      buscaCliente(idCliente as string)
    }    
  }, [])

  const listaImoveis = imoveis.map( imovel => (
    <CardImovel data={imovel} key={imovel.id} />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl dark:text-white">
            Encontre seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">lar ideal</span>
          </h2>
          <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl dark:text-gray-400 max-w-3xl mx-auto">
            Milhares de imóveis disponíveis para aluguel. Apartamentos, casas, kitinets e muito mais, 
            nos melhores bairros da cidade.
          </p>
        </div>

        <InputPesquisa setImoveis={setImoveis} />
        
        {/* Seção de Imóveis */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🏘️</span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Imóveis Disponíveis
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-emerald-900 dark:text-emerald-300">
              {listaImoveis.length} encontrados
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listaImoveis.length > 0 ? listaImoveis : (
              <div className="col-span-full text-center py-12">
                <span className="text-6xl mb-4 block">🏠</span>
                <p className="text-gray-500 text-lg">Nenhum imóvel encontrado</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold">Aluga Aqui</span>
          </div>
          <p className="text-emerald-200">© 2025 Aluga Aqui. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
