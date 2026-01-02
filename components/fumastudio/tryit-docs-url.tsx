"use client";

import { CheckCircleFilled } from "@/components/icons/check-circle-filled";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn, Colors } from "@/lib/utils";
import { useTryIt } from "@/providers/tryit-provider";
import { Copy } from "lucide-react";

export const DialogDocsUrl = (props: { className?: string; url: string }) => {
	const { baseURL, selectedRequest } = useTryIt();

	const url = `...${props.url || ""}`;
	const method = selectedRequest?.method || "GET";

	const tokens = url.match(/\/|{[^}]+}|[^/]+/g) ?? [];
	const { isCopied, copyValue } = useClipboard();

	return (
		<div
			className={cn(
				"group grid grid-cols-[auto_1fr_auto] gap-x-2 border border-input p-1.5 rounded-lg items-center cursor-pointer  h-9",
				props.className,
			)}>
			<div className="flex justify-center">
				<p
					className={`rounded-lg font-bold px-1.5 py-0.5 text-sm leading-5 ${Colors.req(
						method,
					)}`}>
					{method}
				</p>
			</div>

			{/* URL parts */}
			<div
				className="overflow-x-auto no-scrollbar"
				onClick={() => copyValue(url)}>
				<div className="flex justify-start items-center gap-0.5 font-mono text-sm whitespace-nowrap">
					{tokens.map((item, index) => {
						if (!item) return null;
						const key = `${item}-${index}`;

						if (item === "/") {
							return (
								<span
									key={key}
									className="text-gray-400">
									{item}
								</span>
							);
						}

						if (
							item.startsWith("{") &&
							item.endsWith("}")
						) {
							return (
								<span
									key={key}
									className={`font-medium rounded-md px-px border-2 min-w-max ${Colors.req(
										method,
										{ isSpecial: true },
									)}`}>
									{item}
								</span>
							);
						}

						if (item.startsWith("...")) {
							return (
								<span
									key={key}
									className={`font-medium italic transition-all duration-500 group rounded-md px-px border-2 min-w-max ${Colors.req(
										method,
										{ isSpecial: true },
									)}`}>
									<span className="block group-hover:hidden">
										{item}
									</span>
									<span className="hidden group-hover:flex">
										{baseURL}
									</span>
								</span>
							);
						}

						if (item.startsWith(":")) {
							return (
								<span
									key={key}
									className={`font-medium rounded-md px-px border-2 min-w-max ${Colors.req(
										method,
										{ isSpecial: true },
									)}`}>
									{item}
								</span>
							);
						}

						return (
							<span
								key={key}
								className="font-medium text-sm text-gray-800 dark:text-white min-w-max">
								{item}
							</span>
						);
					})}
				</div>
			</div>

			<div className=" hidden md:group-hover:flex items-center mr-0.5 text-muted-foreground">
				{!isCopied && (
					<Copy className="size-4 cursor-pointer" />
				)}
				{isCopied && (
					<CheckCircleFilled className="size-5 cursor-pointer" />
				)}
			</div>
		</div>
	);
};
