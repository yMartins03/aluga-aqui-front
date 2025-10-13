import { TiDeleteOutline } from "react-icons/ti"
import { FaRegEdit  } from "react-icons/fa"
import type { PropostaType } from "../../utils/PropostaType"
import { useAdminStore } from "../context/AdminContext"

type listaPropostaProps = {
  proposta: PropostaType,
  propostas: PropostaType[],
  setPropostas: React.Dispatch<React.SetStateAction<PropostaType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemProposta({ proposta, propostas, setPropostas }: listaPropostaProps) {

  const { admin } = useAdminStore()

  async function excluirProposta() {

    if (confirm(`Confirma Exclusão da Proposta "${proposta.descricao}"?`)) {
      const response = await fetch(`${apiUrl}/propostas/${proposta.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
          },
        },
      )

      if (response.status == 200) {
        const propostas2 = propostas.filter(x => x.id != proposta.id)
        setPropostas(propostas2)
        alert("Proposta excluída com sucesso")
      } else {
        alert("Erro... Proposta não foi excluída")
      }
    }
  }

  async function responderProposta() {
    const respostaAlugaAqui = prompt(`Resposta do Aluga Aqui para "${proposta.descricao}"`)

    if (respostaAlugaAqui == null || respostaAlugaAqui.trim() == "") {
      return
    }

    const response = await fetch(`${apiUrl}/propostas/${proposta.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
        body: JSON.stringify({resposta: respostaAlugaAqui})
      },
    )

    if (response.status == 200) {
      const propostas2 = propostas.map(x => {
        if (x.id == proposta.id) {
          return { ...x, resposta: respostaAlugaAqui}
        }
        return x
      })
      setPropostas(propostas2)
    }
  }

  return (
    <tr key={proposta.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {proposta.imovel?.fotos ? (
          <img src={proposta.imovel.fotos} alt="Foto do Imóvel"
            style={{ width: 200 }} />
        ) : (
          <div className="w-48 h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-4xl text-gray-400">🏠</span>
          </div>
        )}
      </th>
      <td className={"px-6 py-4"}>
        {proposta.imovel?.titulo}
      </td>
      <td className={"px-6 py-4"}>
        R$ {Number(proposta.imovel?.aluguelMensal || 0).toLocaleString("pt-br", {minimumFractionDigits: 2})}
      </td>
      <td className={`px-6 py-4`}>
        {proposta.cliente.nome}
      </td>
      <td className={`px-6 py-4`}>
        {proposta.descricao}
      </td>
      <td className={`px-6 py-4`}>
        {proposta.resposta}
      </td>
      <td className="px-6 py-4">
        {proposta.resposta ? 
          <>
            <img src="/ok.png" alt="Ok" style={{width: 60}} />
          </>
        :
          <>
            <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
              onClick={excluirProposta} />&nbsp;
            <FaRegEdit className="text-3xl text-yellow-600 inline-block cursor-pointer" title="Destacar"
              onClick={responderProposta} />
          </>
        }
      </td>

    </tr>
  )
}