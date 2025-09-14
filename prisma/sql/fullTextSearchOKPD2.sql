SELECT id, code, name
FROM "okpd2"
WHERE
    to_tsvector('russian', "okpd2"."name") @@ to_tsquery('russian', $1)
   OR "okpd2"."code" ILIKE '%' || $1 || '%'
ORDER BY code ASC
    LIMIT $2;
