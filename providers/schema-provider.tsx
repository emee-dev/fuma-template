"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface AccordionState {
	openItems: Record<string, string>;
	setOpenItem: (path: string, value: string) => void;
}

const SchemaContext = createContext<AccordionState | null>(null);

export function SchemaProvider(props: { children: ReactNode }) {
	const [openItems, setOpenItemsState] = useState<Record<string, string>>(
		{},
	);

	const setOpenItem = (path: string, value: string) => {
		setOpenItemsState((prev) => ({
			...prev,
			[path]: value,
		}));
	};

	return (
		<SchemaContext.Provider value={{ openItems, setOpenItem }}>
			{props.children}
		</SchemaContext.Provider>
	);
}

export const useSchemaAccordion = () => {
	const ctx = useContext(SchemaContext);
	if (!ctx)
		throw new Error(
			"useSchemaAccordion must be used inside SchemaProvider",
		);
	return ctx;
};
