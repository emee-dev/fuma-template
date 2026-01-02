import { RouterClient } from "@orpc/server";
import { docsSearch, getTopLevelFiles } from "./routes/docs";
import * as server from "./routes/server";

export const router = {
	docsSearch,
	getTopLevelFiles,
	server,
};

export type Router = RouterClient<typeof router>;
