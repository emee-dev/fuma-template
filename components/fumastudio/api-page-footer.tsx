"use client";

import type { DocPagination } from "@/components/fumastudio/api-page";
import { useSettings } from "@trythis/nextjs/settings";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const DocsPagination = ({ previous, next }: DocPagination) => {
	const previousItem = (previous: DocPagination["previous"]) => (
		<Link
			href={previous.slug}
			className="flex items-center space-x-3 group">
			<ChevronLeft className="h-4 overflow-visible stroke-gray-400 group-hover:stroke-gray-600 dark:group-hover:stroke-gray-300" />
			<span className="group-hover:text-gray-900 dark:group-hover:text-white">
				{previous.label}
			</span>
		</Link>
	);

	const nextItem = (next: DocPagination["next"]) => (
		<Link
			href={next.slug}
			className="flex items-center ml-auto space-x-3 group">
			<span className="group-hover:text-gray-900 dark:group-hover:text-white">
				{next.label}
			</span>
			<ChevronRight className="h-4 overflow-visible stroke-gray-400 group-hover:stroke-gray-600 dark:group-hover:stroke-gray-300" />
		</Link>
	);

	return (
		<div className="leading-6 mt-14 mb-12 px-0.5 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
			{previous && previousItem(previous)}
			{next && nextItem(next)}
		</div>
	);
};

export const DocsFooter = () => {
	const template = useSettings();
	const socialLinks = template?.socials;

	return (
		<footer className="flex justify-between gap-12 pt-10 leading-6 border-t border-gray-100 sm:flex dark:border-gray-800/50 pb-28 mt-14">
			<div className="flex flex-wrap gap-6">
				{socialLinks &&
					socialLinks.map((social) => (
						<Link
							key={social.href}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							className="h-fit">
							<span className="sr-only">
								{social.label}
							</span>
							<svg
								className="w-5 h-5 mask-repeat bg-gray-400 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-400"
								style={{
									maskImage: `url("${social.iconUrl}")`,
									WebkitMaskImage: `url("${social.iconUrl}")`,
								}}
							/>
						</Link>
					))}
			</div>

			<div className="flex items-center justify-between">
				<div className="sm:flex">{template?.poweredBy}</div>
			</div>
		</footer>
	);
};
