import { getConfig } from "@/lib/search";
import { Filetree } from "@/lib/utils";
import { os } from "@orpc/server";
import {
	MdxWithBranch,
	SearchParams,
	TextSearch,
} from "@trythis/nextjs/search";
import { readFile } from "fs/promises";
import path, { join } from "path";
import * as z from "zod";

const cwd = process.cwd();
const indexDir = path.join(cwd, "search");

const ts = new TextSearch(indexDir, {
	document: getConfig(),
});

await ts.importIndex();

export type Collection = MdxWithBranch;

const DocsSearchSchema = z.object({
	query: z.string().max(200),
	limit: z.number().int().default(5),
	suggest: z.number().int().default(5),
	enrich: z.number().int().default(5),
	tag: z.any().optional(),
});

export type DocSearchParams = SearchParams<Collection>;

export const docsSearch = os
	.input(DocsSearchSchema)
	.handler(async ({ input }) => {
		const items = ts.search({ query: input.query, limit: input.limit });
		const docs = items.map((i) => i.doc);
		return docs as Collection[];
	});

export const getTopLevelFiles = os
	.input(z.object({ branchSlug: z.string() }))
	.handler(async ({ input }) => {
		const filePath = join(
			cwd,
			"source",
			input.branchSlug,
			"sidebar.json",
		);

		const file = await readFile(filePath, "utf8");

		const tree = JSON.parse(file) as Filetree;

		const filetree = Object.fromEntries(
			Object.entries(tree).filter(([, entry]) => entry.depth === 0),
		) as Filetree;

		return {
			filetree,
		};
	});
