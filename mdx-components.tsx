// import { type MDXComponents } from "@trythis/web-editor/utils";
import * as AllLucideIcons from "lucide-react";
import { ApiPage } from "./app/api-reference/[[...slug]]/api-page";

type MDXComponents = any;

export const useIcons = (): any => {
  return AllLucideIcons;
};

const components: MDXComponents = {
  fs_api_page: ApiPage,
};

// Override or add your mdx components here
export function useMDXComponents(
  defaultComponents?: MDXComponents
): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
  };
}
