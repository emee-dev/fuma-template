import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from "@/components/tree";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  SidebarItem,
  useFileTree,
  useFileTreeActions,
  useRootItemId,
} from "@/hooks/use-filetree";
import {
  asyncDataLoaderFeature,
  createOnDropHandler,
  dragAndDropFeature,
  hotkeysCoreFeature,
  keyboardDragAndDropFeature,
  selectionFeature,
} from "@headless-tree/core";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";
import { File, Folder } from "lucide-react";
import { MarkdownLogo } from "../../components/icons/markdown";

const indent = 15;

export const FileTreeSidebar = () => {
  const { setOpen } = useSidebar();
  const items = useFileTree();
  const rootItemId = useRootItemId();
  const { setSelectedEntry, onDrop, init } = useFileTreeActions();

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
    createLoadingItemData: () => <div>Loading state</div>,
    dataLoader: {
      getItem: async (itemId) => Promise.resolve(items![itemId] || {}),
      getChildren: async (itemId) => {
        if (!itemId || !items) return [];

        const entry = items[itemId];
        return entry?.type === "folder" ? entry.children : [];
      },
    },
    features: [
      asyncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
    ],
  });

  return (
    <Sidebar collapsible="none" className="flex-1 hidden md:flex">
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
      <SidebarContent className="flex flex-col font-sans">
        <SidebarGroup className="overflow-y-scroll scrollbar-hide">
          <div className="flex h-full scroll-auto flex-col gap-2 first:*:grow">
            <Tree indent={indent} tree={tree}>
              <AssistiveTreeDescription tree={tree} />
              {tree.getItems().map((item) => {
                const entryName = item.getItemName();
                if (!entryName) return null;
                const entry = item.getItemData();
                const level = item.getItemMeta().level || 1;

                return (
                  <TreeItem item={item} key={item.getId()}>
                    <TreeItemLabel
                      className="py-1"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      {/* <span className="flex items-center gap-2">
                          {item.isLoading() && !entryName && (
                            <Loader2 className="pointer-events-none text-muted-foreground size-4 animate-spin" />
                          )}
                          {entryName}
                        </span> */}
                      <span className="flex items-center gap-2">
                        {entry.type === "file" && (
                          <div className="bg-accent">
                            {/* <Image
                                alt="sk"
                                src="/mdx-logo.svg"
                                width={60}
                                height={60}
                                className="pointer-events-none text-muted-foreground size-6"
                              /> */}
                            <MarkdownLogo />
                          </div>
                        )}
                        {entryName}
                      </span>
                    </TreeItemLabel>
                  </TreeItem>
                );
              })}
              <TreeDragLine />
            </Tree>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
