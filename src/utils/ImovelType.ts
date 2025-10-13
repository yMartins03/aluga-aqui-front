import type { ProprietarioType } from "./ProprietarioType"

export type TipoImovel = 
  | "CASA"
  | "APARTAMENTO" 
  | "KITNET"
  | "STUDIO"
  | "COBERTURA"
  | "SOBRADO"
  | "COMERCIAL"
  | "SALA_COMERCIAL"
  | "LOJA"
  | "GALPAO"
  | "TERRENO"
  | "CHACARA"

export type ImovelType = {
    id: number
    titulo: string
    descricao?: string
    endereco: string
    cidade: string
    bairro?: string
    cep?: string
    tipo: TipoImovel
    aluguelMensal: string // Decimal vem como string do backend
    disponivel: boolean
    fotos?: string
    proprietarioId: string
    proprietario?: ProprietarioType
    adminId?: string
    createdAt: string
    updatedAt: string
}