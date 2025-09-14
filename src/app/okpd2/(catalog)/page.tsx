import Link from "next/link";
import { fetchOKPD2Roots } from "@/lib/db/queries";

export default async function Page() {
  const roots = await fetchOKPD2Roots();

  return (
    <div>
      <ul>
        {roots.map((item) => (
          <li key={item.id}>
            <Link href={`/okpd2/${item.id}`}>
              [{item.code}] {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
