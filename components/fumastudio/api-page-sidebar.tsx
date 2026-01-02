"use client";

import { Tree, TreeItem, TreeItemLabel } from "@/components/tree";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useDynamicSegment } from "@/hooks/use-dynamic-segment";
import {
	useFileTree,
	useFileTreeActions,
	useRootItemId,
} from "@/hooks/use-filetree";
import { Colors, FileEntry, SidebarItem } from "@/lib/utils";
import {
	asyncDataLoaderFeature,
	createOnDropHandler,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { FileIcon, FolderIcon, LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const indent = 15;

export function ApiPageFileTree({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const items = useFileTree();
	const rootItemId = useRootItemId();
	const { createSlug } = useDynamicSegment();
	const { selectEntry, onDrop } = useFileTreeActions();

	const tree = useTree<SidebarItem>({
		indent,
		rootItemId,
		canReorder: true,
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => item.getItemData().type === "folder",
		canDrop(_, target) {
			const entry = target.item.getItemData();
			return !!target.item.getElement() && entry.type === "folder";
		},
		onDrop: createOnDropHandler((parentItem, newChildrenIds) => {
			onDrop(parentItem.getId(), newChildrenIds);
		}),
		// @ts-expect-error
		createLoadingItemData: () => "Loading...",
		dataLoader: {
			getItem: async (slug) => Promise.resolve(items![slug] || {}),
			getChildren: async (itemId) => {
				if (!itemId || !items) return [];

				const entry = items![itemId];
				return entry?.type === "folder" ? entry.children : [];
			},
		},
		features: [asyncDataLoaderFeature],
	});

	return (
		<>
			<SidebarHeader className="bg-white">
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex items-center h-16 p-3 gap-x-3">
							<div className="flex items-center justify-center rounded-xl bg-white/5 p-1.5 shadow-sm">
								<Image
									src="https://github.com/usebruno/bruno/blob/main/assets/images/logo.png?raw=true"
									alt="Bruno Logo"
									width={40}
									height={40}
									className="object-contain"
								/>
							</div>

							<div className="flex flex-col leading-tight">
								<span className="text-lg font-semibold tracking-tight">
									Bruno
								</span>
								<span className="text-xs text-muted-foreground">
									Reinventing the API Client
								</span>
							</div>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="flex flex-col font-sans bg-white">
				<div className="flex items-center gap-2.5 pl-4 mt-2.5 mb-1.5 font-semibold text-gray-900 dark:text-gray-200">
					<h5>Endpoints</h5>
				</div>
				<SidebarGroup className="overflow-y-scroll scrollbar-hide">
					<div className="flex h-full scroll-auto flex-col gap-2 first:*:grow">
						<Tree indent={indent} tree={tree}>
							{tree.getItems().map((item) => {
								const name = item.getItemName();
								const data = item.getItemData();
								const slug =
									createSlug(
										data.pathSlug,
									) || "/";

								const showLabel =
									item.isLoading() ||
									!!name;

								const method = (
									data as FileEntry
								)?.method;

								let truncatedMethod:
									| string
									| null = "";

								if (
									typeof method ===
										"string" &&
									method === "DELETE"
								) {
									truncatedMethod = "DEL";
								} else {
									truncatedMethod = method;
								}

								return (
									<TreeItem
										item={item}
										key={item.getId()}>
										<TreeItemLabel
											chevronPosition="right"
											className={`${
												showLabel
													? "before:-inset-y-0.5 before:-z-10 relative before:absolute before:inset-x-0 before:bg-background"
													: "hidden"
											}`}
											onClick={() =>
												selectEntry(
													data,
												)
											}>
											<span className="flex items-center">
												{item.isLoading() &&
													!name && (
														<div className="flex items-center gap-2 opacity-60">
															{item.isFolder() ? (
																<FolderIcon className="size-4 text-muted-foreground" />
															) : (
																<FileIcon className="size-4 text-muted-foreground" />
															)}
															<LoaderIcon className="size-4 text-muted-foreground animate-spin duration-300" />
														</div>
													)}

												{name &&
													item.isFolder() && (
														<div className="flex items-center gap-2">
															{
																name
															}
														</div>
													)}

												{name &&
													!item.isFolder() && (
														<Link
															href={
																slug
															}
															className="w-full">
															<div className="flex items-center gap-2">
																<span
																	className={`px-1 py-0.5 rounded-md text-[0.55rem] leading-tight font-bold ${Colors.req(
																		method,
																		{
																			isBadge: true,
																		},
																	)}`}>
																	{
																		truncatedMethod
																	}
																</span>
																{
																	name
																}
															</div>
														</Link>
													)}
											</span>
										</TreeItemLabel>
									</TreeItem>
								);
							})}
						</Tree>
					</div>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</>
	);
}
