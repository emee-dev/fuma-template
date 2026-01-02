import { ApiPage } from "@/components/fumastudio/api-page";
import * as AllLucideIcons from "lucide-react";

type MDXComponents = any;

export const useIcons = (): any => {
	return AllLucideIcons;
};

const components: MDXComponents = {
	fs_api_page: ApiPage,
};

// Override or add your mdx components here
export function useMDXComponents(
	defaultComponents?: MDXComponents,
): MDXComponents {
	return {
		...defaultComponents,
		...components,
	};
}
