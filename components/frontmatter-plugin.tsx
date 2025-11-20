"use client";

import { useFsProps } from "@trythis/web-editor/provider";
import {} from // type PlateId,
// type FSCProps,
// type FSComponent,
"@trythis/web-editor/editor-utils";
import { useSelected } from "platejs/react";
import { useEffect } from "react";
import { FrontMatter } from "./frontmatter";

type FSComponent = any;
type FSCProps = any;
type PlateId = any;

export interface FrontmatterComponent extends FSComponent {
  type: "fs_frontmatter";
}

// Yaml Node handler
export const FrontMatterPlugin = ({
  attributes,
  element,
  // @ts-expect-error
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
