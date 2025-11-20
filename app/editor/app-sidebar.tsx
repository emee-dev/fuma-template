"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { useFileTreeActions } from "@/hooks/use-filetree";
import { getFileTree } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const FileTreeSidebar = dynamic(
  () => import("./filetree-sidebar").then((c) => c.FileTreeSidebar),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { init } = useFileTreeActions();

  useEffect(() => {
    (async () => {
      const fileTree = await getFileTree({ branch: "", projectId: "" });

      if (fileTree) {
        init(fileTree);
      }
    })();
  }, []);

  return (
    <Sidebar
      // collapsible="icon"
      // className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <FileTreeSidebar />
    </Sidebar>
  );
}
