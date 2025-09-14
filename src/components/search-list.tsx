import Link from "next/link";
import { searchOKPD2 } from "@/lib/db/queries";
import { highlightText } from "@/lib/utils";

export async function SearchList({ query }: { query: string }) {
  const list = await searchOKPD2(query);

  if (query && list.length === 0) {
    return (
      <div className="text-center border-b border-gray-100 p-4 text-gray-500">
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
            className="cursor-pointer border-b block border-gray-100 p-4 hover:bg-gray-50"
          >
            <span>[{highlightText(item.code, query)}]</span>{" "}
            <span>{highlightText(item.name, query)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
