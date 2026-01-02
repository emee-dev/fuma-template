import { Tree, TreeItem, TreeItemLabel } from "@/components/tree";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import {
	useFileTree,
	useFileTreeActions,
	useRootItemId,
} from "@/hooks/use-filetree";
import { SidebarItem } from "@/lib/utils";
import {
	asyncDataLoaderFeature,
	createOnDropHandler,
	hotkeysCoreFeature,
	selectionFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
	File,
	FileIcon,
	Folder,
	FolderIcon,
	FolderOpenIcon,
	Loader as LoaderIcon,
} from "lucide-react";

const indent = 20;

export const EditorSidebar = ({
	...props
}: React.ComponentProps<typeof Sidebar>) => {
	const items = useFileTree();
	const rootItemId = useRootItemId();

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
		// @ts-expect-error - This is valid
		createLoadingItemData: () => "Loading...",
		dataLoader: {
			getItem: async (slug) => {
				return Promise.resolve(items![slug] || {});
			},
			getChildren: async (slug) => {
				const entry = items?.[slug];
				return entry?.type === "folder" ? entry.children : [];
			},
		},
		features: [
			asyncDataLoaderFeature,
			selectionFeature,
			hotkeysCoreFeature,
		],
	});

	return (
		<Sidebar {...props}>
			<SidebarHeader className="gap-3.5 border-b p-4 h-12">
				<div className="flex items-center justify-between w-full px-2">
					<div className="text-sm font-medium text-foreground">
						File explorer
					</div>

					<div className="flex items-center gap-x-2">
						<File className="size-4" />
						<Folder className="size-4" />
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<div className="flex h-full scroll-auto flex-col gap-2 first:*:grow">
					<Tree indent={indent} tree={tree}>
						{tree.getItems().map((item) => {
							const name = item.getItemName();
							const data = item.getItemData();

							const showLabel =
								item.isLoading() || !!name;

							return (
								<TreeItem
									item={item}
									key={item.getId()}>
									<TreeItemLabel
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
														{item.isExpanded() ? (
															<FolderOpenIcon className="size-4 text-muted-foreground" />
														) : (
															<FolderIcon className="size-4 text-muted-foreground" />
														)}
														{
															name
														}
													</div>
												)}

											{name &&
												!item.isFolder() && (
													<div
														className={`flex items-center gap-2 ${data.depth === 0 ? "pl-5" : ""}`}>
														<FileIcon className="size-4 text-muted-foreground" />
														{
															name
														}
													</div>
												)}
										</span>
									</TreeItemLabel>
								</TreeItem>
							);
						})}
					</Tree>
				</div>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
};
