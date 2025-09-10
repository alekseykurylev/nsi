import { fetchOKPD2Roots } from "@/lib/data";

export default async function Page() {
  const roots = await fetchOKPD2Roots();

  return (
    <ul>
      {roots.map((item) => (
        <li key={item.id}>
          [{item.code}] {item.name}
        </li>
      ))}
    </ul>
  );
}
