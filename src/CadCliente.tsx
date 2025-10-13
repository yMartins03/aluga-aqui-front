import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "sonner"

type Inputs = {
    nome: string
    email: string
    cidade: string
    senha: string
    senha2: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function CadCliente() {
    const { register, handleSubmit } = useForm<Inputs>()

    async function cadastraCliente(data: Inputs) {
        if (data.senha != data.senha2) {
            toast.error("Erro... Senha e Confirme Senha precisam ser iguais")
            return
        }

        try {
            console.log('👤 Tentativa de cadastro:', { nome: data.nome, email: data.email, cidade: data.cidade, apiUrl })

            const response = await fetch(`${apiUrl}/clientes`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    nome: data.nome,
                    cidade: data.cidade,
                    email: data.email,
                    senha: data.senha
                })
            })

            console.log('📡 Resposta do cadastro:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url
            })

            if (response.status == 201) {
                toast.success("Ok! Cadastro realizado com sucesso...")
            } else {
                const errorText = await response.text()
                console.error('❌ Erro no cadastro:', { status: response.status, errorText })
                toast.error("Erro... Não foi possível realizar o cadastro")
            }
        } catch (error) {
            console.error('💥 Erro na requisição de cadastro:', error)
            toast.error("Erro de conexão com o servidor")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 flex items-center justify-center px-4 py-8">
            {/* Card principal de cadastro */}
            <div className="w-full max-w-lg">
                {/* Header com logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg mb-4">
                        <span className="text-4xl text-white">🏠</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Junte-se ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Aluga Aqui</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Crie sua conta e encontre o imóvel dos seus sonhos
                    </p>
                </div>

                {/* Card do formulário */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 overflow-hidden">
                    <div className="px-8 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">📝</span>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Cadastro de Cliente
                            </h2>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit(cadastraCliente)}>
                            {/* Campo Nome */}
                            <div>
                                <label htmlFor="nome" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span>👤</span>
                                    Nome Completo
                                </label>
                                <input 
                                    type="text" 
                                    id="nome"
                                    placeholder="Seu nome completo"
                                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    required
                                    {...register("nome")} 
                                />
                            </div>

                            {/* Campo E-mail */}
                            <div>
                                <label htmlFor="email" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span>📧</span>
                                    Seu e-mail
                                </label>
                                <input 
                                    type="email" 
                                    id="email"
                                    placeholder="exemplo@email.com"
                                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    required
                                    {...register("email")} 
                                />
                            </div>

                            {/* Campo Cidade */}
                            <div>
                                <label htmlFor="cidade" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span>📍</span>
                                    Cidade
                                </label>
                                <input 
                                    type="text" 
                                    id="cidade"
                                    placeholder="Sua cidade"
                                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    required
                                    {...register("cidade")} 
                                />
                            </div>

                            {/* Campo Senha */}
                            <div>
                                <label htmlFor="password" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span>🔒</span>
                                    Senha de Acesso
                                </label>
                                <input 
                                    type="password" 
                                    id="password"
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    required
                                    {...register("senha")} 
                                />
                            </div>

                            {/* Campo Confirmar Senha */}
                            <div>
                                <label htmlFor="confirm-password" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span>🔐</span>
                                    Confirme a Senha
                                </label>
                                <input 
                                    type="password" 
                                    id="confirm-password"
                                    placeholder="Confirme sua senha"
                                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    required
                                    {...register("senha2")} 
                                />
                            </div>

                            {/* Botão de cadastro */}
                            <button 
                                type="submit" 
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6"
                            >
                                <span>✨</span>
                                Criar Conta
                            </button>
                        </form>
                    </div>

                    {/* Footer do card */}
                    <div className="px-8 py-6 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-emerald-700">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Já possui uma conta?{' '}
                            <Link 
                                to="/login" 
                                className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors duration-200"
                            >
                                Faça login aqui
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Links adicionais */}
                <div className="mt-8 text-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-medium dark:text-emerald-400 transition-colors duration-200"
                    >
                        <span>←</span>
                        Voltar aos imóveis
                    </Link>
                </div>
            </div>
        </div>
    )
}