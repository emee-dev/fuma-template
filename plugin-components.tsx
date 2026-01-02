import { FrontMatterPlugin } from "@/components/frontmatter-plugin";
import { ApiPagePlugin } from "@/components/fumastudio/api-page-plugin";
import {
	MarkdownPlugin,
	MdYaml,
	remarkMdx,
	remarkMention,
} from "@platejs/markdown";
import { EditorKit as DefaultPlugins } from "@trythis/web-editor/editor-kit";
import { createFscPlugin, fscMdxRules } from "@trythis/web-editor/editor-utils";
import yaml from "js-yaml";
import { KEYS } from "platejs";
import remarkEmoji from "remark-emoji";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

type FSComponent = any;

const plugins = createFscPlugin({
	fs_api_page: ApiPagePlugin,
	fs_frontmatter: FrontMatterPlugin,
});

const rules = fscMdxRules({
	...plugins,
	...{
		yaml: {
			deserialize(mdastNode: MdYaml) {
				const frontmatter = mdastNode.value;

				const fsProps = yaml.load(frontmatter);
				return {
					type: "fs_frontmatter",
					fsProps,
					children: [],
				};
			},
			serialize(slateNode: FSComponent): MdYaml {
				const yamlValue = yaml.dump(slateNode.fsProps);

				return {
					type: "yaml",
					value: yamlValue,
					data: undefined,
				};
			},
		},
		fs_frontmatter: {
			serialize(slateNode: FSComponent): MdYaml {
				const yamlValue = yaml.dump(slateNode.fsProps);

				return {
					type: "yaml",
					value: yamlValue,
					data: undefined,
				};
			},
		},
	},
});

const MarkdownKit = [
	...Object.values(plugins),
	MarkdownPlugin.configure({
		options: {
			disallowedNodes: [KEYS.suggestion],
			remarkPlugins: [
				remarkFrontmatter,
				remarkMdxFrontmatter,
				remarkMath,
				remarkGfm,
				remarkMdx,
				remarkMention,
				remarkEmoji as any,
			],
			rules,
		},
	}),
];

export const EditorKit = [...DefaultPlugins, ...MarkdownKit];
