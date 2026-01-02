"use client";

import { TryItDialog } from "@/components/fumastudio/tryit-dialog";
import { CheckCircleFilled } from "@/components/icons/check-circle-filled";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { Colors } from "@/lib/utils";
import { useSettings } from "@trythis/nextjs/settings";
import { Copy } from "lucide-react";
import { useState } from "react";

export const DocsUrl = (props: { url: string; method: string }) => {
	const tokens = props.url.match(/\/|{[^}]+}|[^/]+/g) ?? [];
	const { isCopied, copyValue } = useClipboard();
	const template = useSettings();
	const showTryItButton = template?.enableTryItButton;
	const [showTryItDialog, setShowTryItDialog] = useState(false);

	return (
		<div
			className={`group grid grid-cols-[auto_1fr_auto] gap-x-2 mt-6 border border-input p-2.5 rounded-xl items-center cursor-pointer ${showTryItButton ? "h-[3.3rem]" : "h-12"}`}>
			<div className="flex justify-center">
				<p
					className={`rounded-lg font-bold px-1.5 py-0.5 text-sm leading-5 ${Colors.req(
						props.method,
					)}`}>
					{props.method}
				</p>
			</div>

			{/* URL parts */}
			<div
				className="overflow-x-auto no-scrollbar"
				onClick={() => copyValue(props.url)}>
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
										props.method,
										{ isSpecial: true },
									)}`}>
									{item}
								</span>
							);
						}
						if (item.startsWith(":")) {
							return (
								<span
									key={key}
									className={`font-medium rounded-md px-px border-2 min-w-max ${Colors.req(
										props.method,
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

			<div className="flex md:hidden md:group-hover:flex items-center justify-start text-muted-foreground gap-x-2.5">
				{!isCopied && (
					<Copy className="size-4 cursor-pointer" />
				)}
				{isCopied && (
					<CheckCircleFilled className="size-5 cursor-pointer" />
				)}

				{showTryItButton && (
					<TryItDialog
						url={props.url}
						open={showTryItDialog}
						onOpenChange={setShowTryItDialog}>
						<Button
							className="rounded-lg cursor-pointer border border-input text-sm font-mono leading-5 tracking-tighter"
							size="sm"
							onClick={() =>
								setShowTryItDialog(
									!showTryItDialog,
								)
							}>
							Try it
						</Button>
					</TryItDialog>
				)}
			</div>
		</div>
	);
};
