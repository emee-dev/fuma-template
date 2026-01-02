import { AuthServerExports, RequestServerAuth } from "@/lib/utils";
import authServerFile from "@/source/auth_server.json";
import { os } from "@orpc/server";
import { Mdx } from "@trythis/nextjs/search";
import { readFile } from "fs/promises";
import path from "path";
import * as z from "zod";

const cwd = process.cwd();

export const getCollection = os
	.input(z.object({ branchSlug: z.string() }))
	.handler(async ({ input }) => {
		const collections = await readFile(
			path.join(cwd, "source", input.branchSlug, "collection.json"),
			"utf8",
		);

		const mdx = JSON.parse(collections) as Mdx[];
		return mdx;
	});

export const authServerScheme = os
	.input(z.object({ pathSlug: z.string() }))
	.handler(async ({ input }) => {
		const record = (authServerFile as AuthServerExports)?.[
			input.pathSlug
			// "freejsonapi-create-post.bru"
		] as RequestServerAuth;

		if (!record) return null;

		const result = (authServerFile as AuthServerExports)?.[
			record.inherit
		];

		return {
			authSchema: result.authSchema || [],
			serverSchema: result.serverSchema,
		};
	});
