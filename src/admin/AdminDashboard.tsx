import './AdminDashboard.css'
import { useEffect, useState } from "react";
import { VictoryPie, VictoryLabel, VictoryTheme } from "victory";

const apiUrl = import.meta.env.VITE_API_URL

type graficoTipoType = {
  tipo: string
  num: number
}

type graficoClienteType = {
  cidade: string
  num: number
}

type geralDadosType = {
  clientes: number
  imoveis: number
  propostas: number
}

export default function AdminDashboard() {
  const [imoveisTipo, setImoveisTipo] = useState<graficoTipoType[]>([])
  const [clientesCidade, setClientesCidade] = useState<graficoClienteType[]>([])
  const [dados, setDados] = useState<geralDadosType>({} as geralDadosType)

  useEffect(() => {
    async function getDadosGerais() {
      const response = await fetch(`${apiUrl}/dashboard/gerais`)
      const dados = await response.json()
      setDados(dados)
    }
    getDadosGerais()

    async function getDadosGraficoTipo() {
      const response = await fetch(`${apiUrl}/dashboard/imoveisTipo`)
      const dados = await response.json()
      setImoveisTipo(dados)
    }
    getDadosGraficoTipo()

    async function getDadosGraficoCliente() {
      const response = await fetch(`${apiUrl}/dashboard/clientesCidade`)
      const dados = await response.json()
      setClientesCidade(dados)
    }
    getDadosGraficoCliente()

  }, [])

  const listaImoveisTipo = imoveisTipo.map(item => (
    { x: item.tipo, y: item.num }
  ))

  const listaClientesCidade = clientesCidade.map(item => (
    { x: item.cidade, y: item.num }
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900 p-6">
      {/* Header do Dashboard */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl text-white">📊</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Aluga Aqui</span>
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg ml-16">
          Visão geral completa do seu negócio imobiliário
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Clientes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">👥</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dados.clientes}</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Clientes Ativos</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total de clientes cadastrados</p>
        </div>

        {/* Card Imóveis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">🏠</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{dados.imoveis}</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Imóveis Disponíveis</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total de propriedades no sistema</p>
        </div>

        {/* Card Propostas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📝</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{dados.propostas}</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Propostas Ativas</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Solicitações de aluguel pendentes</p>
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico Tipos de Imóveis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-xl text-white">🏘️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Distribuição por Tipo de Imóvel
            </h2>
          </div>
          <div className="h-96 flex items-center justify-center">
            <svg viewBox="30 55 400 400" className="w-full h-full">
              <VictoryPie
                standalone={false}
                width={400}
                height={400}
                data={listaImoveisTipo}
                innerRadius={60}
                labelRadius={90}
                theme={VictoryTheme.clean}
                colorScale={["#059669", "#0d9488", "#0891b2", "#0284c7", "#3b82f6", "#6366f1"]}
                style={{
                  labels: {
                    fontSize: 11,
                    fill: "#fff",
                    fontFamily: "Arial",
                    fontWeight: "bold"
                  }
                }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{
                  fontSize: 14,
                  fill: "#059669",
                  fontFamily: "Arial",
                  fontWeight: "bold"
                }}
                x={200}
                y={200}
                text={["Tipos de", "Imóveis"]}
              />
            </svg>
          </div>
        </div>

        {/* Gráfico Clientes por Cidade */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-xl text-white">🌍</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Clientes por Localização
            </h2>
          </div>
          <div className="h-96 flex items-center justify-center">
            <svg viewBox="30 55 400 400" className="w-full h-full">
              <VictoryPie
                standalone={false}
                width={400}
                height={400}
                data={listaClientesCidade}
                innerRadius={60}
                labelRadius={90}
                theme={VictoryTheme.clean}
                colorScale={["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a"]}
                style={{
                  labels: {
                    fontSize: 11,
                    fill: "#fff",
                    fontFamily: "Arial",
                    fontWeight: "bold"
                  }
                }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{
                  fontSize: 14,
                  fill: "#dc2626",
                  fontFamily: "Arial",
                  fontWeight: "bold"
                }}
                x={200}
                y={200}
                text={["Clientes por", "Cidade"]}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}