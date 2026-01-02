"use client";

import { cn } from "@/lib/utils";
import { ShikiHighlighter, Language as ShikiLanguage } from "react-shiki";

const supportedKeys: Record<string, ShikiLanguage> = {
	Typescript: "typescript",
	Javascript: "javascript",
	Json: "json",
	cURL: "bash",
	axios: "typescript",
	fetch: "typescript",
};

type Language = keyof typeof supportedKeys;
type CodeBlockProps = {
	code: string;
	language?: ShikiLanguage;
	className?: string;
};

export const CodeBlock = (props: CodeBlockProps) => {
	const language = props.language as Language;

	return (
		<ShikiHighlighter
			// Default to bash if undefined
			language={
				language
					? supportedKeys[language]
					: supportedKeys["cURL"]
			}
			theme="github-light-default"
			showLanguage={false}
			className={cn(
				props.className,
				"h-full text-xs leading-[1.35rem]",
			)}>
			{props.code.trim()}
		</ShikiHighlighter>
	);
};
