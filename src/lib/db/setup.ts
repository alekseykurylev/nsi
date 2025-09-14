import axios from "axios";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { XMLParser } from "fast-xml-parser";
import { Pool } from "pg";
import unzipper from "unzipper";
import { okpd2 } from "./schema";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

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
        tagValueProcessor: (tagName, tagValue) => {
          if (tagName === "code" || tagName === "parentCode") {
            return null;
          }
          return tagValue;
        },
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
  await db.delete(okpd2);

  const uniqueRecords = Array.from(
    new Map(records.map((r) => [Number(r.id), r])).values(),
  );

  console.log(`Сохраняем ${uniqueRecords.length} уникальных записей...`);

  const chunkSize = 1000;
  for (let i = 0; i < uniqueRecords.length; i += chunkSize) {
    const chunk = uniqueRecords.slice(i, i + chunkSize);
    await db
      .insert(okpd2)
      .values(
        chunk.map((r) => ({
          id: Number(r.id),
          parentId: r.parentId ? Number(r.parentId) : null,
          code: String(r.code),
          parentCode: r.parentCode ? String(r.parentCode) : null,
          name: String(r.name),
          actual: r.actual === "true" || r.actual === true,
        })),
      )
      .onConflictDoNothing();
  }
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
    await pool.end();
  }
}

main().catch(console.error);
