"use client";

import { AppSidebar } from "@/app/editor/app-sidebar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { useSelectedEntry } from "@/hooks/use-filetree";
import { EditorKit } from "@/plugin-components";
import { MarkdownPlugin } from "@platejs/markdown";
import { Editor, EditorContainer } from "@trythis/web-editor/editor";
import { PlateWithFS } from "@trythis/web-editor/provider";
import { GitBranch } from "lucide-react";
import { usePlateEditor } from "platejs/react";

type PageProps = {
	user: any;
	source: string;
};

export const MdxEditorPage = (props: PageProps) => {
	const entry = useSelectedEntry();
	const editor = usePlateEditor({
		plugins: EditorKit,
		value: (editor) =>
			editor
				.getApi(MarkdownPlugin)
				.markdown.deserialize(props.source),
	});

	if (!editor) return <>Editor is not ready</>;

	return (
		<>
			<AppSidebar />
			<SidebarInset className="grid grid-rows-[40px_1fr] gap-y-2.5 scrollbar-hide">
				<header className="sticky top-0 flex items-center h-12 gap-2 p-4 border-b bg-background shrink-0">
					<div className="*:not-first:mt-2">
						<Select defaultValue="main">
							<SelectTrigger>
								<div className="flex items-center gap-x-1.5 text-muted-foreground">
									<GitBranch className="size-3.5" />{" "}
									Branch
								</div>
								<SelectValue
									placeholder="eg main"
									className="ml-1.5"
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="main">
									main
								</SelectItem>
								<SelectItem value="preview">
									preview
								</SelectItem>
								<SelectItem value="feature">
									feature
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-x-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-5">
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
								clipRule="evenodd"
							/>
						</svg>

						<p className="text-sm">
							Updated 23 minutes ago
						</p>
					</div>

					<div className="ml-auto flex items-center gap-x-3.5">
						<Button
							size="sm"
							onClick={() =>
								console.log(
									editor
										.getApi(
											MarkdownPlugin,
										)
										.markdown.serialize(),
								)
							}>
							Publish
						</Button>
					</div>
				</header>

				<div className="relative">
					<div
						id="modal-root"
						className="absolute z-50 w-[600px]"></div>

					<PlateWithFS editor={editor}>
						<EditorContainer
							variant="demo"
							className="relative">
							<Editor />
						</EditorContainer>
					</PlateWithFS>
				</div>
			</SidebarInset>
		</>
	);
};
