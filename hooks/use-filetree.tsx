import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type SameProp = {
  name: string;
  path: string;
};

export type SidebarFolder = SameProp & {
  children: string[];
  type: "folder";
};

export type SidebarFile = SameProp & {
  method: string;
  type: "file";
  slug: string;
};

export type SidebarItem = SidebarFolder | SidebarFile;
export type Items = Record<string, SidebarItem>;

type FileTreeActions = {
  setSelectedEntry: (file: SidebarItem | null) => void;
  init: (file: Items) => void;
  onDrop: (parentId: string, childrenIds: string[]) => void;
};

type FileTreeState = {
  items: Items | null;
  selectedEntry: SidebarItem | null;
  rootItemId: string;
  actions: FileTreeActions;
};

const useFileTreeStore = create<FileTreeState>()(
  immer((set, get) => ({
    items: null,
    selectedEntry: null,
    // rootItemId: "/company",
    rootItemId: "",
    actions: {
      init: (files) => {
        const rootItemId = Object.keys(files)[0];

        set({ items: files, rootItemId });
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

      setSelectedEntry: (item) => {
        set({ selectedEntry: item });
      },
    },
  }))
);

export const useFileTree = () => useFileTreeStore((state) => state.items);
export const useRootItemId = () =>
  useFileTreeStore((state) => state.rootItemId);
export const useSelectedEntry = () => useFileTreeStore((s) => s.selectedEntry);
export const useFileTreeActions = () =>
  useFileTreeStore((state) => state.actions);
