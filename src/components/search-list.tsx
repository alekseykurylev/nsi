import Link from "next/link";
import { searchOKPD2 } from "@/lib/db/queries";

export async function SearchList({ query }: { query: string }) {
  const list = await searchOKPD2(query);

  if (!query) {
    return <div>Введите запрос</div>;
  }

  if (list.length === 0) {
    return <div>Ничего не нашлось</div>;
  }

  return (
    <ul>
      {list.map((item) => (
        <li key={item.id}>
          <Link href={`/okpd2/${item.id}`}>
            {item.code} {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
