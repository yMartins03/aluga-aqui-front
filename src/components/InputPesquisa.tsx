import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ImovelType } from "../utils/ImovelType";

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setImoveis: React.Dispatch<React.SetStateAction<ImovelType[]>>
}

export function InputPesquisa({ setImoveis }: InputPesquisaProps) {
    const { register, handleSubmit, reset } = useForm<Inputs>()

    async function enviaPesquisa(data: Inputs) {
        // alert(data.termo)
        if (data.termo.length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        // Por enquanto, usar rota de imóveis geral (implementar pesquisa no backend depois)
        const response = await fetch(`${apiUrl}/imoveis`)
        const dados = await response.json()
        // Filtrar por termo localmente até backend ter rota de pesquisa
        const filtrados = dados.filter((imovel: ImovelType) => 
            imovel.titulo.toLowerCase().includes(data.termo.toLowerCase()) ||
            imovel.cidade.toLowerCase().includes(data.termo.toLowerCase()) ||
            imovel.tipo.toLowerCase().includes(data.termo.toLowerCase())
        )
        setImoveis(filtrados)
    }

    async function mostraTodos() {
        const response = await fetch(`${apiUrl}/imoveis`)
        const dados = await response.json()
        reset({ termo: "" })
        setImoveis(dados)
    }

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
                <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Buscar Imóveis</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                            <span className="text-xl">🔍</span>
                        </div>
                        <input 
                            type="search" 
                            id="default-search" 
                            className="block w-full p-4 ps-12 text-sm text-gray-900 border-2 border-emerald-200 rounded-xl bg-white focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 shadow-sm"
                            placeholder="🏠 Busque por tipo, cidade, bairro..." 
                            required 
                            {...register('termo')} 
                        />
                        <button 
                            type="submit" 
                            className="text-white absolute end-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-6 py-2 dark:focus:ring-emerald-800 transition-all duration-200 shadow-md"
                        >
                            🔎 Buscar
                        </button>
                    </div>
                </form>
                
                <button 
                    type="button" 
                    className="lg:mt-0 focus:outline-none text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-200 focus:ring-4 focus:ring-emerald-100 font-medium rounded-xl text-sm px-6 py-4 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/50 dark:focus:ring-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                    onClick={mostraTodos}
                >
                    🏠 Todos os Imóveis
                </button>
            </div>
        </div>
    )
}