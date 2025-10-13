import { useForm } from "react-hook-form"

import { Link, useNavigate } from "react-router-dom";

import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>()    
    const { logaCliente } = useClienteStore()

    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        try {
            console.log('🔐 Tentativa de login:', { email: data.email, apiUrl })
            
            const response = await fetch(`${apiUrl}/clientes/login`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ email: data.email, senha: data.senha })
            })
            
            console.log('📡 Resposta do servidor:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url
            })

            if (response.status == 200) {
            // toast.success("Ok!")            
            const dados = await response.json()

            // "coloca" os dados do cliente no contexto
            logaCliente(dados)
            
            // se o cliente indicou que quer se manter conectado
            // salvamos os dados (id) dele em localStorage
            if (data.manter) {
                localStorage.setItem("clienteKey", dados.id)
            } else {
                // se indicou que não quer permanecer logado e tem
                // uma chave (anteriormente) salva, remove-a
                if (localStorage.getItem("clienteKey")) {
                    localStorage.removeItem("clienteKey")
                }
            }

            // carrega a página principal, após login do cliente
            navigate("/")
        } else {
            const errorText = await response.text()
            console.error('❌ Erro de login:', { status: response.status, errorText })
            toast.error("Erro... Login ou senha incorretos")
        }
        } catch (error) {
            console.error('💥 Erro na requisição de login:', error)
            toast.error("Erro de conexão com o servidor")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 flex items-center justify-center px-4 py-8">
            {/* Card principal de login */}
            <div className="w-full max-w-md">
                {/* Header com logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg mb-4">
                        <span className="text-4xl text-white">🏠</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Aluga Aqui</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Faça login para encontrar seu imóvel ideal
                    </p>
                </div>

                {/* Card do formulário */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700 overflow-hidden">
                    <div className="px-8 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">🔑</span>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Acesso do Cliente
                            </h2>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
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

                            {/* Campo Senha */}
                            <div>
                                <label htmlFor="password" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span>🔒</span>
                                    Sua senha
                                </label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 dark:bg-gray-700 dark:border-emerald-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500" 
                                    required 
                                    {...register("senha")} 
                                />
                            </div>

                            {/* Opções adicionais */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input 
                                        id="remember" 
                                        type="checkbox" 
                                        className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                        {...register("manter")} 
                                    />
                                    <label htmlFor="remember" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                        Manter conectado
                                    </label>
                                </div>
                                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500 font-medium dark:text-emerald-400">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            {/* Botão de login */}
                            <button 
                                type="submit" 
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span>🚀</span>
                                Entrar
                            </button>
                        </form>
                    </div>

                    {/* Footer do card */}
                    <div className="px-8 py-6 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-emerald-700">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Ainda não possui conta?{' '}
                            <Link 
                                to="/cadCliente" 
                                className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors duration-200"
                            >
                                Cadastre-se gratuitamente
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