import {
	DocsFooter,
	DocsPagination,
} from "@/components/fumastudio/api-page-footer";
import {
	RequestSnippets,
	ResponseSnippets,
} from "@/components/fumastudio/api-snippets";
import { CopyPageButton } from "@/components/fumastudio/copy-page";
import { DocsUrl } from "@/components/fumastudio/docs-url";
import {
	AuthorizationScheme,
	PathParamsSchema,
	QueryParamsSchema,
	RequestBodySchema,
	ResponseBodySchema,
} from "@/components/fumastudio/schema";
import { client } from "@/lib/orpc";
import { getHttpCodes, getNearestItems, normalizeServers } from "@/lib/utils";
import { SchemaProvider } from "@/providers/schema-provider";
import { TryItProvider } from "@/providers/tryit-provider";
import {
	FactoryObject,
	ObjectSchema,
	ReplySchema,
	toFactory,
	v,
} from "@trythis/js-schema";

export type DocPagination = Record<
	"previous" | "next",
	{ slug: string; label: string }
>;

export interface Snippet {
	id: string;
	code: string;
}

export interface AuthConfig {
	type: string;
	payload?: any;
}

export interface ApiReferenceRequest {
	folder: string;
	name: string;
	description: string;
	method: string;
	url: string;
}

export type ApiPageProps = {
	request: ApiReferenceRequest;
	request_snippets: Snippet[];
	response_snippets: Snippet[];
	schema?: string;
	// Special props will be provided at runtime.
	serverCtx: Record<string, any> | null;
	pagination: DocPagination | null;
};

export const ApiPage = async ({
	request,
	pagination = null,
	request_snippets,
	response_snippets,
	schema = "",
	serverCtx = null,
}: ApiPageProps) => {
	const pathSlug = serverCtx?.pathSlug;
	const branchSlug = serverCtx?.currentBranch;

	if (!request) {
		console.log("No request");
		return null;
	}

	const { error, data } = toFactory(schema);

	if (error) {
		console.error(error);
	}

	const requestBodySchema =
		(v.toJSONSchema(data?.exports?.requestBody) as ObjectSchema) ||
		null;

	const paramsQuerySchema =
		(v.toJSONSchema(data?.exports?.paramsQuery) as ObjectSchema) ||
		null;

	const paramsPathSchema =
		(v.toJSONSchema(data?.exports?.paramsPath) as ObjectSchema) || null;

	const authServer = await client.server.authServerScheme({
		pathSlug,
	});

	if (!authServer?.serverSchema) {
		throw new Error("Server schemes are required.");
	}

	const servers = normalizeServers(authServer.serverSchema);
	const responseBody = data?.exports?.responseBody as FactoryObject;
	const responseBodyMock = responseBody?.genMock?.() || {};
	const responseBodySchema =
		(v.toJSONSchema(responseBody) as ReplySchema) || null;

	const httpCodes = getHttpCodes(responseBodySchema);

	const collections = await client.server.getCollection({ branchSlug });

	const paginatedItems = getNearestItems(collections, pathSlug);

	const currentRequest = paginatedItems.find(
		(r) => r.pathSlug === pathSlug,
	);

	return (
		<TryItProvider
			proxyPath="/api/proxy"
			intialRequests={paginatedItems}
			currentRequest={currentRequest}
			responseSnippets={response_snippets}
			authSchemes={authServer?.authSchema || []}
			servers={servers}
			defaultRequestBody={responseBodyMock}
			apiReferenceRequest={request}>
			<div className="w-full h-full">
				<header className="relative font-sans">
					<div className="mt-0.5 space-y-2.5">
						<div className="h-5 text-sm font-semibold text-primary dark:text-primary-light">
							{request.folder}
						</div>
						<div className="relative flex flex-col items-start gap-2 sm:flex-row sm:items-center">
							<h1 className="inline-block text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-200">
								{request.name}
							</h1>
							<div className="items-center shrink-0 min-w-[156px] justify-end ml-auto sm:flex hidden">
								<CopyPageButton
									schema={schema}
								/>
							</div>
						</div>
					</div>
					<div className="mt-2 text-lg prose prose-gray dark:prose-invert">
						<p>{request.description}</p>
					</div>
				</header>

				<DocsUrl url={request.url} method={request.method} />

				<div className="flex flex-col bg-accent border-input border gap-0 mt-6 px-1.5 pb-1.5 rounded-xl">
					<RequestSnippets snippets={request_snippets} />
				</div>

				<div className="flex flex-col bg-accent border-input border gap-0 mt-6 px-1.5 pb-1.5 rounded-xl">
					<ResponseSnippets snippets={response_snippets} />
				</div>

				<div className="mt-6 font-sans">
					<AuthorizationScheme />
				</div>

				<SchemaProvider>
					{paramsQuerySchema && (
						<div className="mt-6 font-sans">
							<QueryParamsSchema
								schema={paramsQuerySchema}
							/>
						</div>
					)}

					{paramsPathSchema && (
						<div className="mt-6 font-sans">
							<PathParamsSchema
								schema={paramsPathSchema}
							/>
						</div>
					)}

					{requestBodySchema && (
						<div className="mt-6 font-sans">
							<RequestBodySchema
								schema={requestBodySchema}
							/>
						</div>
					)}

					{httpCodes && responseBodySchema && (
						<div className="mt-6 font-sans">
							<ResponseBodySchema
								httpCodes={httpCodes}
								schema={responseBodySchema}
							/>
						</div>
					)}
				</SchemaProvider>

				{pagination && (
					<DocsPagination
						previous={pagination.previous}
						next={pagination.next}
					/>
				)}

				<DocsFooter />
			</div>
		</TryItProvider>
	);
};
