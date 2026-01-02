"use client";

import { ResponseSnippets } from "@/components/fumastudio/api-snippets";
import { DialogDocsUrl } from "@/components/fumastudio/tryit-docs-url";
import { TryItTextEditor } from "@/components/fumastudio/tryit-editor";
import { TryItResponse } from "@/components/fumastudio/tryit-response-snippet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { cn, Colors } from "@/lib/utils";
import {
	AuthValues,
	type SecuritySchemes,
	useTryIt,
} from "@/providers/tryit-provider";
import {
	AlertTriangleIcon,
	CheckIcon,
	ChevronDownIcon,
	Loader,
	ShareIcon,
} from "lucide-react";
import React, { useState } from "react";
import { ServerDialog } from "./server-dialog";

const noAuth = {
	type: "null",
	description: "No auth configured",
};

function RequestSelector(props: { className?: string }) {
	const { requests, selectedRequest, selectRequest } = useTryIt();
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string>(
		selectedRequest?.pathSlug || "",
	);

	const onSelect = (currentValue: string) => {
		const slug = currentValue === value ? "" : currentValue;

		selectRequest(slug);
		setValue(slug);
		setOpen(false);
	};

	return (
		<div className={cn("*:not-first:mt-2", props.className)}>
			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild>
					<Button
						aria-expanded={open}
						className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
						role="combobox"
						variant="outline">
						<span
							className={cn(
								"truncate",
								!value &&
									"text-muted-foreground",
							)}>
							{value
								? requests.find(
										(request) =>
											request.pathSlug ===
											value,
									)?.label
								: "Select request"}
						</span>
						<ChevronDownIcon
							aria-hidden="true"
							className="shrink-0 text-muted-foreground/80"
							size={16}
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className="w-full min-w-(--radix-popper-anchor-width) border-input p-0"
					noPortal>
					<Command>
						<CommandInput placeholder="Search requests..." />
						<CommandList>
							<CommandEmpty>
								No request found.
							</CommandEmpty>
							<CommandGroup>
								{requests.map((request) => (
									<CommandItem
										key={
											request.pathSlug
										}
										onSelect={onSelect}
										value={
											request.pathSlug
										}
										className="flex items-center gap-2">
										<span
											className={`shrink-0 w-14 text-center font-geist-mono rounded-sm font-semibold py-0.5 text-xs leading-5 ${Colors.req(
												request.method,
												{
													tryit: true,
												},
											)}`}>
											{
												request.method
											}
										</span>

										<span className="truncate flex-1">
											{
												request.label
											}
										</span>

										{value ===
											request.pathSlug && (
											<CheckIcon
												className="ml-auto shrink-0"
												size={
													16
												}
											/>
										)}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;

function AuthSchemes() {
	const {
		authSchemes,
		selectedScheme,
		setScheme,
		authValues,
		setAuthValues,
	} = useTryIt();

	const apiKeyQuery = authSchemes.find(
		(item) => item.type === "apiKeyQuery",
	)!;
	const apiKeyHeader = authSchemes.find(
		(item) => item.type === "apiKeyHeader",
	)!;

	const onChange = (key: keyof AuthValues) => (e: InputEvent) => {
		setAuthValues(key, e.target.value);
	};

	const currentAuthScheme =
		authSchemes.find((scheme) => scheme.type === selectedScheme) ||
		noAuth;

	return (
		<div className="h-[400px] flex-1">
			<Select
				value={selectedScheme}
				onValueChange={(v: SecuritySchemes) => setScheme(v)}>
				<SelectTrigger className="h-14 flex gap-0.5 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ring-0 bg-accent">
					<div className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
						<div className="flex flex-col w-full text-start">
							<span>{selectedScheme}</span>

							{currentAuthScheme?.description && (
								<span className="mt-1 block text-muted-foreground text-xs">
									{
										currentAuthScheme.description
									}
								</span>
							)}
						</div>
					</div>
				</SelectTrigger>
				<SelectContent
					side="top"
					align="start"
					sideOffset={-60}
					className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
					{authSchemes.map((scheme) => (
						<SelectItem
							value={scheme.type}
							key={scheme.type}>
							{scheme.type}

							{scheme.description && (
								<span className="mt-1 block text-muted-foreground text-xs">
									{scheme.description}
								</span>
							)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div className="mt-3.5">
				{selectedScheme === "bearerAuth" && (
					<>
						<div className="flex text-xs mb-1.5 items-center font-mono">
							<Label className="font-medium text-xs">
								Authorization (header) *
							</Label>
							<span className="ml-auto text-muted-foreground">
								string
							</span>
						</div>

						<div className="border border-input bg-muted flex items-center h-9 rounded-sm px-1.5 text-muted-foreground text-center">
							<span>Bearer</span>
							<Input
								className="focus-visible:ring-0 ml-1 focus-visible:ring-offset-0 focus-visible:outline-none border-0 ring-0 p-0"
								value={authValues?.token}
								onChange={onChange(
									"token",
								)}></Input>
						</div>
					</>
				)}

				{selectedScheme === "basicAuth" && (
					<div className="grid grid-cols-2 gap-x-1.5">
						<div>
							<div className="flex text-xs mb-1.5 items-center font-mono">
								<Label className="font-medium text-xs">
									username *
								</Label>
								<span className="ml-auto text-muted-foreground">
									string
								</span>
							</div>
							<div className="border border-input bg-muted flex items-center h-9 rounded-sm px-1.5 text-muted-foreground text-center">
								<Input
									className="focus-visible:ring-0 ml-1 focus-visible:ring-offset-0 focus-visible:outline-none border-0 ring-0 p-0"
									placeholder="Enter value"
									value={
										authValues?.username
									}
									onChange={onChange(
										"username",
									)}></Input>
							</div>
						</div>

						<div>
							<div className="flex text-xs mb-1.5 items-center font-mono">
								<Label className="font-medium text-xs">
									password *
								</Label>
								<span className="ml-auto text-muted-foreground">
									string
								</span>
							</div>
							<div className="border border-input bg-muted flex items-center h-9 rounded-sm px-1.5 text-muted-foreground text-center">
								<Input
									className="focus-visible:ring-0 ml-1 focus-visible:ring-offset-0 focus-visible:outline-none border-0 ring-0 p-0"
									placeholder="Enter value"
									value={
										authValues?.password
									}
									onChange={onChange(
										"password",
									)}></Input>
							</div>
						</div>
					</div>
				)}

				{selectedScheme === "apiKeyQuery" && (
					<>
						<div className="flex text-xs mb-1.5 items-center font-mono">
							<Label className="font-medium text-xs">
								{apiKeyQuery.name} (
								{apiKeyQuery.in}) *
							</Label>
							<span className="ml-auto text-muted-foreground">
								string
							</span>
						</div>

						<div className="border border-input bg-muted flex items-center h-9 rounded-sm px-1.5 text-muted-foreground text-center">
							<Input
								className="focus-visible:ring-0 ml-1 focus-visible:ring-offset-0 focus-visible:outline-none border-0 ring-0 p-0"
								placeholder="Enter value"
								value={authValues?.apiKeyQuery}
								onChange={onChange(
									"apiKeyQuery",
								)}></Input>
						</div>
					</>
				)}

				{selectedScheme === "apiKeyHeader" && (
					<>
						<div className="flex text-xs mb-1.5 items-center font-mono">
							<Label className="font-medium text-xs">
								{apiKeyHeader.name} (
								{apiKeyHeader.in}) *
							</Label>
							<span className="ml-auto text-muted-foreground">
								string
							</span>
						</div>

						<div className="border border-input bg-muted flex items-center h-9 rounded-sm px-1.5 text-muted-foreground text-center">
							<Input
								className="focus-visible:ring-0 ml-1 focus-visible:ring-offset-0 focus-visible:outline-none border-0 ring-0 p-0"
								placeholder="Enter value"
								value={authValues?.apiKeyHeader}
								onChange={onChange(
									"apiKeyHeader",
								)}></Input>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export function TryItDialog(props: {
	children: React.ReactNode;
	open: boolean;
	url: string;
	onOpenChange: (state: boolean) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const {
		isLoading,
		responseStatus,
		requestBody,
		responseBody,
		responseHeaders,
		contentType,
		responseSnippets,
		onSend,
		setRequestBody,
	} = useTryIt();

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent
				hiddenCloseButton
				className="p-0 max-w-4xl xl:max-w-7xl h-[99dvh] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-6rem)]">
				<DialogHeader className="sr-only">
					<DialogTitle>Try it</DialogTitle>
					<DialogDescription>
						Test requests as fast as possible
					</DialogDescription>
				</DialogHeader>

				<div className="relative flex flex-col gap-y-2.5 p-2 w-[calc(100%-2rem)]x bg-background dark:bg-background-dark rounded-3xl border-standard">
					<div className="sticky top-0 z-50 bg-background-light dark:bg-background-dark flex gap-x-2 h-10">
						<RequestSelector className="max-w-60 w-60" />

						<DialogDocsUrl
							url={props.url}
							className="w-full"
						/>

						<ButtonGroup>
							<Button
								variant="outline"
								disabled={isLoading}
								onClick={() => onSend()}>
								{isLoading ? (
									<>
										<Loader className="w-4 animate-spin duration-300x" />{" "}
										Wait
									</>
								) : (
									"Send"
								)}
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="pl-2!"
										disabled={
											isLoading
										}>
										<ChevronDownIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="[--radius:1rem]">
									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={() =>
												setIsOpen(
													!isOpen,
												)
											}>
											<AlertTriangleIcon />
											List Servers
										</DropdownMenuItem>
										<DropdownMenuItem>
											<ShareIcon />
											Save options
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</ButtonGroup>
					</div>

					<ServerDialog
						open={isOpen}
						onOpenChange={setIsOpen}
					/>

					<div className="grid grid-cols-2 gap-x-1.5 h-[calc(100%-2.5rem)]">
						<Accordion
							className="w-full px-2"
							collapsible
							defaultValue="Authorization"
							type="single">
							<AccordionItem value="Authorization">
								<AccordionTrigger className="py-1.5 text-[15px] leading-6 hover:no-underline text-sm">
									Authorization
								</AccordionTrigger>
								<AccordionContent className="h-full py-2.5">
									<AuthSchemes />
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="Body">
								<AccordionTrigger className="py-1.5 text-[15px] leading-6 hover:no-underline text-sm">
									Body
								</AccordionTrigger>
								<AccordionContent className="h-full py-2.5">
									<TryItTextEditor />
								</AccordionContent>
							</AccordionItem>
						</Accordion>

						<div className="flex flex-col overflow-y-scroll gap-y-2.5 scrollbar-hide">
							{responseBody &&
								responseStatus &&
								contentType && (
									<div className="flex flex-col bg-accent border-input border gap-0 px-1.5 pb-1.5 rounded-xl">
										<TryItResponse
											status={
												responseStatus
											}
											body={
												responseBody
											}
											headers={
												responseHeaders
											}
											contentType={
												contentType
											}
										/>
									</div>
								)}

							{responseSnippets &&
								responseSnippets.length > 0 && (
									<div className="flex flex-col bg-accent border-input border gap-0 px-1.5 pb-1.5 rounded-xl">
										<ResponseSnippets
											snippets={
												responseSnippets
											}
										/>
									</div>
								)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
