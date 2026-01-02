import { Filetree, SidebarItem } from "@/lib/utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type FileTreeActions = {
	selectEntry: (file: SidebarItem | null) => void;
	init: (file: Filetree) => void;
	onDrop: (parentId: string, childrenIds: string[]) => void;
};

type FileTreeState = {
	items: Filetree | null;
	selectedEntry: SidebarItem | null;
	rootItemId: string;
	actions: FileTreeActions;
};

const useFileTreeStore = create<FileTreeState>()(
	immer((set, get) => ({
		selectedEntry: null,
		items: null,
		rootItemId: "$collection_root",
		actions: {
			init: (files) => {
				set({
					items: files,
				});
			},

			onDrop: (parentId, childrenIds) => {
				const prevItems = get().items;

				if (!prevItems) return;

				const newState = {
					...prevItems,
					[parentId]: {
						...prevItems[parentId],
						children: childrenIds,
					},
				};

				set({ items: newState });
			},

			selectEntry: (item) => {
				set({ selectedEntry: item });
			},
		},
	})),
);

export const useFileTree = () => useFileTreeStore((state) => state.items);
export const useRootItemId = () =>
	useFileTreeStore((state) => state.rootItemId);
export const useSelectedEntry = () => useFileTreeStore((s) => s.selectedEntry);
export const useFileTreeActions = () =>
	useFileTreeStore((state) => state.actions);
