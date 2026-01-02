"use client";

import { useCallback, useState } from "react";

type UseClipboardConfig = {
	resetAfter?: number; // ms
};

export function useClipboard(config: UseClipboardConfig = {}) {
	const { resetAfter = 2000 } = config;
	const [isCopied, setIsCopied] = useState(false);

	const copyValue = useCallback(
		async (value: string) => {
			if (!navigator?.clipboard) {
				console.warn("Clipboard API not supported");
				return false;
			}

			try {
				await navigator.clipboard.writeText(value);
				setIsCopied(true);

				// Reset after timeout
				setTimeout(() => setIsCopied(false), resetAfter);

				return true;
			} catch (error) {
				console.error("Failed to copy:", error);
				setIsCopied(false);
				return false;
			}
		},
		[resetAfter],
	);

	return { isCopied, copyValue } as const;
}
