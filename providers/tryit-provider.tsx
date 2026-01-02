"use client";

import type {
	ApiReferenceRequest,
	Snippet,
} from "@/components/fumastudio/api-page";
import { useDynamicSegment } from "@/hooks/use-dynamic-segment";
import { AuthSchemes, Server } from "@/lib/utils";
import { ApiKeyHeaderScheme, ApiKeyQueryScheme } from "@trythis/js-schema";
import type { Mdx } from "@trythis/nextjs/search";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type Request = Mdx;

export interface NoAuthScheme {
	type: "null";
	description: string;
}

export type Schemes = NoAuthScheme | AuthSchemes;

export type SecuritySchemes = Schemes[][number]["type"];

export type AuthValues = {
	token: string;
	username: string;
	password: string;
	apiKeyQuery: string;
	apiKeyHeader: string;
};

interface TryItState {
	baseURL: string;
	isLoading: boolean;
	responseBody: string | null;
	contentType: string | null;
	responseStatus: number | null;
	requestBody: string;
	requests: Request[];
	selectedRequest: Request | null;
	authValues: AuthValues;
	responseHeaders: string | null;
	selectedScheme: SecuritySchemes;
	responseSnippets?: Snippet[];
	servers: Server[];
	authSchemes: Schemes[];
	responseSlug: string;
	onSend: () => Promise<void>;
	setBaseURL: (url: string) => void;
	setAuthValues: (key: keyof AuthValues, value: string) => void;
	setScheme: (scheme: SecuritySchemes) => void;
	setRequestBody: (val: string) => void;
	selectRequest: (slug: string) => void;
	setResponseSlug: (slug: string) => void;
}

const TryItContext = createContext<TryItState | null>(null);

export function TryItProvider(props: {
	children: ReactNode;
	proxyPath?: string;
	intialRequests?: Request[];
	currentRequest?: Request;
	responseSnippets?: Snippet[];
	defaultRequestBody?: Record<string, any>;
	authSchemes?: Schemes[];
	servers: Server[];
	apiReferenceRequest: ApiReferenceRequest;
}) {
	const apiPath = props.proxyPath || "/api/proxy";
	const [_responseSlug, _setResponseSlug] = useState("");
	const [_isLoading, _setIsLoading] = useState(false);
	const [_baseUrl, _setBaseUrl] = useState("");
	const { navigate } = useDynamicSegment();
	const [requests, setRequests] = useState<Request[]>(
		props?.intialRequests || [],
	);
	const [_servers, _setServers] = useState<Server[]>(props?.servers || []);
	const [_authSchemes, _setAuthSchemes] = useState<Schemes[]>(() => {
		const item = [
			{
				type: "null",
				description: "No auth configured",
			} as NoAuthScheme,
		];

		if (props.authSchemes?.length === 0) {
			return item;
		}

		return props.authSchemes || item;
	});
	const [_responseSnippets, _setResponseSnippets] = useState<Snippet[]>([]);
	const [_requestBody, _setRequestBody] = useState("");
	const [_selectedRequest, _setSelectedRequest] = useState<Request | null>(
		props?.currentRequest || null,
	);

	const [selectedScheme, setSelectedScheme] = useState<SecuritySchemes>(
		_authSchemes[0].type || "null",
	);

	const [_authValues, _setAuthValues] = useState<AuthValues>({
		token: "",
		username: "",
		password: "",
		apiKeyQuery: "",
		apiKeyHeader: "",
	});

	const [_responseStatus, _setResponseStatus] = useState<number | null>(
		null,
	);
	const [_responseBody, _setResponseBody] = useState<string | null>(null);
	const [_responseHeaders, _setResponseHeaders] = useState<string | null>(
		null,
	);
	const [_contentType, _setContentType] = useState<string | null>(null);

	const onSend = async (): Promise<void> => {
		if (!_selectedRequest) return;
		if (!_baseUrl) return;
		const schemes = _authSchemes;

		try {
			_setIsLoading(true);
			const targetUrl = "x-proxy-target-url";

			let headers: Record<string, string> = {
				// TODO Trim double forward slashes
				[targetUrl]: `${_baseUrl}${props.apiReferenceRequest.url}`,
			};

			const apiKeyQueryScheme = schemes.find(
				(s: any) => s.type === "apiKeyQuery",
			) as ApiKeyQueryScheme;

			const apiKeyHeaderScheme = schemes.find(
				(s: any) => s.type === "apiKeyHeader",
			) as ApiKeyHeaderScheme;

			if (selectedScheme === "bearerAuth") {
				headers.Authorization = `Bearer ${_authValues.token}`;
			}

			if (selectedScheme === "basicAuth") {
				const encoded = Buffer.from(
					`${_authValues.username}:${_authValues.password}`,
					"base64",
				).toString("base64");

				headers.Authorization = `Basic ${encoded}`;
			}

			if (selectedScheme === "apiKeyHeader" && apiKeyHeaderScheme) {
				headers[apiKeyHeaderScheme.name] =
					_authValues.apiKeyHeader;
			}

			if (selectedScheme === "apiKeyQuery" && apiKeyQueryScheme) {
				const query = new URLSearchParams({
					[apiKeyQueryScheme.name]: _authValues.apiKeyQuery,
				});

				headers[targetUrl] += `?${query.toString()}`;
			}

			const req = await fetch(apiPath, {
				method: _selectedRequest.method,
				headers,
				body:
					_selectedRequest.method !== "GET" &&
					_selectedRequest.method !== "HEAD"
						? _requestBody
						: undefined,
			});

			const contentType =
				req.headers.get("content-type")?.toLowerCase() || null;

			const res = await req.text();

			_setContentType(contentType);
			_setResponseBody(res);
			_setResponseStatus(req.status);
			_setResponseHeaders(
				JSON.stringify(
					Object.fromEntries(req.headers.entries()),
					null,
					2,
				),
			);

			_setIsLoading(false);
		} catch (error) {
			_setIsLoading(false);
		} finally {
			_setIsLoading(false);
		}
	};

	const setAuthValues = (key: keyof AuthValues, value: string) => {
		// TODO debounce this action
		_setAuthValues((p: AuthValues) => ({
			...p,
			[key]: value,
		}));
	};

	const setScheme = (scheme: SecuritySchemes) => {
		setSelectedScheme(scheme);
	};

	const setRequestBody = (val: string) => {
		_setRequestBody(val);
	};

	const selectRequest = (slug: string) => {
		if (!requests || requests.length === 0) {
			console.warn(
				"Requests are empty, there is nothing to select.",
			);
			return;
		}

		const req = requests.find((item) => item.pathSlug === slug)!;

		if (!req) {
			return;
		}

		navigate(req.pathSlug);

		// _setSelectedRequest(req);
	};

	const setBaseURL = (value: string) => {
		_setBaseUrl(value);
	};

	const setResponseSlug = (slug: string) => {
		_setResponseSlug(slug);
	};

	useEffect(() => {
		if (
			_responseSlug &&
			props.defaultRequestBody &&
			typeof props.defaultRequestBody === "object"
		) {
			_setRequestBody(
				JSON.stringify(
					props.defaultRequestBody?.[_responseSlug] || {},
					null,
					2,
				),
			);
		}
	}, [_responseSlug, props.defaultRequestBody]);

	useEffect(() => {
		if (props.responseSnippets) {
			_setResponseSnippets(props.responseSnippets);
		}
	}, [props.responseSnippets]);

	return (
		<TryItContext.Provider
			value={{
				baseURL: _baseUrl,
				isLoading: _isLoading,
				responseStatus: _responseStatus,
				requestBody: _requestBody,
				requests,
				selectedRequest: _selectedRequest,
				authValues: _authValues,
				selectedScheme: selectedScheme,
				responseBody: _responseBody,
				contentType: _contentType,
				responseHeaders: _responseHeaders,
				responseSnippets: _responseSnippets,
				servers: _servers,
				authSchemes: _authSchemes,
				responseSlug: _responseSlug,
				onSend,
				setAuthValues,
				setScheme,
				setRequestBody,
				selectRequest,
				setBaseURL,
				setResponseSlug,
			}}>
			{props.children}
		</TryItContext.Provider>
	);
}

export const useTryIt = () => {
	const ctx = useContext(TryItContext);

	if (!ctx) throw new Error("useTryIt must be used inside TryItProvider");
	return ctx;
};
