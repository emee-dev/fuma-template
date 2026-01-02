"use client";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";

export function ThemeSelector(props: { className?: string }) {
	const [theme, setTheme] = useState<string>("light");

	return (
		<div className={cn(props.className)}>
			<Toggle
				variant="outline"
				className="group text-sm data-[state=on]:hover:bg-mutedx size-9 data-[state=on]:bg-transparent"
				pressed={theme === "dark"}
				onPressedChange={() =>
					setTheme((prev) =>
						prev === "dark" ? "light" : "dark",
					)
				}
				aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
				<MoonIcon
					size={16}
					className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
					aria-hidden="true"
				/>
				<SunIcon
					size={16}
					className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
					aria-hidden="true"
				/>
			</Toggle>
		</div>
	);
}
