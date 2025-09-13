SELECT id, code, name
FROM "okpd2"
WHERE
    to_tsvector('russian', "okpd2"."name") @@ plainto_tsquery('russian', $1)
   OR to_tsvector('russian', "okpd2"."code") @@ plainto_tsquery('russian', $1)
ORDER BY code ASC
    LIMIT $2;   