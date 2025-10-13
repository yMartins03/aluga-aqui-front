import { TiDeleteOutline } from "react-icons/ti"

import type { ImovelType } from "../../utils/ImovelType"
import { useAdminStore } from "../context/AdminContext"

type listaImovelProps = {
  imovel: ImovelType;
  imoveis: ImovelType[];
  setImoveis: React.Dispatch<React.SetStateAction<ImovelType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemImovel({ imovel, imoveis, setImoveis }: listaImovelProps) {
  const { admin } = useAdminStore()

  async function excluirImovel() {
    if (!admin || admin.nivel == 1) {
      alert("Você não tem permissão para excluir imóveis");
      return;
    }

    if (confirm(`Confirma a exclusão`)) {
      const response = await fetch(`${apiUrl}/imoveis/${imovel.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
          },
        },
      )

      if (response.status == 200) {
        const imoveis2 = imoveis.filter(x => x.id != imovel.id)
        setImoveis(imoveis2)
        alert("Imóvel excluído com sucesso")
      } else {
        alert("Erro... Imóvel não foi excluído")
      }
    }
  }

  // Função de destaque removida - não aplicável a imóveis

  return (
    <tr key={imovel.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {imovel.fotos ? (
          <img src={imovel.fotos} alt={`Foto do ${imovel.titulo}`}
            style={{ width: 200 }} />
        ) : (
          <div className="w-48 h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-4xl text-gray-400">🏠</span>
          </div>
        )}
      </th>
      <td className="px-6 py-4">
        {imovel.titulo}
      </td>
      <td className="px-6 py-4">
        {imovel.tipo}
      </td>
      <td className="px-6 py-4">
        {imovel.cidade}
      </td>
      <td className="px-6 py-4">
        R$ {Number(imovel.aluguelMensal).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        {imovel.disponivel ? "✅ Disponível" : "❌ Ocupado"}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
          onClick={excluirImovel} />
      </td>
    </tr>
  )
}
