"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import type { ZodType } from "zod";

import { ApiClientError, apiFetch } from "@/lib/api/client";

type TSenderMethod = "POST" | "PUT" | "PATCH" | "DELETE";

type TUseSenderOptions<TData> = {
  url: string;
  method: TSenderMethod;
  schema: ZodType<TData>;
  invalidateKeys?: QueryKey[];
};

export function useSender<TData, TBody>({
  url,
  method,
  schema,
  invalidateKeys,
}: TUseSenderOptions<TData>) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiClientError, TBody>({
    mutationFn: (body) =>
      apiFetch(url, schema, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
    onSuccess: async () => {
      if (!invalidateKeys?.length) {
        return;
      }

      await Promise.all(
        invalidateKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      );
    },
  });
}
