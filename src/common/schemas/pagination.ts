import type { TSchema } from "@sinclair/typebox";
import { t } from "elysia";

export const PaginationQuerySchema = t.Object({
	page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
	pageSize: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
});

export const createPaginationResponse = <T extends TSchema>(itemSchema: T) =>
	t.Object({
		total: t.Number(),
		list: t.Array(itemSchema),
	});
