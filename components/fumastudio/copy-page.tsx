"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClipboard } from "@/hooks/use-clipboard";
import { useSettings, type CopyPageDropdown } from "@trythis/nextjs/settings";
import { ChevronDown, Copy } from "lucide-react";
import { MouseEvent, useState } from "react";

const replaceVar = (url: string, msg: string) =>
	url.replaceAll("%s", encodeURIComponent(msg));

export function CopyPageButton(props: { schema: string }) {
	const [selectedIndex, setSelectedIndex] = useState("0");
	const settings = useSettings();
	const { isCopied, copyValue } = useClipboard();
	const isEnabled = settings?.copyPage?.enabled;
	const isDropdownEnabled = settings?.copyPage?.enableDropdown;
	const options = settings.copyPage?.dropdown as CopyPageDropdown[];

	const handleOnClick = async (
		ev: MouseEvent<HTMLDivElement>,
		option: CopyPageDropdown,
	) => {
		if (["markdown"].includes(option.id)) {
			return await copyValue(props.schema);
		}

		const { protocol, host, pathname } = window.location;

		const pageUrl = `${protocol}//${host}${pathname}`;
		const prompt = `Goto ${pageUrl} I want to ask questions about it.`;

		const url = replaceVar(option.url as string, prompt);

		window.open(url, "_blank", "noopener,noreferrer");
	};

	if (!isEnabled) return <></>;

	return (
		<div className="inline-flex -space-x-px text-sm font-medium shadow-xs h-9 rounded-xl rtl:space-x-reverse">
			<Button
				className="rounded-none shadow-none first:rounded-s-xl last:rounded-e-xl focus-visible:z-10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/[0.07] bg-background-light dark:bg-background-dark hover:bg-gray-600/5 dark:hover:bg-gray-200/5"
				onClick={() => copyValue(props.schema)}
				variant="outline">
				<Copy className="mr-1 size-4" />{" "}
				{isCopied ? "Copied!!" : "Copy page"}
			</Button>

			{isEnabled && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="rounded-none shadow-none first:rounded-s-xl last:rounded-e-xl focus-visible:z-10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/[0.07] bg-background-light dark:bg-background-dark hover:bg-gray-600/5 dark:hover:bg-gray-200/5"
							size="icon"
							aria-label="Options">
							<ChevronDown
								size={14}
								aria-hidden="true"
							/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="max-w-64 md:max-w-xs"
						side="bottom"
						sideOffset={4}
						align="end">
						<DropdownMenuRadioGroup
							value={selectedIndex}
							onValueChange={setSelectedIndex}>
							{isDropdownEnabled &&
								options &&
								options.map((option) => {
									const Icon =
										option.icon || (
											<div className="p-1.5 size-7"></div>
										);

									return (
										<DropdownMenuItem
											key={
												option.label
											}
											onClick={(
												e,
											) =>
												handleOnClick(
													e,
													option,
												)
											}
											className="flex items-center">
											{Icon}

											<div className="flex flex-col gap-0.5">
												<span className="text-sm font-medium">
													{
														option.label
													}
												</span>
												<span className="text-xs text-muted-foreground">
													{
														option.description
													}
												</span>
											</div>
										</DropdownMenuItem>
									);
								})}
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
