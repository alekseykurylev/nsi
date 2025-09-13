import Link from "next/link";
import { fetchOKPD2ById } from "@/lib/data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await fetchOKPD2ById(Number(id));

  return (
    <div>
      <Link href={item.parentId ? `/okpd2/${item.parentId}` : `/okpd2`}>
        Назад
      </Link>
      <div>{item.name}</div>
    </div>
  );
}
