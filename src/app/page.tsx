import { getOKPD } from "@/lib/data";

export default async function Page() {
  const okpd2 = await getOKPD();

  return (
    <ul>
      {okpd2.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
