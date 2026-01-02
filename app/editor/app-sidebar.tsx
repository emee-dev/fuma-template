"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { useFileTree, useFileTreeActions } from "@/hooks/use-filetree";
import { client } from "@/lib/orpc";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const EditorSidebar = dynamic(
	() =>
		import("@/components/fumastudio/filetree").then(
			(c) => c.EditorSidebar,
		),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center w-full h-full">
				<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
			</div>
		),
	},
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const items = useFileTree();
	const { init } = useFileTreeActions();

	async function fetchData() {
		const results = await client.getTopLevelFiles({
			branchSlug: "main",
		});

		if (results) {
			init(results.filetree);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return <Sidebar {...props}>{items && <EditorSidebar />}</Sidebar>;
}
