import Link from "next/link";
import { autocompleteOKPD2 } from "@/lib/db/queries";
import { highlightText } from "@/lib/utils";

export async function SearchList({ query }: { query: string }) {
  const list = await autocompleteOKPD2(query);

  if (!query) {
    return (
      <div className="flex justify-center border-b border-gray-100 p-4 ">
        Введите запрос
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex justify-center border-b border-gray-100 p-4 ">
        Ничего не нашлось
      </div>
    );
  }

  return (
    <ul>
      {list.map((item) => (
        <li key={item.id}>
          <Link
            href={`/okpd2/${item.id}`}
            className="flex cursor-pointer items-center border-b border-gray-100 p-4 hover:bg-gray-50"
          >
            {item.code} {highlightText(item.name, query)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
