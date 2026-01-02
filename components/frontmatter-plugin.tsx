"use client";

import { FrontMatter } from "@/components/frontmatter";
import {
	type FSCProps,
	type FSComponent,
	type PlateId,
} from "@trythis/web-editor/editor-utils";
import { useFsProps } from "@trythis/web-editor/provider";
import { useSelected } from "platejs/react";
import { useEffect } from "react";

export interface FrontmatterComponent extends FSComponent {
	type: "fs_frontmatter";
}

export const FrontMatterPlugin = ({
	attributes,
	element,
}: FSCProps<FrontmatterComponent & PlateId>) => {
	const isSelected = useSelected();
	const { setElement, getFsProps, setSelected, unsetElement } =
		useFsProps() as any;

	useEffect(() => {
		setElement(element);
		setSelected(isSelected);

		return () => {
			unsetElement();
			setSelected(false);
		};
	}, [element, isSelected]);

	return (
		<div className="relative" {...attributes} contentEditable={false}>
			<FrontMatter {...getFsProps?.(element?.id)} />
		</div>
	);
};
