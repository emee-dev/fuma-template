"use client";

// import { ApiPage, ApiPageProps } from "@/components/fumastudio/api-page";
import {
	FSComponent,
	FSCProps,
	PlateId,
} from "@trythis/web-editor/editor-utils";
import { useFsProps } from "@trythis/web-editor/provider";
import { useSelected } from "platejs/react";
import { useEffect } from "react";

export interface APIReferenceComponent extends FSComponent {
	type: "fs_api_page";
}

export const ApiPagePlugin = ({
	attributes,
	element,
}: FSCProps<APIReferenceComponent & PlateId>) => {
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
			{/* <ApiPage {...(getFsProps?.(element?.id) as ApiPageProps)} /> */}
		</div>
	);
};
