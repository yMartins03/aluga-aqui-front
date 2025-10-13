import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Toaster, toast } from 'sonner'
import { useAdminStore } from "./context/AdminContext"

import { useNavigate } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  email: string
  senha: string
}

export default function AdminLogin() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const navigate = useNavigate()
  const { logaAdmin } = useAdminStore()

  useEffect(() => {
    setFocus("email")
  }, [])

  async function verificaLogin(data: Inputs) {
    const response = await fetch(`${apiUrl}/admins/login`, {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ email: data.email, senha: data.senha })
    })

    // console.log(response)
    if (response.status == 200) {
      const admin = await response.json()
      logaAdmin(admin)
      navigate("/admin", { replace: true })
    } else if (response.status == 400) {
      toast.error("Erro... Login ou senha incorretos")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-800 flex items-center justify-center px-4 py-8">
      {/* Card principal de login admin */}
      <div className="w-full max-w-md">
        {/* Header com distintivo de admin */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-2xl mb-6 border-4 border-white/20">
            <span className="text-5xl text-white">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Admin</span> Portal
          </h1>
          <p className="text-gray-300 text-lg font-medium">
            🏠 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Aluga Aqui</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Área restrita - Acesso autorizado apenas
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">👑</span>
              <h2 className="text-xl font-semibold text-white">
                Acesso Administrativo
              </h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
              {/* Campo E-mail */}
              <div>
                <label htmlFor="email" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-200">
                  <span>📧</span>
                  E-mail do Administrador
                </label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="admin@alugaaqui.com"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
                  {...register("email")}
                  required
                />
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="password" className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-200">
                  <span>🔑</span>
                  Senha Administrativa
                </label>
                <input 
                  type="password" 
                  id="password"
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
                  {...register("senha")}
                  required
                />
              </div>

              {/* Botão de login */}
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:from-orange-700 hover:to-red-700 focus:ring-4 focus:outline-none focus:ring-orange-300/50 font-bold text-lg transition-all duration-200 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-0.5 mt-8"
              >
                <span>⚡</span>
                Acessar Painel Admin
              </button>
            </form>
          </div>

          {/* Footer do card */}
          <div className="px-8 py-6 bg-black/20 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <span>🛡️</span>
              <span>Ambiente seguro e protegido</span>
            </div>
          </div>
        </div>

        {/* Aviso de segurança */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            <span>⚠️</span>
            <span>Todas as ações são monitoradas e registradas</span>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
