"use client";

import {
  useQuery,
  useSuspenseQuery,
  type UseQueryResult,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { ZodType } from "zod";

import { ApiClientError, apiFetch } from "@/lib/api/client";

import { appendQuery, type TQueryParams } from "./query-key";

type TUseFetcherBase<TData> = {
  url: string;
  schema: ZodType<TData>;
  params?: TQueryParams;
  staleTime?: number;
};

type TUseFetcherWithEnabled<TData> = TUseFetcherBase<TData> & {
  enabled: boolean;
};

type TUseFetcherSuspense<TData> = TUseFetcherBase<TData> & {
  enabled?: undefined;
};

function createQueryOptions<TData>(props: TUseFetcherBase<TData>) {
  return {
    queryKey: [props.url, props.params ?? null, props.schema] as const,
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      apiFetch(appendQuery(props.url, props.params), props.schema, {
        signal,
        method: "GET",
      }),
    staleTime: props.staleTime,
  };
}

export function useFetcher<TData>(
  props: TUseFetcherWithEnabled<TData>,
): UseQueryResult<TData, ApiClientError>;
export function useFetcher<TData>(
  props: TUseFetcherSuspense<TData>,
): UseSuspenseQueryResult<TData, ApiClientError>;
export function useFetcher<TData>(props: TUseFetcherBase<TData> & { enabled?: boolean }) {
  const options = createQueryOptions(props);

  if (typeof props.enabled !== "undefined") {
    // The caller chooses query or suspense by passing `enabled`. That choice must stay stable for this component.
    // eslint-disable-next-line react-hooks/rules-of-hooks -- mode is fixed by the presence of `enabled`
    return useQuery({
      ...options,
      enabled: props.enabled,
    });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- paired with the useQuery branch above
  return useSuspenseQuery(options);
}
