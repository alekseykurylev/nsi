export async function SearchList({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  return (
    <ul>
      <li>{query}</li>
    </ul>
  );
}
