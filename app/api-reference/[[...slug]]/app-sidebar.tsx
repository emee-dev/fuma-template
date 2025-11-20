"use client";

import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from "@/components/tree";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  SidebarFile,
  SidebarItem,
  useFileTree,
  useFileTreeActions,
  useRootItemId,
} from "@/hooks/use-filetree";
import { Colors, Filetree } from "@/lib/utils";
import {
  asyncDataLoaderFeature,
  createOnDropHandler,
} from "@headless-tree/core";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect } from "react";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  filetree: Filetree;
};

// TODO make the sidebar stateless, meaning get ride of client side logic
// so that it can be ssr(ed). Just use a simple data structure & get rid
// of complex nested folders.
const indent = 15;

export function AppSidebar({ ...props }: AppSidebarProps) {
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

        const entry = items![itemId];
        return entry?.type === "folder" ? entry.children : [];
      },
    },
    features: [
      // Since this is api-reference, make the data loading
      // syncronous, hopely it will improve the loading a bit

      asyncDataLoaderFeature,
    ],
  });

  useEffect(() => {
    if (props.filetree) {
      init(props.filetree);
    }
  }, [props.filetree]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
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
      <SidebarContent className="flex flex-col font-sans">
        <div className=" flex items-center gap-2.5 pl-4 mt-2.5 mb-1.5 font-semibold text-gray-900 dark:text-gray-200">
          <h5>Endpoints</h5>
        </div>
        <SidebarGroup className="overflow-y-scroll scrollbar-hide">
          <div className="flex h-full scroll-auto flex-col gap-5 first:*:grow">
            <Suspense fallback={<div>Loading sidebar...</div>}>
              <Tree indent={indent} tree={tree}>
                <AssistiveTreeDescription tree={tree} />
                {tree.getItems().map((item) => {
                  const entryName = item.getItemName();
                  if (!entryName) return null;
                  const entry = item.getItemData() as SidebarFile;
                  const method = entry.type === "file" ? entry.method : null;

                  let truncatedMethod: string | null = "";

                  if (typeof method === "string" && method === "DELETE") {
                    truncatedMethod = "DEL";
                  } else {
                    truncatedMethod = method;
                  }

                  return (
                    <Link
                      href={entry.type === "file" ? entry.slug : "/"}
                      key={item.getId()}
                      className="w-full p-1"
                    >
                      <TreeItem item={item} className="w-full">
                        <TreeItemLabel onClick={() => setSelectedEntry(entry)}>
                          <span className="flex items-center text-center gap-x-5">
                            {truncatedMethod && (
                              <div className="flex items-center w-8">
                                <span
                                  className={`px-1 py-0.5 rounded-md text-[0.55rem] leading-tight font-bold ${Colors.req(
                                    method,
                                    { isBadge: true }
                                  )}`}
                                >
                                  {truncatedMethod}
                                </span>
                              </div>
                            )}

                            {entryName}
                          </span>
                        </TreeItemLabel>
                      </TreeItem>
                    </Link>
                  );
                })}
                <TreeDragLine />
              </Tree>
            </Suspense>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
