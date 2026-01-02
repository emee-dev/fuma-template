import { toNextjsHandler } from "@trythis/nextjs";

export const { GET, POST } = toNextjsHandler({
	projectSecret: "fs_123Usjm",
	fsSiteUrl: "https://adventurous-porcupine-420.convex.site",
});
