import { z } from "zod";

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type TListQuery = z.infer<typeof listQuerySchema>;

export type TPaginated<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
};

export function toLimitOffset(query: Pick<TListQuery, "page" | "pageSize">) {
  return {
    limit: query.pageSize,
    offset: (query.page - 1) * query.pageSize,
  };
}
