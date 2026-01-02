"use client";

import { CodeBlock } from "@/components/fumastudio/code-block";
import { CheckCircleFilled } from "@/components/icons/check-circle-filled";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClipboard } from "@/hooks/use-clipboard";
import httpStatuses from "@/lib/http-statuses.json";
import { AlertTriangle, CircleCheck, CircleX, Copy, Info } from "lucide-react";
import { useState } from "react";

type Type = "body" | "headers";
type StatusIcon = {
	icon: React.ElementType;
	className: string;
};

function getStatusIcon(status?: number): StatusIcon {
	const statusIcons: Record<number, StatusIcon> = {
		1: { icon: Info, className: "text-blue-600 dark:text-blue-500" },
		2: {
			icon: CircleCheck,
			className: "text-green-600 dark:text-green-500",
		},
		3: {
			icon: AlertTriangle,
			className: "text-yellow-600 dark:text-yellow-500",
		},
		4: { icon: CircleX, className: "text-red-600 dark:text-red-500" },
		5: { icon: CircleX, className: "text-red-600 dark:text-red-500" },
	};

	const statusGroup = status ? Math.floor(status / 100) : 4;
	return statusIcons[statusGroup] ?? statusIcons[4];
}

type TryItResponseProps = {
	body: string;
	status: number;
	contentType: string;
	headers: any;
};

export function TryItResponse(props: TryItResponseProps) {
	const { body, status } = props;
	const [view, setView] = useState<Type>("body");
	const { isCopied, copyValue } = useClipboard();
	const httpStatus = httpStatuses.find((item) => item.status === status);

	const { icon: Icon, className } = getStatusIcon(httpStatus?.status);

	if (!body) {
		return (
			<div className="flex items-center justify-center text-sm h-9 rounded-xl text-muted-foreground">
				No defined response.
			</div>
		);
	}

	return (
		<div className="w-full">
			<Tabs defaultValue="status" className="gap-0">
				<TabsList className="text-foreground w-full rounded-none bg-transparent px-1.5 h-10 flex items-center justify-between">
					<div className="flex flex-wrap items-center gap-x-1.5">
						<TabsTrigger
							value={"status"}
							className="gap-x-1.5 px-1.5 py-1 text-xs hover:text-foreground relative after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
							<div className={className}>
								<Icon className="h-4 w-4" />
							</div>

							<span className="max-w-[140px] truncate">
								{httpStatus?.status} –{" "}
								{httpStatus?.statusText}
							</span>
						</TabsTrigger>
					</div>

					<div className="ml-auto flex items-center gap-x-2.5">
						<Select
							value={view}
							onValueChange={(v: Type) =>
								setView(v)
							}>
							<SelectTrigger className="focus-visible:ring-0 h-8 hover:bg-muted-foreground/15 hover:border text-sm font-geist focus-visible:ring-offset-0 focus-visible:outline-none ring-0 pl-1.5 pr-1 py-[5px] rounded-lg">
								<span>{view}</span>
							</SelectTrigger>
							<SelectContent className="">
								<SelectItem
									value="body"
									className="text-sm font-geist">
									Body
								</SelectItem>
								<SelectItem
									value="headers"
									className="text-sm font-geist">
									Headers
								</SelectItem>
							</SelectContent>
						</Select>

						<button
							className="flex items-center transition-colors text-muted-foreground hover:text-foreground"
							onClick={() => {
								if (view === "body") {
									copyValue(props.body);
								}

								if (view === "headers") {
									copyValue(props.headers);
								}
							}}
							title="Copy snippet">
							{!isCopied && (
								<Copy className="size-4" />
							)}

							{isCopied && (
								<CheckCircleFilled className="size-5 cursor-pointer" />
							)}
						</button>
					</div>
				</TabsList>

				<TabsContent
					value="status"
					className="relative w-full overflow-scroll border h-44 max-h-48 scrollbar-hide border-input rounded-xl">
					<div className="text-sm">
						{view === "body" && (
							<CodeBlock
								code={props.body}
								language="json"
							/>
						)}
						{view === "headers" && (
							<CodeBlock
								code={props.headers}
								language="json"
							/>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
