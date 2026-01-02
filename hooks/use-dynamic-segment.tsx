"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

export function useDynamicSegment(segment: string = "slug") {
	const params = useParams();
	const pathname = usePathname();
	const router = useRouter();

	function createSlug(pathSlug: string) {
		const dynamicSegment = params?.[segment];

		// assuming you have a dynamic segment [[...slug]]
		if (!dynamicSegment || !Array.isArray(dynamicSegment)) {
			console.log(params.slug);
			return;
		}

		const basePath = pathname.replace(
			`/${dynamicSegment.join("/")}`,
			"",
		);

		// TODO trim double forward slashes
		return `${basePath}${pathSlug}`;
	}

	function navigate(pathSlug: string) {
		const slug = createSlug(pathSlug);

		if (!slug) return;

		router.replace(slug);
	}

	return { navigate, createSlug };
}
