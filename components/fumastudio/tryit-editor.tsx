"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useTryIt } from "@/providers/tryit-provider";
import parseJson from "parse-json";
import { useEffect, useState } from "react";

interface TextEditorProps {
	readOnly?: boolean;
}

function useError(value: string): { error: string } {
	const debouncedValue = useDebounce(value);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		if (!debouncedValue) {
			setError("");
			return;
		}

		try {
			parseJson(debouncedValue);
			setError("");
		} catch (err: any) {
			setError(err?.message ?? "Invalid JSON");
		}
	}, [debouncedValue]);

	return { error };
}

export function TryItTextEditor({ readOnly = false }: TextEditorProps) {
	const {
		isLoading,
		requestBody: value,
		setRequestBody: onChange,
	} = useTryIt();
	const { error } = useError(value);

	return (
		<div className="relative">
			<div className="flex flex-col bg-mutedx bg-gray-800/5 border-gray-400/30 border rounded-md h-full">
				<div className="overflow-auto h-full">
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						readOnly={readOnly || isLoading}
						className={`w-full scrollbar-hide h-[310px] p-2 font-geist-mono resize-none focus:outline-none ${
							readOnly ? "cursor-default" : ""
						}`}
						spellCheck={false}
					/>
				</div>

				<div
					className={`font-geist-mono p-2 text-xs text-red-400 border-gray-400/30 h-28 max-h-28 overflow-scroll scrollbar-hide ${error ? "border-t" : ""}`}>
					{error && <pre>{error}</pre>}
				</div>
			</div>
		</div>
	);
}
