import { router } from "@/orpc";
import { createRouterClient } from "@orpc/server";
import "server-only";

globalThis.$client = createRouterClient(router);
