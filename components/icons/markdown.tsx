import { cn } from "@/lib/utils";
import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const MarkdownLogo = ({ className, ...props }: IconProps) => (
	<svg
		role="img"
		viewBox="2 6 20 10"
		xmlns="http://www.w3.org/2000/svg"
		id="Markdown--Streamline-Simple-Icons"
		height="20"
		width="22"
		className={className}
		{...props}>
		<desc>Markdown Streamline Icon: https://streamlinehq.com</desc>
		<title>Markdown</title>

		{/* Background rectangle with orange border */}
		<rect
			x="2"
			y="6"
			width="20"
			height="12"
			rx="2"
			fill="white"
			stroke="orange"
			strokeWidth="1.2"
		/>

		{/* Markdown logo path in orange */}
		<path
			d="M5.769 15.923v-4.5l2.308 2.885 2.307 -2.885v4.5h2.308V8.078h-2.308l-2.307 2.885 -2.308 -2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z"
			fill="orange"
		/>
	</svg>
);

export const MarkdownIcon = ({ className, ...props }: IconProps) => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={cn("w-4 h-4 shrink-0", className)}
		{...props}>
		<path
			d="M15.25 3.75H2.75C1.64543 3.75 0.75 4.64543 0.75 5.75V12.25C0.75 13.3546 1.64543 14.25 2.75 14.25H15.25C16.3546 14.25 17.25 13.3546 17.25 12.25V5.75C17.25 4.64543 16.3546 3.75 15.25 3.75Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"></path>
		<path
			d="M8.75 11.25V6.75H8.356L6.25 9.5L4.144 6.75H3.75V11.25"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"></path>
		<path
			d="M11.5 9.5L13.25 11.25L15 9.5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"></path>
		<path
			d="M13.25 11.25V6.75"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"></path>
	</svg>
);

