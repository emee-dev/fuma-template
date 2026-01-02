"use client";

import { DataType, Example, Required } from "@/components/fumastudio/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useSchemaAccordion } from "@/providers/schema-provider";
import { AllSchema, StringSchema } from "@trythis/js-schema";
import { Badge, Link2 } from "lucide-react";
import Link from "next/link";

type SchemaType = "parameter" | "body" | "query" | "authorization" | "response";
type SchemaRendererProps = {
	schema: AllSchema;
	depth: number;
	propName?: string;
	isRequired?: boolean;
	path: string;
	type: SchemaType;
};

export function SchemaRenderer(props: SchemaRendererProps) {
	const { schema, depth, propName, isRequired, path, type } = props;

	const { openItems, setOpenItem } = useSchemaAccordion();

	const isRootObject = depth === 0;
	const isNestedObject = depth > 0;

	const openValue = openItems[path] ?? "";

	if (!schema) return <div>Unknown schema</div>;

	if (
		typeof schema.type === "string" &&
		["string", "number"].includes(schema.type)
	) {
		const _schema = schema as StringSchema;

		return (
			<div className="primitive-param-field border-gray-100 dark:border-gray-800 border-b last:border-b-0">
				<div className={depth === 1 ? "py-6" : "py-4"}>
					<div className="flex font-mono text-sm break-all relative group/param-head param-head">
						<div className="flex-1 flex flex-col content-start py-0.5 mr-5">
							<div className="flex items-center flex-wrap gap-2">
								<div className="absolute -top-1.5">
									<Link
										href={`#${type}-${propName}`}
										className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 focus:opacity-100 focus:outline-0 py-2 [.expandable-content_&amp;]:-ml-[2.1rem] group/link">
										​
										<div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
											<Link2
												className="h-4"
												color="gray"
											/>
										</div>
									</Link>
								</div>
								<div
									id={`${type}-${propName}`}
									className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
									{propName}
								</div>

								<DataType type={_schema.type} />
								{isRequired && <Required />}
							</div>
						</div>
					</div>

					<div className="mt-4">
						{_schema.description && (
							<div className="prose-sm prose prose-gray dark:prose-invert">
								<p className="whitespace-pre-line">
									{_schema.description}
								</p>
							</div>
						)}

						{_schema.example && (
							<div className="flex prose prose-sm prose-gray dark:prose-invert mt-6 gap-1.5">
								<span>Example:</span>
								<Example
									val={_schema.example}
								/>
							</div>
						)}

						{_schema.enum && (
							<div className="flex prose prose-sm prose-gray dark:prose-invert mt-6 gap-1.5">
								<span>Available options:</span>
								{_schema.enum.map((item) => (
									<DataType
										key={item}
										type={item}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	// For nested objects
	if (schema.type === "object" && isNestedObject) {
		const entries = Object.entries(schema.properties ?? {});

		return (
			<div className="border-gray-100 dark:border-gray-800 border-b last:border-b-0 py-2">
				<div className="flex font-mono text-sm break-all relative mb-4 group/param-head param-head">
					<div className="flex-1 flex flex-col content-start py-0.5 mr-5">
						<div className="flex items-center flex-wrap gap-2">
							<div className="absolute -top-1.5">
								<Link
									href={`#${type}-${propName}`}
									className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 focus:opacity-100 focus:outline-0 py-2 [.expandable-content_&amp;]:-ml-[2.1rem] group/link">
									​
									<div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20 group-focus/link:border-2 group-focus/link:border-primary dark:group-focus/link:border-primary-light">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="gray"
											height="12px"
											viewBox="0 0 576 512">
											<path d="M0 256C0 167.6 71.6 96 160 96h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C98.1 144 48 194.1 48 256s50.1 112 112 112h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C71.6 416 0 344.4 0 256zm576 0c0 88.4-71.6 160-160 160H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c61.9 0 112-50.1 112-112s-50.1-112-112-112H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c88.4 0 160 71.6 160 160zM184 232H392c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path>
										</svg>
									</div>
								</Link>
							</div>
							<div
								id={`${type}-${propName}`}
								className="text-primary dark:text-primary-light cursor-pointer">
								{propName}
							</div>
							<Badge type={schema.type} />
						</div>
					</div>
				</div>

				{entries.length > 0 && (
					<Accordion
						className="w-full"
						collapsible
						type="single"
						value={openValue}
						onValueChange={(val) =>
							setOpenItem(path, val)
						}>
						<AccordionItem
							className="last:border-b relative rounded-lg border bg-background px-4 py-0.5 outline-none  has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
							value="item">
							<AccordionTrigger className="[&>svg]:-order-1 justify-start gap-3 rounded-md py-1.5 text-[15px] leading-6 outline-none hover:no-underline focus-visible:ring-0 font-geist font-normal text-sm">
								{openValue
									? "Hide child attributes"
									: "Show child attributes"}
							</AccordionTrigger>
							<AccordionContent>
								{entries.map(
									([
										childName,
										childSchema,
									]) => (
										<SchemaRenderer
											key={
												childName
											}
											schema={
												// childSchema as ObjectSchema
												childSchema as AllSchema
											}
											propName={
												childName
											}
											depth={
												depth +
												1
											}
											isRequired={schema.required?.includes(
												childName,
											)}
											path={`${path}.${childName}`}
											type={type}
										/>
									),
								)}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				)}
			</div>
		);
	}

	// Top level object should not be wrapped in Accordion
	if (schema.type === "object" && isRootObject) {
		const entries = Object.entries(schema.properties ?? {});

		return (
			<div className="border-gray-100 dark:border-gray-800 border-b last:border-b-0 py-2">
				{propName && (
					<div className="flex font-mono text-sm group/param-head param-head break-all relative">
						<div className="flex-1 flex flex-col content-start py-0.5 mr-5">
							<div className="flex items-center flex-wrap gap-2">
								<div className="absolute -top-1.5">
									<Link
										href={`#${type}-${propName}`}
										className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 focus:opacity-100 focus:outline-0 py-2 [.expandable-content_&amp;]:-ml-[2.1rem] group/link">
										​
										<div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20 group-focus/link:border-2 group-focus/link:border-primary dark:group-focus/link:border-primary-light">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="gray"
												height="12px"
												viewBox="0 0 576 512">
												<path d="M0 256C0 167.6 71.6 96 160 96h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C98.1 144 48 194.1 48 256s50.1 112 112 112h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C71.6 416 0 344.4 0 256zm576 0c0 88.4-71.6 160-160 160H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c61.9 0 112-50.1 112-112s-50.1-112-112-112H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c88.4 0 160 71.6 160 160zM184 232H392c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path>
											</svg>
										</div>
									</Link>
								</div>
								<div
									id={`${type}-${propName}`}
									className="font-semibold text-primary dark:text-primary-light cursor-pointer">
									{propName}
								</div>

								<Badge type={schema.type} />
							</div>
						</div>
					</div>
				)}

				{entries.length > 0 && (
					<>
						{entries.map(([childName, childSchema]) => (
							<SchemaRenderer
								key={childName}
								schema={
									// childSchema as ObjectSchema
									childSchema as AllSchema
								}
								propName={childName}
								depth={depth + 1}
								isRequired={schema.required?.includes(
									childName,
								)}
								path={`${path}.${childName}`}
								type={type}
							/>
						))}
					</>
				)}
			</div>
		);
	}

	// Response bodies
	if (schema.type === "json" && isRootObject) {
		const entries = Object.entries(schema.properties ?? {});

		return (
			<div className="border-gray-100 dark:border-gray-800 border-b last:border-b-0 py-2">
				{propName && (
					<div className="flex font-mono text-sm group/param-head param-head break-all relative">
						<div className="flex-1 flex flex-col content-start py-0.5 mr-5">
							<div className="flex items-center flex-wrap gap-2">
								<div className="absolute -top-1.5">
									<Link
										href={`#${type}-${propName}`}
										className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 focus:opacity-100 focus:outline-0 py-2 [.expandable-content_&amp;]:-ml-[2.1rem] group/link">
										​
										<div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20 group-focus/link:border-2 group-focus/link:border-primary dark:group-focus/link:border-primary-light">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="gray"
												height="12px"
												viewBox="0 0 576 512">
												<path d="M0 256C0 167.6 71.6 96 160 96h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C98.1 144 48 194.1 48 256s50.1 112 112 112h72c13.3 0 24 10.7 24 24s-10.7 24-24 24H160C71.6 416 0 344.4 0 256zm576 0c0 88.4-71.6 160-160 160H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c61.9 0 112-50.1 112-112s-50.1-112-112-112H344c-13.3 0-24-10.7-24-24s10.7-24 24-24h72c88.4 0 160 71.6 160 160zM184 232H392c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path>
											</svg>
										</div>
									</Link>
								</div>
								<div
									id={`${type}-${propName}`}
									className="font-semibold text-primary dark:text-primary-light cursor-pointer">
									{propName}
								</div>

								<Badge type={schema.type} />
							</div>
						</div>
					</div>
				)}

				{entries.length > 0 && (
					<>
						{entries.map(([childName, childSchema]) => (
							<SchemaRenderer
								key={childName}
								schema={
									childSchema as AllSchema
								}
								propName={childName}
								depth={depth + 1}
								isRequired={schema.required?.includes(
									childName,
								)}
								path={`${path}.${childName}`}
								type={type}
							/>
						))}
					</>
				)}
			</div>
		);
	}

	// Unsupported schema
	return <></>;
}
