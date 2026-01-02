const DataType = ({ type }: { type: string }) => {
	return (
		// <div className="inline items-center gap-2 text-sm font-medium [&_div]:inline mr-2 [&_div]:leading-5">
		// 	<div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
		// 		<span>{type}</span>
		// 	</div>
		// </div>
		<div className="gap-2 text-sm font-medium mr-2 [&_div]:leading-5">
			<div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-allx">
				<span>{type}</span>
			</div>
		</div>
	);
};

const Example = (props: { val: string }) => {
	return (
		<div className="prose prose-sm prose-gray dark:prose-invert overflow-wrap-anywhere text-xs">
			<p className="whitespace-pre-line">
				<code>
					<span>"{props.val}"</span>
				</code>
			</p>
		</div>
	);
};

const Required = () => {
	return (
		<div className="px-2 py-0.5 rounded-md bg-red-100/50 dark:bg-red-400/10 text-red-600 dark:text-red-300 font-medium whitespace-nowrap text-xs">
			required
		</div>
	);
};

export { DataType, Example, Required };
