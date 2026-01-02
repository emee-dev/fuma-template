import { Charset, DocSearchConfig, Mdx } from "@trythis/nextjs/search";

// Note: config should not change between indexing
// Always regenerate when edited.
export const getConfig = <T>(): DocSearchConfig<T>["document"] => {
	type Collection = Mdx & { branch: string };

	const config: DocSearchConfig<Collection>["document"] = {
		id: "pathSlug",
		store: true,
		index: [
			{
				field: "label",
				tokenize: "forward",
				encoder: Charset.LatinBalance,
			},
			{
				field: "method",
				tokenize: "forward",
				encoder: Charset.LatinBalance,
			},
			{
				field: "description",
				tokenize: "forward",
				encoder: Charset.LatinBalance,
			},
		],
		tag: [{ field: "branch" }, { field: "method" }],
	};

	return config as DocSearchConfig<T>["document"];
};
