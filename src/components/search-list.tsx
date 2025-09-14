import Link from "next/link";
import { autocompleteOKPD2 } from "@/lib/db/queries";
import { highlightText } from "@/lib/utils";

export async function SearchList({ query }: { query: string }) {
  const list = await autocompleteOKPD2(query);

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
            {item.code} {highlightText(item.name, query)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
