import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    const testCode = "99.99.99.999";

    const upserted = await prisma.okpd2.upsert({
        where: { code: testCode },
        update: { name: "Тестовая категория (обновлено)", actual: true },
        create: {
            code: testCode,
            parentCode: "99.99.99",
            name: "Тестовая категория",
            actual: true,
        },
    });

    console.log("Запись сохранена:", upserted);

    const total = await prisma.okpd2.count();
    console.log("Всего записей в таблице Okpd2:", total);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });