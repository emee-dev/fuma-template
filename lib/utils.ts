import httpStatues from "@/lib/http-statuses.json";
import {
	ApiKeyHeaderScheme,
	ApiKeyQueryScheme,
	ArraySchema,
	BasicAuthScheme,
	BearerAuthScheme,
	ServerSchema,
} from "@trythis/js-schema";
import { Mdx } from "@trythis/nextjs/search";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const baseUrl =
	process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const formatFiletree = (
	tree: Filetree,
	rootKey: string = "$collection_root",
) => {
	const result = { ...tree };
	for (const [pathSlug, node] of Object.entries(tree)) {
		if (node.type === "folder" && node.depth > 0) {
			const parent = Object.values(result).find(
				(n): n is FolderEntry =>
					n.type === "folder" &&
					n.children?.includes(pathSlug),
			);

			if (!parent) continue;

			// Update children for parent
			let record = result[parent.pathSlug] as FolderEntry;
			if (record && record.children && record.type === "folder") {
				(result[parent.pathSlug] as FolderEntry).children =
					parent.children.filter((c) => c !== pathSlug);
			}

			// Move the folder to root item
			(result[rootKey] as FolderEntry).children = [
				...(result[rootKey] as FolderEntry).children,
				pathSlug,
			];

			// Reset depth
			result[pathSlug] = { ...node, depth: 0 };
		}
	}

	// Sort root files first then folders
	(result[rootKey] as FolderEntry).children = (
		result[rootKey] as FolderEntry
	).children.sort((a: string, b: string) => {
		const aNode = result[a];
		const bNode = result[b];

		// 1. Files first
		if (aNode.type === "file" && bNode.type === "folder") return -1;
		if (aNode.type === "folder" && bNode.type === "file") return 1;

		// 2. Same type → alphabetical by name (fallback to slug)
		const aName = aNode.name ?? a;
		const bName = bNode.name ?? b;

		return aName.localeCompare(bName);
	});

	return result as Filetree;
};

export type FileEntry = {
	name: string;
	type: "file";
	path: string;
	slug: string;
	pathSlug: string;
	method: string;
	depth: number;
};

export type FolderEntry = {
	name: string;
	type: "folder";
	children: string[];
	path: string;
	pathSlug: string;
	depth: number;
};

export type SidebarItem = FileEntry | FolderEntry;
export type Filetree = Record<string, SidebarItem>;

type NavItem = {
	slug: string;
	label: string;
};

export type DocPagination = {
	previous: NavItem | null;
	next: NavItem | null;
};

export type FolderServerAuth = {
	serverSchema: ServerSchema;
	authSchema: AuthSchemes[];
};

export type RequestServerAuth = {
	inherit: string;
	serverSchema?: ServerSchema;
	authSchema?: AuthSchemes[];
};

export type AuthSchemes =
	| BasicAuthScheme
	| BearerAuthScheme
	| ApiKeyHeaderScheme
	| ApiKeyQueryScheme;

export type AuthServerExports = Record<
	string,
	FolderServerAuth | RequestServerAuth
>;

export type NavigationMap = Record<string, DocPagination>;

export const getHttpCodes = (schema: any) => {
	if (!schema) return null;

	const result = Object.keys(schema.properties).map(
		(slug) => httpStatues.find((data) => data.slug === slug)!,
	);

	return result.sort((l, r) => l.status - r.status);
};

export const getNearestItems = <T extends Mdx>(
	items: T[],
	pathSlug: string,
	window: number = 5,
): T[] => {
	const index = items.findIndex((item) => item?.pathSlug === pathSlug);

	if (index === -1) {
		return [];
	}

	const start = Math.max(0, index - window);
	const end = Math.min(items.length, index + window + 1);

	// Slice n amount from behind and ahead of the
	// current item including current item in the results.
	return items.slice(start, end) as T[];
};

type HttpMethod =
	| "GET"
	| "POST"
	| "DELETE"
	| "PATCH"
	| "PUT"
	| "HEAD"
	| "OPTIONS"
	| "TRACE"
	| "CONNECT";

interface StyleSet {
	method: string;
	tryit: string;
	special: string;
	badge: string;
}

interface Options {
	isSpecial?: boolean;
	isBadge?: boolean;
	tryit?: boolean;
}

export class Colors {
	private static styles: Record<HttpMethod, StyleSet> = {
		POST: {
			method: "bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-400",
			tryit: "text-blue-700 dark:text-blue-400",
			special: "text-[#3064E3] bg-[#3064E3]/10 border-[#3064E3]/30",
			badge: "bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-400",
		},
		GET: {
			method: "bg-green-400/20 dark:bg-green-400/20 text-green-700 dark:text-green-400",
			tryit: "text-green-700 dark:text-green-400",
			special: "text-[#2AB673] bg-[#2AB673]/10 border-[#2AB673]/30",
			badge: " bg-green-400/20 dark:bg-green-400/20 text-green-700 dark:text-green-400",
		},
		DELETE: {
			method: "bg-red-400/20 dark:bg-red-400/20 text-red-700 dark:text-red-400",
			tryit: "text-red-700 dark:text-red-400",
			special: "text-[#CB3A32] bg-[#CB3A32]/10 border-[#CB3A32]/30",
			badge: "bg-red-400/20 dark:bg-red-400/20 text-red-700 dark:text-red-400",
		},
		PATCH: {
			method: "bg-orange-400/20 dark:bg-orange-400/20 text-orange-700 dark:text-orange-400",
			tryit: "text-orange-700 dark:text-orange-400",
			special: "text-[#DA622B] bg-[#DA622B]/10 border-[#DA622B]/30",
			badge: "bg-orange-400/20 dark:bg-orange-400/20 text-orange-700 dark:text-orange-400",
		},
		PUT: {
			method: "bg-yellow-400/20 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
			tryit: "text-yellow-700 dark:text-yellow-400",
			special: "text-[#C28C30] bg-[#C28C30]/10 border-[#C28C30]/30",
			badge: "bg-yellow-400/20 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
		},
		HEAD: {
			method: "bg-cyan-400/20 dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-400",
			tryit: "text-cyan-700 dark:text-cyan-400",
			special: "text-[#0e7490] dark:text-[#00d3f2] bg-[#00d3f2]/10 border-[#00d3f2]/30",
			badge: "",
		},
		OPTIONS: {
			method: "bg-purple-400/20 dark:bg-purple-400/20 text-purple-700 dark:text-purple-400",
			tryit: "text-purple-700 dark:text-purple-400",
			special: "text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/30",
			badge: "",
		},
		TRACE: {
			method: "bg-pink-400/20 dark:bg-pink-400/20 text-pink-700 dark:text-pink-400",
			tryit: "text-pink-700 dark:text-pink-400",
			special: "text-[#DB2777] bg-[#DB2777]/10 border-[#DB2777]/30",
			badge: "",
		},
		CONNECT: {
			method: "bg-indigo-400/20 dark:bg-indigo-400/20 text-indigo-700 dark:text-indigo-400",
			tryit: "text-indigo-700 dark:text-indigo-400",
			special: "text-[#4F46E5] bg-[#4F46E5]/10 border-[#4F46E5]/30",
			badge: "",
		},
	};

	static req(method: string | null, options?: Options): string {
		if (!method) return "";

		const upperMethod = method.toUpperCase() as HttpMethod;
		const styleSet = Colors.styles[upperMethod];

		if (!styleSet) {
			// fallback if method is not in styles
			return options?.isSpecial
				? "text-primary bg-primary/10 border-primary/30"
				: "text-primary";
		}

		if (options?.isSpecial) {
			return styleSet.special;
		} else if (options?.isBadge) {
			return styleSet.badge;
		} else if (options?.tryit) {
			return styleSet.tryit;
		}

		return styleSet.method;
	}
}

export type ServerVariables = {
	key: string;
	enum: string[];
	default: string;
	type: "string" | "enum";
};

export type Server = ServerSchema & {
	variables: ServerVariables[];
	defaultValues: Record<string, string>;
};

export function normalizeServers(
	servers: ArraySchema | ServerSchema | ServerSchema[],
): Server[] {
	let _servers = [] as ServerSchema[];

	if (!servers) {
		console.warn(
			"[normalizeServers] Unable to normalize an undefined server",
		);
		return [];
	}

	if (Array.isArray(servers)) {
		_servers = servers;
	}

	if (
		!Array.isArray(servers) &&
		typeof servers === "object" &&
		servers.type === "array"
	) {
		_servers = servers.items as ServerSchema[];
	}

	if (
		!Array.isArray(servers) &&
		typeof servers === "object" &&
		servers.type === "server"
	) {
		_servers = [servers];
	}

	return _servers.map((server) => {
		if (!server.vars || !server.vars.properties) {
			return {
				...server,
				variables: [],
				defaultValues: {},
			};
		}

		const variables: ServerVariables[] = [];
		const defaultValues: Record<string, string> = {};

		for (const [key, prop] of Object.entries(server.vars.properties)) {
			// Render a normal input for enum-less variables
			if (!prop?.enum || prop?.enum?.length === 0) {
				if (!prop.default) {
					variables.push({
						key,
						enum: [],
						default: "",
						type: "string",
					});

					defaultValues[key] = "";
				} else {
					variables.push({
						key,
						enum: [],
						default: prop.default,
						type: "string",
					});

					defaultValues[key] = prop.default;
				}
			}

			if (prop?.enum && prop.enum.length > 0) {
				const def = prop.default ?? prop.enum[0];

				variables.push({
					key,
					enum: prop.enum,
					default: def,
					type: "enum",
				});

				defaultValues[key] = def;
			}
		}

		return {
			...server,
			variables,
			defaultValues,
		};
	});
}
