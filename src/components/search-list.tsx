import Link from "next/link";
import { searchOKPD2 } from "@/lib/data";

export async function SearchList({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const list = await searchOKPD2(query ?? "");

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
