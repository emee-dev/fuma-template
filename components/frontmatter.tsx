import yaml from "js-yaml";

export const FrontMatter = (fsProps: Record<string, any>) => {
  const yamlString = `---\n${yaml.dump(fsProps)}---`;

  return (
    <div className="bg-blue-100 border border-blue-400 rounded p-2 my-2 overflow-auto">
      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
        {yamlString}
      </pre>
    </div>
  );
};
