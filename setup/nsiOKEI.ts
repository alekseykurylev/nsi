import axios from "axios";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { XMLParser } from "fast-xml-parser";
import { Pool } from "pg";
import unzipper from "unzipper";
import { okei } from "../lib/db/schema/okei";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

const SOAP_ENDPOINT = process.env.EIS_SOAP_ENDPOINT!;
const EIS_TOKEN = process.env.EIS_PERSON_TOKEN!;

async function fetchOKEIArchives(): Promise<string[]> {
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
            <nsiCode44>nsiOKEI</nsiCode44>
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
      });

      const parsed = parser.parse(content.toString());
      const list = parsed.export?.nsiOKEIList?.nsiOKEI ?? [];
      return Array.isArray(list) ? list : [list];
    } else {
      entry.autodrain();
    }
  }

  return [];
}

async function saveToDatabase(records: any[]) {
  console.log(`Очистка таблицы okei...`);
  await db.delete(okei);

  const uniqueRecords = Array.from(
    new Map(records.map((r) => [String(r.code), r])).values(),
  );

  console.log(`Сохраняем ${uniqueRecords.length} уникальных записей...`);

  const chunkSize = 1000;
  for (let i = 0; i < uniqueRecords.length; i += chunkSize) {
    const chunk = uniqueRecords.slice(i, i + chunkSize);
    await db
      .insert(okei)
      .values(
        chunk.map((r) => ({
          code: String(r.code),
          fullName: String(r.fullName ?? ""),
          sectionCode: r.section?.code ?? null,
          sectionName: r.section?.name ?? null,
          groupId: r.group?.id ? Number(r.group.id) : null,
          groupName: r.group?.name ?? null,
          localName: r.localName ?? null,
          internationalName: r.internationalName ?? null,
          localSymbol: r.localSymbol ?? null,
          internationalSymbol: r.internationalSymbol ?? null,
          trueNationalCode: r.trueNationalCode ?? null,
          actual: r.actual === "true" || r.actual === true,
          isTemporaryForKTRU:
            r.isTemporaryForKTRU === "true" || r.isTemporaryForKTRU === true,
        })),
      )
      .onConflictDoNothing();
  }
}

async function main() {
  try {
    console.log("Запрашиваем список архивов...");
    const urls = await fetchOKEIArchives();
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

    console.log("Загрузка справочника ОКЕИ завершена ✅");
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
