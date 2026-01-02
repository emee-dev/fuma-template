import { type Router } from "@/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

declare global {
	var $client: Router | undefined;
}

const link = new RPCLink({
	url: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/orpc`,
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return await headers();
	},
});

export const client: Router = globalThis.$client ?? createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
