import axios from "axios";
import unzipper from "unzipper";
import { XMLParser } from "fast-xml-parser";
import { randomUUID } from "crypto";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const SOAP_ENDPOINT = process.env.EIS_SOAP_ENDPOINT!;
const EIS_TOKEN = process.env.EIS_PERSON_TOKEN!;

async function fetchOKPD2Archives(): Promise<string[]> {
  const requestXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:ws="http://zakupki.gov.ru/fz44/get-docs-ip/ws">
      <soapenv:Header>
        <individualPerson_token>${EIS_TOKEN}</individualPerson_token>
      </soapenv:Header>
      <soapenv:Body>
        <ws:getNsiRequest>
          <index>
            <id>${randomUUID()}</id>
            <createDateTime>${new Date().toISOString().slice(0, 19)}</createDateTime>
            <mode>PROD</mode>
          </index>
          <selectionParams>
            <nsiCode44>nsiOKPD2</nsiCode44>
            <nsiKind>all</nsiKind>
          </selectionParams>
        </ws:getNsiRequest>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  const { data } = await axios.post(SOAP_ENDPOINT, requestXml, {
    headers: { "Content-Type": "text/xml; charset=UTF-8" },
    timeout: 60_000,
  });

  // Находим все archiveUrl в ответе
  const urls: string[] = [];
  for (const m of (data as string).matchAll(
    /<archiveUrl>(.*?)<\/archiveUrl>/g,
  )) {
    urls.push(m[1]);
  }

  return urls;
}

async function downloadAndParseXml(url: string) {
  const response = await axios.get(url, {
    responseType: "stream",
    headers: { individualPerson_token: EIS_TOKEN },
    timeout: 120_000,
  });

  const directory = await response.data.pipe(
    unzipper.Parse({ forceStream: true }),
  );

  for await (const entry of directory) {
    if (entry.type === "File" && entry.path.endsWith(".xml")) {
      const content = await entry.buffer();
      const parser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true,
      });

      const parsed = parser.parse(content.toString());

      const list = parsed.export?.nsiOKPD2List?.nsiOKPD2 ?? [];
      return Array.isArray(list) ? list : [list];
    } else {
      entry.autodrain();
    }
  }

  return [];
}

async function saveToDatabase(records: any[]) {
  console.log(`Очистка таблицы okpd2...`);
  await prisma.okpd2.deleteMany();

  // Удаляем дубликаты по code
  const uniqueRecords = Array.from(
    new Map(records.map((r) => [String(r.code), r])).values(),
  );

  console.log(`Сохраняем ${uniqueRecords.length} уникальных записей...`);

  await prisma.okpd2.createMany({
    data: uniqueRecords.map((r) => ({
      code: String(r.code),
      parentCode: r.parentCode ? String(r.parentCode) : null,
      name: String(r.name),
      actual: r.actual === "true" || r.actual === true,
    })),
    skipDuplicates: true, // дополнительная защита
  });
}

async function main() {
  try {
    console.log("Запрашиваем список архивов...");
    const urls = await fetchOKPD2Archives();
    console.log("Получено ссылок:", urls.length);

    let allRecords: any[] = [];

    for (const url of urls) {
      console.log("Скачиваем:", url);
      const records = await downloadAndParseXml(url);
      console.log("Записей в архиве:", records.length);
      allRecords = allRecords.concat(records);
    }

    console.log("Всего записей:", allRecords.length);
    await saveToDatabase(allRecords);

    console.log("Загрузка справочника ОКПД2 завершена ✅");
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
