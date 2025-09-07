import prisma from '@/lib/prisma'

export default async function Page() {
    const okpd2 = await prisma.okpd2.findMany();
  return (
    <ul>
        {okpd2.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
