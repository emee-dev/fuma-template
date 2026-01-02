"use client";

import type { Snippet } from "@/components/fumastudio/api-page";
import { CodeBlock } from "@/components/fumastudio/code-block";
import { CheckCircleFilled } from "@/components/icons/check-circle-filled";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy } from "lucide-react";
import { useState } from "react";

export function RequestSnippets(props: { snippets: Snippet[] }) {
	const { snippets } = props;
	const hasSnippets: boolean = snippets.length > 0;
	const { isCopied, copyValue } = useClipboard();
	const [selectedId, setSelectedId] = useState<string>(
		snippets[0].id || "",
	);

	if (!hasSnippets) {
		return (
			<div className="flex items-center justify-center text-sm h-9 rounded-xl text-muted-foreground">
				No defined request.
			</div>
		);
	}

	const selectedSnippet: Snippet | undefined = snippets.find(
		(s) => s.id === selectedId,
	);

	return (
		<div className="w-full">
			<Tabs
				value={selectedId}
				onValueChange={setSelectedId}
				className="gap-0">
				<TabsList className="text-foreground w-full rounded-none bg-transparent px-1.5 h-10 flex items-center justify-between">
					<div className="flex flex-wrap items-center gap-x-1.5">
						{snippets.map((snippet) => (
							<TabsTrigger
								key={snippet.id}
								value={snippet.id}
								className="hover:bg-muted-foreground/15 px-1.5 py-1 text-xs hover:text-foreground data-[state=active]:after:bg-muted-foreground relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent">
								{snippet.id}
							</TabsTrigger>
						))}
					</div>

					<button
						className="flex items-center ml-auto transition-colors text-muted-foreground hover:text-foreground"
						onClick={() => {
							if (selectedSnippet) {
								copyValue(selectedSnippet.code);
							}
						}}
						title="Copy snippet">
						{!isCopied && <Copy className="size-4" />}

						{isCopied && (
							<CheckCircleFilled className="size-5 cursor-pointer" />
						)}
					</button>
				</TabsList>

				{snippets.map((snippet) => (
					<TabsContent
						key={snippet.id}
						value={snippet.id}
						className="relative w-full overflow-scroll border h-44 max-h-48 scrollbar-hide border-input rounded-xl">
						<div className="text-sm">
							<CodeBlock
								code={snippet.code}
								language={snippet.id}
							/>
						</div>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}

export function ResponseSnippets(props: { snippets: Snippet[] }) {
	const { snippets } = props;
	const hasSnippets = snippets.length > 0;
	const { isCopied, copyValue } = useClipboard();

	// Default selected tab is the first snippet, or empty if none
	const [selectedId, setSelectedId] = useState<string>(
		hasSnippets ? snippets[0].id : "",
	);

	if (!hasSnippets) {
		return (
			<div className="flex items-center justify-center text-sm h-9 rounded-xl text-muted-foreground">
				No defined response.
			</div>
		);
	}

	const selectedSnippet = snippets.find((s) => s.id === selectedId);

	return (
		<div className="w-full">
			<Tabs
				value={selectedId}
				onValueChange={setSelectedId}
				className="gap-0">
				<TabsList className="text-foreground w-full rounded-none bg-transparent px-1.5 h-10 flex items-center justify-between">
					<div className="flex flex-wrap items-center gap-x-1.5">
						{snippets.map((snippet) => (
							<TabsTrigger
								key={snippet.id}
								value={snippet.id}
								className="hover:bg-muted-foreground/15 px-1.5 py-1 text-xs hover:text-foreground data-[state=active]:after:bg-muted-foreground data-[state=active]:hover:bg-muted-foreground/15 relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
								{snippet.id}
							</TabsTrigger>
						))}
					</div>

					<button
						className="flex items-center ml-auto transition-colors text-muted-foreground hover:text-foreground"
						onClick={() => {
							if (selectedSnippet) {
								copyValue(selectedSnippet.code);
							}
						}}
						title="Copy snippet">
						{!isCopied && <Copy className="size-4" />}

						{isCopied && (
							<CheckCircleFilled className="size-5 cursor-pointer" />
						)}
					</button>
				</TabsList>

				{snippets.map((snippet) => (
					<TabsContent
						key={snippet.id}
						value={snippet.id}
						className="relative w-full overflow-scroll border h-44 max-h-48 scrollbar-hide border-input rounded-xl">
						<div className="text-sm">
							<CodeBlock
								code={snippet.code}
								language="Json"
							/>
						</div>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
