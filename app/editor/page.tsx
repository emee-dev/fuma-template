import { MdxEditorPage } from "@/components/fumastudio/mdx-editor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsProvider } from "@trythis/nextjs/settings";

export const source = `---
title: "Put Image Blob"
created_at: "1765041302075"
updated_at: "1765041302075"
---

<fs_api_page
  serverCtx={serverCtx}
  request={{
    folder: "Blob",
    name: "Put Image Blob",
    description: "Allows the possiblity of upserting an image.",
    method: "PUT",
    url: "/v1/blob"
  }}
  request_snippets={[
    {
      id: "cURL",
      code: \`curl --request PUT \\
  --url {{server}}/v1/blob \\
  --header 'Authorization: Basic {{user}}:{{password}}' \\
  --header 'X-Blob-Sha256: c3093766d3e29b1e557e035fc2f9db641320ba9c84932a50b305cbb4fbb746e0' \\
  --header 'X-Blob-Type: image'\`
    },
    {
      id: "axios",
      code: \`import axios from 'axios';

const options = {
  method: 'PUT',
  url: '{{server}}/v1/blob',
  headers: {
    Authorization: 'Basic {{user}}:{{password}}',
    'X-Blob-Sha256': 'c3093766d3e29b1e557e035fc2f9db641320ba9c84932a50b305cbb4fbb746e0',
    'X-Blob-Type': 'image'
  }
};

axios
  .request(options)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));\`
    },
    {
      id: "fetch",
      code: \`const url = '{{server}}/v1/blob';
const options = {
  method: 'PUT',
  headers: {
    Authorization: 'Basic {{user}}:{{password}}',
    'X-Blob-Sha256': 'c3093766d3e29b1e557e035fc2f9db641320ba9c84932a50b305cbb4fbb746e0',
    'X-Blob-Type': 'image'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));\`
    }
  ]}
  response_snippets={[
    {
      id: "200",
      code: \`
{
  "entitlements": [
    "v0"
  ],
  "isDsyncManaged": true,
  "name": "my-access-group",
  "createdAt": 1588720733602,
  "teamId": "team_123a6c5209bc3778245d011443644c8d27dc2c50",
  "updatedAt": 1588720733602,
  "accessGroupId": "ag_123a6c5209bc3778245d011443644c8d27dc2c50",
  "membersCount": 5,
  "projectsCount": 2,
  "teamRoles": [
    "DEVELOPER",
    "BILLING"
  ],
  "teamPermissions": [
    "CreateProject"
  ]
}
      \`
    },
    {
      id: "400",
      code: \`
{
  "error": {
    "code": "<string>",
    "message": "<string>"
  }
}
      \`
    },
    {
      id: "500",
      code: \`
curl --request GET \\
  --url https://api.vercel.com/v1/access-groups/{idOrName} \\
  --header 'Authorization: Bearer <token>'
      \`
    }
  ]}
  pagination={scope_pagination_at_runtime}
  schema={\`
import { v } from "@trythis/js-schema";

export const info = v
  .null()
  .describe("Allows the possiblity of upserting an image.")
  .title("A request");

export const query_params = v.null();

export const requestBody = v.object({
  email: v
    .string()
    .describe("The email of the account owner, should be lowercase")
    .example("example@gmail.com"),
  password: v
    .string()
    .describe("Simple password for auth")
    .example("pass123"),
  alias: v
    .string()
    .describe("Alternative names")
    .enum(["example1", "example2"])
});

export const responseBody = v.reply({
	ok: v.json({
		email: v.string(),
		password: v.string(),
		apiKey: v.string().example("fs_xxxxxxxxxxxxxxx"),
	}),
});
  \`}
/>
`;

export default async function Page() {
	// const requestCookies = await cookies();
	// const tenantSession = requestCookies.get("tenant_session");

	// const x = await fetch(
	//   "https://adventurous-porcupine-420.convex.site/get-user-session",
	//   {
	//     method: "POST",
	//     headers: await headers(),
	//   }
	// );

	// const s = await x.json();

	// console.log("session", tenantSession);

	// const source = await getSource({ branch: "", projectId: "" });

	const user = {};

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "350px",
				} as React.CSSProperties
			}>
			<SettingsProvider template={null}>
				<MdxEditorPage user={user} source={source} />
			</SettingsProvider>
		</SidebarProvider>
	);
}
