"use client";

import { SchemaRenderer } from "@/components/fumastudio/schema-renderer";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTryIt } from "@/providers/tryit-provider";
import { AllSchema, ObjectSchema, ReplySchema } from "@trythis/js-schema";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const AuthorizationScheme = () => {
	return (
		<>
			<div className="flex flex-col w-full gap-y-4">
				<div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
					<h4 className="flex-1 mb-0 font-inter text-[1.125em] leading-normal font-semibold">
						Authorizations
					</h4>
					<div className="flex items-center"></div>
				</div>
			</div>
			<div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
				<div className="py-6">
					<div className="relative flex text-sm break-all group/param-head param-head">
						<div className="flex-1 flex content-start py-0.5 mr-5">
							<div className="flex flex-wrap items-center gap-2">
								<div className="absolute -top-1.5">
									<Link
										href="#authorization-authorization"
										className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 py-2 [.expandable-content_&amp;]:-ml-[2.1rem]"
										aria-label="Navigate to header">
										​
										<div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
											<Link2
												className="h-4"
												color="gray"
											/>
										</div>
									</Link>
								</div>
								<div className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
									Authorization
								</div>
								<div className="flex items-center gap-2 text-xs font-medium [&amp;_div]:inline [&amp;_div]:mr-2 [&amp;_div]:leading-5">
									<div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
										<span>string</span>
									</div>
									<div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
										<span>header</span>
									</div>
									<div className="px-2 py-0.5 rounded-md bg-red-100/50 dark:bg-red-400/10 text-red-600 dark:text-red-300 font-medium whitespace-nowrap">
										required
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-4">
						<div className="prose-sm prose prose-gray dark:prose-invert">
							<p className="whitespace-pre-line">
								Default authentication mechanism
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export const QueryParamsSchema = (props: { schema: ObjectSchema }) => {
	return (
		<>
			{/* <div className="flex flex-col w-full gap-y-4">
				<div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
					<h4 className="flex-1 mb-0 font-inter text-[1.125em] leading-normal font-semibold">
						Query Parameters
					</h4>
					<div className="flex items-center"></div>
				</div>
			</div>
			<div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
				<div className="py-6">
					<div className="relative flex font-mono text-sm break-all group/param-head param-head">
						<div className="flex-1 flex content-start py-0.5 mr-5">
							<div className="flex flex-wrap items-center gap-2">
								<div className="absolute -top-1.5">
									<Link
										href="#parameter-team-id"
										className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 py-2 [.expandable-content_&amp;]:-ml-[2.1rem]"
										aria-label="Navigate to header">
										​
										<div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
											<Link2
												className="h-4"
												color="gray"
											/>
										</div>
									</Link>
								</div>
								<div className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
									teamId
								</div>
								<div className="inline items-center gap-2 text-xs font-medium [&amp;_div]:inline [&amp;_div]:mr-2 [&amp;_div]:leading-5">
									<div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
										<span>string</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-4">
						<div className="prose-sm prose prose-gray dark:prose-invert">
							<p className="whitespace-pre-line">
								The Team identifier to perform
								the request on behalf of.
							</p>
						</div>
						<div className="flex prose prose-sm prose-gray dark:prose-invert mt-6 gap-1.5">
							<span>Example</span>
							<div className="prose prose-sm prose-gray dark:prose-invert overflow-wrap-anywhere text-[13px] [&amp;_*]:text-[13px]">
								<p className="whitespace-pre-line">
									<code>
										<span>
											"team_1a2b3c4d5e6f7g8h9i0j1k2l"
										</span>
									</code>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div> */}

			<div className="flex flex-col w-full gap-y-4">
				<div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
					<h4 className="flex-1 mb-0 font-inter text-[1.125em] leading-normal font-semibold">
						Query Parameters
					</h4>
					<div className="flex items-center"></div>
				</div>
			</div>
			<SchemaRenderer
				schema={props.schema}
				depth={0}
				path="query"
				type="query"
			/>
		</>
	);
};

export const PathParamsSchema = (props: { schema: ObjectSchema }) => {
	return (
		<>
			<div className="flex flex-col w-full gap-y-4">
				<div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
					<h4 className="flex-1 mb-0 font-inter text-[1.125em] leading-normal font-semibold">
						Path Parameters
					</h4>
					<div className="flex items-center"></div>
				</div>
			</div>
			<SchemaRenderer
				schema={props.schema}
				depth={0}
				path="parameter"
				type="parameter"
			/>
		</>
	);
};

export const RequestBodySchema = (props: { schema: ObjectSchema }) => {
	return (
		<>
			<div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
				<h4 className="flex-1 mb-0 font-inter text-[1.125em] leading-normal font-semibold">
					Body
				</h4>
				<span className="px-2 py-0.5 font-mono text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white">
					application/json
				</span>
			</div>

			<SchemaRenderer
				schema={props.schema}
				depth={0}
				path="body"
				type="body"
			/>
		</>
	);
};

type HttpCode = {
	status: number;
	statusText: string;
	slug: string;
};

type Properties = NonNullable<ReplySchema["properties"]>;
type ResponseBodySchemaProps = {
	httpCodes: HttpCode[];
	schema: ReplySchema;
};

export const ResponseBodySchema = (props: ResponseBodySchemaProps) => {
	const [code, setCode] = useState(String(props.httpCodes.at(0)?.status));
	const [schema, setSchema] = useState<AllSchema | null>(null);
	const { setResponseSlug } = useTryIt();

	useEffect(() => {
		if (!props.httpCodes || !props.schema) return;

		const status = props.httpCodes.find(
			(http) => http.status === Number(code),
		);

		if (!status) {
			console.log("Status not found: ", status);
			return;
		}
		const schema = (props.schema?.properties as Properties)[
			status.slug
		];

		if (schema) {
			setResponseSlug(status.slug);
			setSchema(schema);
		}
	}, [code]);

	return (
		<>
			<div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
				<h4 className="flex-1 mb-0 font-inter text-[1.125em] leading-normal font-semibold">
					Response
				</h4>
				<div className="flex items-center font-mono text-xs gap-x-3">
					<div className="px-2 py-0.5 font-medium text-gray-600 dark:text-gray-300 hover:text-zinc-950 dark:hover:text-white transition-all">
						<Select
							value={code}
							onValueChange={setCode}>
							<SelectTrigger className="h-8 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 ">
								{props.httpCodes.map(
									({ slug, status }) => (
										<SelectItem
											key={slug}
											value={String(
												status,
											)}
											className="text-xs">
											{status}
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</div>

					{schema && schema.contentType && (
						<span className="px-2 py-0.5 font-medium text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white">
							{schema.contentType}
						</span>
					)}
				</div>
			</div>

			<SchemaRenderer
				schema={schema!}
				depth={0}
				path="response"
				type="response"
			/>
		</>
	);
};
