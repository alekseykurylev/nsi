import Link from "next/link";
import { fetchOKPD2ById } from "@/lib/db//queries";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await fetchOKPD2ById(Number(id));

  return (
    <div>
      <Link
        href={item.parentId ? `/okpd2/${item.parentId}` : `/okpd2`}
        className="flex cursor-pointer items-center border-b border-gray-100 p-4 hover:bg-gray-50"
      >
        Назад
      </Link>
      <div className="font-bold flex items-center border-b border-gray-100 p-4 ">
        [{item.code}] {item.name}
      </div>
      <ul>
        {item.children.map((i) => (
          <li key={i.id}>
            <Link
              href={`/okpd2/${i.id}`}
              className="flex cursor-pointer items-center border-b border-gray-100 p-4 hover:bg-gray-50"
            >
              [{i.code}] {i.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
