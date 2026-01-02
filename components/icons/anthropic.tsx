import { cn } from "@/lib/utils";
import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const AnthropicIcon = ({ className, ...props }: IconProps) => (
	<svg
		width="18"
		height="18"
		fill="currentColor"
		role="img"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		className={cn("w-4 h-4 shrink-0", className)}
		{...props}>
		<title>Anthropic</title>
		<path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"></path>
	</svg>
);
