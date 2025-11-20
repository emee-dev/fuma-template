"use client";

import { useSelected } from "platejs/react";
import { useEffect } from "react";
import { ApiPage, ApiPageProps } from "./api-page";
import { useFsProps } from "@trythis/web-editor/provider";
import { type PlateElementProps } from "platejs/react";

export type FSCProps<T extends FSComponent> = PlateElementProps<T>;
export type PlateId = { id: string };
export type FSComponent = {
  /**
   * Unique identifier for the component.
   * Should match the JSX tag name.
   *
   * Example:
   * ```tsx
   * <custom_component /> // type === "custom_component"
   * ```
   */
  type: string;

  /**
   * Object containing all props passed to the component.
   *
   * Example:
   * ```tsx
   * <fsc_component name="emmanuel" age={30} arr={[]} />
   *
   * // Becomes:
   * const fsProps = { name: "emmanuel", age: 30, arr: [] };
   *
   * // Usage:
   * const { fsProps, setFsProps } = useFSCState({ element });
   * ```
   */
  fsProps: Record<string, any>;

  /**
   * The body of the JSX element.
   * Currently unused — components are always self-closing:
   *
   * ```tsx
   * <custom_component /> ✅
   * <custom_component>children</custom_component> ❌
   * ```
   */
  children: [{ text: "" }];
};

export interface APIReferenceComponent extends FSComponent {
  type: "fs_api_page";
}

// Role: Handles all state logic.
// Passes data via props to the Plugin Consumer view-only component
// Can be client rendered.
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
      <ApiPage {...(getFsProps?.(element?.id) as ApiPageProps)} />
    </div>
  );
};
