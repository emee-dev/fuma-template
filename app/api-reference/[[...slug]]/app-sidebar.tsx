"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { useFileTreeActions } from "@/hooks/use-filetree";
import { Filetree } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const Loader = () => (
	<div className="flex items-center w-(--sidebar-width)">
		<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
	</div>
);

const ApiPageFileTree = dynamic(
	() =>
		import("@/components/fumastudio/api-page-sidebar").then(
			(c) => c.ApiPageFileTree,
		),
	{
		ssr: false,
	},
);

export type ApiPageSidebarProps = React.ComponentProps<typeof Sidebar> & {
	filetree: Filetree;
};

export function AppSidebar(props: ApiPageSidebarProps) {
	const { init } = useFileTreeActions();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!props.filetree) return;

		init(props.filetree);
		setReady(true);
	}, [props.filetree, init]);

	if (!ready) {
		return <Loader />;
	}

	return (
		<Sidebar {...props}>
			<ApiPageFileTree />
		</Sidebar>
	);
}
