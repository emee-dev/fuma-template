import { getConfig } from "@/lib/search";
import manifest from "@/source/manifest.json";
import { createSearch, indexCollectionsSync } from "@trythis/nextjs/search";

const cwd = process.cwd();

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["geist"],
	images: {
		remotePatterns: [],
		unoptimized: true,
	},
	async redirects() {
		return [
			{
				source: "/api-reference",
				destination: "/api-reference/getting-started",
				permanent: true,
			},
			{
				source: "/confirm-auth",
				destination: "/",
				permanent: true,
			},
		];
	},
};

const skipIf = () => process.env.NODE_ENV !== "production";

const collections = indexCollectionsSync({ cwd, manifest, skipIf });

type Collection = (typeof collections)[number];

const withSearch = createSearch({
	outDir: "./search",
	data: collections,
	document: getConfig<Collection>(),
});

export default withSearch(nextConfig);
