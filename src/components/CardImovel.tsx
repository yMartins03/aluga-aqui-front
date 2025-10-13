import { Link } from "react-router-dom"
import type { ImovelType } from "../utils/ImovelType"

export function CardImovel({data}: {data: ImovelType}) {
    const tipoIcon = {
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
    }[data.tipo] || '🏠'

    return (
        <div className="max-w-sm bg-white border border-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-emerald-700 group">
            <div className="relative overflow-hidden rounded-t-2xl">
                <img 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    src={data.fotos || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center"} 
                    alt="Foto do Imóvel" 
                />
                <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                        data.disponivel 
                            ? 'bg-emerald-500 text-white shadow-lg'
                            : 'bg-red-500 text-white shadow-lg'
                    }`}>
                        {data.disponivel ? '✓ Disponível' : '✗ Ocupado'}
                    </span>
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{tipoIcon}</span>
                    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {data.titulo}
                    </h5>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 mb-4">
                    <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                        R$ {Number(data.aluguelMensal).toLocaleString("pt-br", {
                            minimumFractionDigits: 2
                        })}
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/mês</span>
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span>🏷️</span>
                        <span className="font-medium">{data.tipo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span>📍</span>
                        <span>{data.cidade}{data.bairro && `, ${data.bairro}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <span>🗺️</span>
                        <span className="text-sm">{data.endereco}</span>
                    </div>
                </div>

                <Link 
                    to={`/detalhes/${data.id}`} 
                    className="w-full inline-flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 dark:focus:ring-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <span>👁️</span>
                    <span className="ml-2">Ver Detalhes</span>
                    <svg className="rtl:rotate-180 w-4 h-4 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}