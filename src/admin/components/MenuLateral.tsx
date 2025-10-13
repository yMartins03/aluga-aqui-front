import { useAdminStore } from "../context/AdminContext"
import { IoExitOutline } from "react-icons/io5"
import { BiSolidDashboard } from "react-icons/bi"
// import { FaPlus } from "react-icons/fa6" // Não usado
import { FaHome } from "react-icons/fa"
import { BsCashCoin } from "react-icons/bs"
import { FaRegUser } from "react-icons/fa"

import { Link, useNavigate } from "react-router-dom"

export function MenuLateral() {
  const navigate = useNavigate()
  const { admin, deslogaAdmin } = useAdminStore()

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      deslogaAdmin()
      navigate("/", { replace: true })
    }
  }

  return (
    <aside id="default-sidebar" className="fixed mt-24 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-4 py-6 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700">
        {/* Header do Menu */}
        <div className="mb-8 pb-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-xl text-white">🏠</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Aluga Aqui</h2>
              <p className="text-gray-400 text-sm">Painel Administrativo</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {/* Dashboard */}
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
            <span className="text-xl text-emerald-400 group-hover:text-emerald-300">
              <BiSolidDashboard />
            </span>
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Imóveis Section */}
          <div className="pt-4">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              🏠 Gestão de Imóveis
            </h3>
            
            <Link to="/admin/imoveis" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-700/30 rounded-xl transition-all duration-200 group">
              <span className="text-xl text-emerald-400 group-hover:text-emerald-300">
                <FaHome />
              </span>
              <span className="font-medium">Gerenciar Imóveis</span>
            </Link>

            <Link to="/admin/imoveis/novo" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-700/30 rounded-xl transition-all duration-200 group">
              <span className="text-xl text-emerald-400 group-hover:text-emerald-300">
                ➕
              </span>
              <span className="font-medium">Adicionar Imóvel</span>
            </Link>
          </div>

          {/* Propostas Section */}
          <div className="pt-4">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              📝 Negócios
            </h3>
            
            <Link to="/admin/propostas" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-orange-700/30 rounded-xl transition-all duration-200 group">
              <span className="text-xl text-orange-400 group-hover:text-orange-300">
                <BsCashCoin />
              </span>
              <span className="font-medium">Propostas de Aluguel</span>
            </Link>
          </div>

          {/* Admin Section */}
          {admin.nivel == 3 && (
            <div className="pt-4">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                ⚙️ Sistema
              </h3>
              
              <Link to="/admin/cadAdmin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-700/30 rounded-xl transition-all duration-200 group">
                <span className="text-xl text-blue-400 group-hover:text-blue-300">
                  <FaRegUser />
                </span>
                <span className="font-medium">Administradores</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer - Sair */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center gap-3 px-4 py-2 text-gray-400 mb-3">
              <span className="text-sm">👤 {admin.nome || admin.email}</span>
            </div>
            <button 
              onClick={adminSair}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-700/30 rounded-xl transition-all duration-200 group"
            >
              <span className="text-xl text-red-400 group-hover:text-red-300">
                <IoExitOutline />
              </span>
              <span className="font-medium">Sair do Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}