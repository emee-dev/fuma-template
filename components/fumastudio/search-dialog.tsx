"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useDynamicSegment } from "@/hooks/use-dynamic-segment";
import { orpc } from "@/lib/orpc";
import { Colors } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
	ChevronRight,
	Search,
	SquareTerminal,
	WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const DocSearch = () => {
	const [query, setQuery] = useState("");
	const debouncedValue = useDebounce(query);
	const { createSlug } = useDynamicSegment();
	const [searchOpen, setSearchOpen] = useState(false);

	const { data, isLoading, error } = useQuery(
		orpc.docsSearch.queryOptions({
			input: { query: debouncedValue },
			initialData: [],
			enabled: debouncedValue !== "",
		}),
	);

	const BreadCrumbs = (props: { filePath: string }) => {
		// Breaks a URI into individual parts separated by a forward slash
		const tokens = props.filePath.match(/\/|{[^}]+}|[^/]+/g) ?? [];

		return (
			<div className="flex items-center flex-1 min-w-0">
				{tokens.map((item, index) => {
					const key = `${item}-${index}`;

					if (item === "/") {
						const stripped = item.replace("/", "");
						return (
							<div
								key={key}
								className="flex items-center shrink min-w-0">
								<ChevronRight className="mx-0.5 shrink-0 size-3 text-gray-500 dark:text-gray-400" />
								<div className="[&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light text-xs text-gray-500 dark:text-gray-400 truncate">
									{stripped}
								</div>
							</div>
						);
					}

					return (
						<div
							key={key}
							className="flex items-center shrink-0">
							<div className="truncate [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light text-xs text-gray-500 dark:text-gray-400 w-fit">
								{item}
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setSearchOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<div
				className="mx-2 w-full flex-1 flex md:w-auto md:flex-none"
				onClick={() => setSearchOpen(!searchOpen)}>
				<button
					type="button"
					aria-haspopup="dialog"
					aria-expanded="false"
					className="relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-clip-padding text-sm font-medium whitespace-nowrap transition-shadow outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 border-border bg-background shadow-xs not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-input/32 dark:not-in-data-[slot=group]:bg-clip-border dark:not-disabled:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/4%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/8%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-accent/50 dark:[:hover,[data-pressed]]:bg-input/64 min-h-8 px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] hover:bg-accent">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={24}
						height={24}
						viewBox="0 0 24 24"
						fill="none"
						strokeWidth={2}
						stroke="currentColor">
						<path
							d="M17 17L21 21"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
						/>
						<path
							d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
						/>
					</svg>

					<div className="gap-1 sm:flex">
						<kbd className="pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3">
							Ctrl
						</kbd>
						<kbd className="pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3 aspect-square">
							K
						</kbd>
					</div>
				</button>
			</div>

			<Dialog open={searchOpen} onOpenChange={setSearchOpen}>
				<DialogContent
					className="max-w-88 md:max-w-2xl translate-y-1 top-10 p-1.5 gap-0 bg-accent border-none rounded-2xl sm:rounded-2xl"
					hiddenCloseButton>
					<DialogHeader className="sr-only">
						<DialogTitle>Document search</DialogTitle>
						<DialogDescription>
							Search for relevant collections.
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center px-3 py-1 border border-black/50 gap-x-2 rounded-lg">
						<Search className="w-5 h-5 text-gray-400" />
						<Input
							value={query}
							placeholder="Search..."
							onChange={(e) =>
								setQuery(e.target.value)
							}
							className="p-0 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						{query && (
							<kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border rounded">
								ESC
							</kbd>
						)}
					</div>
					<div className="overflow-y-auto max-h-96">
						{isLoading && (
							<div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
								Searching…
							</div>
						)}

						{!isLoading && error && (
							<div className="flex items-center justify-center py-6 text-sm text-red-500">
								{error.message}
							</div>
						)}

						{!isLoading &&
							!error &&
							data &&
							data.length === 0 &&
							debouncedValue && (
								<div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
									No results found.
								</div>
							)}

						{data &&
							data.length > 0 &&
							data.map((item, index) => {
								const pathSlug =
									createSlug(
										item.pathSlug,
									) || "/";

								return (
									<div
										className="last:mb-2 group first:mt-3"
										role="option"
										tabIndex={-1}
										key={item.pathSlug}>
										<Link
											href={
												pathSlug
											}>
											<div className="cursor-pointer relative rounded-xl flex gap-3 px-2.5 py-2 items-center">
												<SquareTerminal className="w-4 h-4 shrink-0 text-primary dark:text-primary-light" />
												<div className="flex flex-col flex-1 min-w-0 gap-1">
													<div className="flex items-center gap-1">
														<BreadCrumbs
															// Remove the first forward slash to avoid have > as first char
															filePath={item.pathSlug.replace(
																"/",
																"",
															)}
														/>
													</div>
													<div className="flex items-center gap-1 text-gray-800 dark:text-gray-200">
														<div
															className={`px-1 py-0 font-mono text-xs font-bold rounded ${Colors.req(item.method)}`}>
															{
																item.method
															}
														</div>
														<div className="truncate text-sm leading-[18px] text-gray-800 dark:text-gray-200 [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light font-medium">
															{
																item.label
															}
														</div>
													</div>
													<p className="text-xs truncate max-w-[calc(100%-4px)] text-gray-500 [&_mark]:text-gray-500 [&_mark]:bg-transparent [&_mark_b]:font-normal [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_b_mark]:font-normal [&amp;_b_mark]:text-primary dark:[&amp;_b_mark]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light">
														{
															item.description
														}
													</p>
												</div>
												<ChevronRight className="w-4 h-4 text-transparent group-hover:text-primary" />
											</div>
										</Link>
									</div>
								);
							})}

						{false && (
							<>
								<div className="px-2.5 py-2 text-gray-500 text-sm truncate w-full">
									Ask AI assistant
								</div>
								<div
									className="last:mb-2"
									role="option"
									tabIndex={-1}>
									<div className="flex items-center gap-2 px-2.5 py-2 w-full cursor-pointer rounded-xl bg-[#F7F7F8] dark:bg-white/5">
										<WandSparkles className="w-4 h-4 text-primary dark:text-primary-dark shrink-0" />
										<span className="text-sm font-medium text-gray-800 truncate dark:text-gray-200">
											Can you tell
											me about "
											{query}"?
										</span>
									</div>
								</div>
							</>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
