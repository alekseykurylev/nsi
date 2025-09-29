import Link from "next/link";
import { fetchOKPD2Roots } from "@/lib/db/queries";

export default async function Page() {
  const roots = await fetchOKPD2Roots();

  return (
    <div>
      <h1 className="text-2xl font-bold">Классификатор ОКПД 2</h1>
      <p className="py-2">
        ОКПД — Общероссийский классификатор продукции по видам экономической
        деятельности.
      </p>
      <ul>
        {roots.map((item) => (
          <li key={item.id}>
            <Link
              href={`/okpd2/${item.id}`}
              className="flex cursor-pointer items-center border-b border-gray-100 p-4 hover:bg-gray-50"
            >
              [{item.code}] {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
