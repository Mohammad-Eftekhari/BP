export type TQueryParams = Record<string, string | number | boolean | null | undefined>;

export function createQueryKey(url: string, params?: TQueryParams) {
  if (!params) {
    return [url] as const;
  }

  return [url, params] as const;
}

export function appendQuery(url: string, params?: TQueryParams) {
  if (!params) {
    return url;
  }

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${url}?${query}` : url;
}
