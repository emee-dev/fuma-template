"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Server } from "@/lib/utils";
import { useTryIt } from "@/providers/tryit-provider";
import { useEffect, useState } from "react";

type ServerDialogProps = {
	open?: boolean;
	onOpenChange?: (state: boolean) => void;
};

export const ServerDialog = (props: ServerDialogProps) => {
	const { servers, setBaseURL } = useTryIt();

	const [server, setServer] = useState<Server | null>(servers[0]);
	const [selectValue, setSelectValue] = useState<string>(
		servers[0].endpoint,
	);
	const [properties, setProperties] = useState<Record<string, string>>(
		servers[0].defaultValues,
	);

	const onChange = (key: string, value: string) => {
		setProperties((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const intepolateVars = () => {
		if (!server?.vars) return null;

		let endpoint: string = server.endpoint;
		const vars = properties;

		// keep unresolved placeholders instead of stripping them
		endpoint = endpoint.replace(
			/\{\{(\w+)\}\}/g,
			(match: string, key: string) => vars[key] ?? match,
		);

		return endpoint;
	};

	// Set current server based on selectValue
	useEffect(() => {
		// const scheme = props.server.find((i) => i.endpoint === selectValue);
		const scheme = servers.find((i) => i.endpoint === selectValue);

		if (!scheme) return;

		setServer(scheme);
		setProperties(scheme.defaultValues);
	}, [selectValue]);

	// Update the baseUrl when properties or selected server changes
	useEffect(() => {
		if (!server) return;
		if (!server?.vars) {
			setBaseURL(server.endpoint);
		}

		const baseURL = intepolateVars();

		if (baseURL) {
			setBaseURL(baseURL);
		}
	}, [server, properties]);

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogTrigger asChild></DialogTrigger>

			<DialogContent className="sm:max-w-lg p-4">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold leading-none tracking-tight">
						Server URL
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						The base URL of your API endpoint.
					</DialogDescription>
				</DialogHeader>

				<Select
					value={selectValue}
					onValueChange={setSelectValue}>
					<SelectTrigger
						className={`${server?.description ? "h-14" : ""} flex gap-0.5 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ring-0 bg-accent`}>
						<div className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
							<div className="flex flex-col w-full text-start">
								<span className="font-geist-mono text-sm tracking-tighter">
									{selectValue}
								</span>

								{server?.description && (
									<span className="mt-1 block text-muted-foreground text-xs">
										{server.description}
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
						{servers.map((item) => (
							<SelectItem
								key={item.endpoint}
								value={item.endpoint}>
								{item.endpoint}

								{item.description && (
									<span className="mt-1 block text-xs text-muted-foreground">
										{item.description}
									</span>
								)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{server?.variables && server?.variables.length > 0 && (
					<div className="grid gap-4">
						{server.variables.map(
							({ key, enum: values, type }) => (
								<div
									key={key}
									className="space-y-2">
									<Label
										htmlFor={key}
										className="text-xs font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
										{key}
									</Label>

									{type === "string" && (
										<Input
											className="rounded-md border border-border p-2 gap-2 text-start text-sm text-secondary-foreground bg-secondary hover:bg-accent focus:outline-none focus:ring focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 ring-0"
											value={
												properties[
													key
												]
											}
											onChange={(
												e,
											) =>
												onChange(
													key,
													e
														.target
														.value,
												)
											}
										/>
									)}

									{type === "enum" && (
										<Select
											value={
												properties[
													key
												]
											}
											onValueChange={(
												v,
											) =>
												onChange(
													key,
													v,
												)
											}>
											<SelectTrigger className="flex items-center w-full rounded-md border p-2 gap-2 text-start text-sm text-secondary-foreground bg-secondary hover:bg-accent focus:outline-none focus:ring focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 ring-0">
												<SelectValue />
											</SelectTrigger>

											<SelectContent
												side="top"
												align="start"
												sideOffset={
													-60
												}>
												{values.map(
													(
														v,
													) => (
														<SelectItem
															key={
																v
															}
															value={
																v
															}
															icon="right">
															{
																v
															}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									)}
								</div>
							),
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
