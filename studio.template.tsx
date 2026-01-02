import { AnthropicIcon } from "@/components/icons/anthropic";
import { ChatGPTIcon } from "@/components/icons/chatgpt";
import { MarkdownIcon } from "@/components/icons/markdown";
import { type Settings } from "@trythis/nextjs/settings";
import Link from "next/link";

const config: Settings = {
	copyPage: {
		enabled: true,
		enableDropdown: true,
		dropdown: [
			{
				id: "markdown",
				icon: (
					<div className="border border-gray-200 dark:border-white/[0.07] rounded-lg p-1.5">
						<MarkdownIcon />
					</div>
				),
				label: "View as Markdown",
				description: "View page as plain text",
			},
			{
				id: "chatgpt",
				icon: (
					<div className="border border-gray-200 dark:border-white/[0.07] rounded-lg p-1.5">
						<ChatGPTIcon />
					</div>
				),
				label: "Open in ChatGPT",
				description: "Ask questions about this page",
				url: "https://chatgpt.com/?hints=search&prompt=%s",
			},
			{
				id: "claude",
				icon: (
					<div className="border border-gray-200 dark:border-white/[0.07] rounded-lg p-1.5">
						<AnthropicIcon />
					</div>
				),
				label: "Open in Claude",
				description: "Ask questions about this page",
				url: "https://claude.ai/new?q=%s",
			},
		],
	},
	enableTryItButton: true,
	socials: [
		{
			href: "https://x.com/vercel",
			label: "x",
			iconUrl: "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/x-twitter.svg",
		},
		{
			href: "https://github.com/vercel",
			label: "github",
			iconUrl: "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/github.svg",
		},
		{
			href: "https://www.linkedin.com/company/usebruno",
			label: "linkedin",
			iconUrl: "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/linkedin.svg",
		},
	],
	poweredBy: (
		<Link
			href="https://www.usebruno.com"
			target="_blank"
			rel="noreferrer"
			className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-nowrap">
			Powered by Bruno
		</Link>
	),
};

export default config;
