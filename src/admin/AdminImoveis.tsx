import { useEffect, useState } from "react"

import type { ImovelType } from "../utils/ImovelType"
import { Link } from "react-router-dom"
import { useAdminStore } from "./context/AdminContext"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminImoveis() {
  const [imoveis, setImoveis] = useState<ImovelType[]>([])
  const { admin } = useAdminStore()

  useEffect(() => {
    async function getImoveis() {
      const response = await fetch(`${apiUrl}/imoveis`)
      const dados = await response.json()
      setImoveis(dados)
    }
    getImoveis()
  }, [])

  async function excluirImovel(id: number, titulo: string) {
    if (!admin) {
      toast.error("Você precisa estar logado como admin");
      return;
    }

    if (confirm(`Confirma a exclusão do imóvel: ${titulo}?`)) {
      try {
        console.log('Tentando excluir imóvel:', { id, titulo });
        
        const response = await fetch(`${apiUrl}/imoveis/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
          },
        });

        if (response.ok) {
          const imoveisAtualizados = imoveis.filter(x => x.id !== id);
          setImoveis(imoveisAtualizados);
          toast.success("Imóvel excluído com sucesso");
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Erro ao excluir:', response.status, errorData);
          toast.error(`Erro ao excluir imóvel: ${errorData.message || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.error("Erro ao excluir imóvel:", error);
        toast.error("Erro de conexão ao excluir imóvel");
      }
    }
  }

  async function editarImovel(id: number) {
    if (!admin) {
      toast.error("Você precisa estar logado como admin");
      return;
    }

    const imovel = imoveis.find(i => i.id === id);
    if (!imovel) {
      toast.error("Imóvel não encontrado");
      return;
    }

    // Edição simples usando prompts
    const novoTitulo = prompt("Novo título do imóvel:", imovel.titulo);
    if (novoTitulo === null || novoTitulo.trim() === "") {
      toast.error("Título não pode estar vazio");
      return;
    }

    const novoPreco = prompt("Novo preço de aluguel (apenas números):", imovel.aluguelMensal);
    if (novoPreco === null) return; // Usuário cancelou

    // Validar se o preço é um número válido
    const precoNumerico = parseFloat(novoPreco.replace(',', '.'));
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      toast.error("Preço inválido. Digite apenas números válidos.");
      return;
    }

    try {
      console.log('Tentando atualizar imóvel:', { id, titulo: novoTitulo, aluguelMensal: precoNumerico });
      
      // O backend usa PUT para edição
      const response = await fetch(`${apiUrl}/imoveis/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
        body: JSON.stringify({
          titulo: novoTitulo.trim(),
          aluguelMensal: precoNumerico
        })
      });

      console.log('Resposta do servidor - Status:', response.status);
      
      if (response.ok) {
        // Recarregar a lista de imóveis para garantir dados atualizados
        const responseImoveis = await fetch(`${apiUrl}/imoveis`);
        const dadosAtualizados = await responseImoveis.json();
        setImoveis(dadosAtualizados);
        toast.success("Imóvel atualizado com sucesso!");
      } else {
        // Tentar ler a resposta de erro
        let errorMessage = `Erro ${response.status}`;
        try {
          const responseData = await response.json();
          console.error('Erro na resposta:', response.status, responseData);
          
          if (responseData.erro) {
            errorMessage = responseData.erro;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.detalhes && Array.isArray(responseData.detalhes)) {
            errorMessage = responseData.detalhes.map((d: any) => d.message).join(', ');
          }
        } catch (e) {
          console.error('Erro ao ler resposta JSON:', e);
          errorMessage = response.statusText || 'Erro desconhecido';
        }
        
        toast.error(`Erro ao atualizar imóvel: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Erro ao editar imóvel:", error);
      toast.error("Erro de conexão ao editar imóvel");
    }
  }

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
                <button 
                  onClick={() => editarImovel(imovel.id)}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => excluirImovel(imovel.id, imovel.titulo)}
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
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