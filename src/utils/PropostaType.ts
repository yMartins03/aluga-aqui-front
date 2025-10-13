import type { ImovelType } from "./ImovelType"
import type { ClienteType } from "./ClienteType"

export type PropostaType = {
  id: number
  clienteId: string
  imovelId: number
  imovel: ImovelType
  cliente: ClienteType
  descricao: string
  resposta: string | null
  createdAt: string
  updatedAt: string | null
}