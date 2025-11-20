import {
  ApiReferenceRequest,
  DocFooter,
} from "@/app/api-reference/[[...slug]]/api-page";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FileEntry = {
  name: string;
  type: "file";
  path: string;
  slug: string;
  method: string;
};

export type FolderEntry = {
  name: string;
  type: "folder";
  children: string[];
  path: string;
};

type NavItem = {
  slug: string;
  label: string;
};

export type DocPagination = {
  previous: NavItem | null;
  next: NavItem | null;
};

export type Filetree = Record<string, FileEntry | FolderEntry>;

export type NavigationMap = Record<string, DocPagination>;

/**
 * Recursively collect files in order, flattening folders
 */
function flattenFiles(tree: Filetree, rootKeys: string[]): FileEntry[] {
  const result: FileEntry[] = [];

  for (const key of rootKeys) {
    const node = tree[key];
    if (!node) continue;

    if (node.type === "file") {
      result.push(node);
    } else if (node.type === "folder") {
      result.push(...flattenFiles(tree, node.children));
    }
  }

  return result;
}

export function generatePagination(
  slug: string,
  tree: Filetree
): DocPagination {
  // if (!tree) {
  //   return null;
  // }

  // Collect all root-level nodes in order
  const rootKeys = Object.keys(tree).filter(
    (key) => !key.includes("/") || key.split("/").length === 2
  );

  const orderedFiles = flattenFiles(tree, rootKeys);

  const index = orderedFiles.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  const previousEntry = orderedFiles[index - 1];
  const nextEntry = orderedFiles[index + 1];

  const previous =
    index > 0
      ? {
          slug: previousEntry.slug,
          label: previousEntry.name,
        }
      : null;

  const next =
    index < orderedFiles.length - 1
      ? {
          slug: nextEntry.slug,
          label: nextEntry.name,
        }
      : null;

  return { previous, next };
}

export function scrollToHash(hashSelector: string) {
  if (!hashSelector) return;

  const element = document.querySelector(`[href="${hashSelector}"]`);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

type HttpMethod =
  | "GET"
  | "POST"
  | "DELETE"
  | "PATCH"
  | "PUT"
  | "HEAD"
  | "OPTIONS"
  | "TRACE"
  | "CONNECT";

interface StyleSet {
  method: string;
  special: string;
  badge: string;
}

interface Options {
  isSpecial?: boolean;
  isBadge?: boolean;
}

export class Colors {
  private static styles: Record<HttpMethod, StyleSet> = {
    POST: {
      method:
        "bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-400",
      special: "text-[#3064E3] bg-[#3064E3]/10 border-[#3064E3]/30",
      badge:
        "bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-400",
    },
    GET: {
      method:
        "bg-green-400/20 dark:bg-green-400/20 text-green-700 dark:text-green-400",
      special: "text-[#2AB673] bg-[#2AB673]/10 border-[#2AB673]/30",
      badge:
        " bg-green-400/20 dark:bg-green-400/20 text-green-700 dark:text-green-400",
    },
    DELETE: {
      method: "bg-red-400/20 dark:bg-red-400/20 text-red-700 dark:text-red-400",
      special: "text-[#CB3A32] bg-[#CB3A32]/10 border-[#CB3A32]/30",
      badge: "bg-red-400/20 dark:bg-red-400/20 text-red-700 dark:text-red-400",
    },
    PATCH: {
      method:
        "bg-orange-400/20 dark:bg-orange-400/20 text-orange-700 dark:text-orange-400",
      special: "text-[#DA622B] bg-[#DA622B]/10 border-[#DA622B]/30",
      badge:
        "bg-orange-400/20 dark:bg-orange-400/20 text-orange-700 dark:text-orange-400",
    },
    PUT: {
      method:
        "bg-yellow-400/20 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
      special: "text-[#C28C30] bg-[#C28C30]/10 border-[#C28C30]/30",
      badge:
        "bg-yellow-400/20 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
    },
    HEAD: {
      method:
        "bg-cyan-400/20 dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-400",
      special:
        "text-[#0e7490] dark:text-[#00d3f2] bg-[#00d3f2]/10 border-[#00d3f2]/30",
      badge: "",
    },
    OPTIONS: {
      method:
        "bg-purple-400/20 dark:bg-purple-400/20 text-purple-700 dark:text-purple-400",
      special: "text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/30",
      badge: "",
    },
    TRACE: {
      method:
        "bg-pink-400/20 dark:bg-pink-400/20 text-pink-700 dark:text-pink-400",
      special: "text-[#DB2777] bg-[#DB2777]/10 border-[#DB2777]/30",
      badge: "",
    },
    CONNECT: {
      method:
        "bg-indigo-400/20 dark:bg-indigo-400/20 text-indigo-700 dark:text-indigo-400",
      special: "text-[#4F46E5] bg-[#4F46E5]/10 border-[#4F46E5]/30",
      badge: "",
    },
  };

  static req(method: string | null, options?: Options): string {
    if (!method) return "";

    const upperMethod = method.toUpperCase() as HttpMethod;
    const styleSet = Colors.styles[upperMethod];

    if (!styleSet) {
      // fallback if method is not in styles
      return options?.isSpecial
        ? "text-primary bg-primary/10 border-primary/30"
        : "text-primary";
    }

    if (options?.isSpecial) {
      return styleSet.special;
    } else if (options?.isBadge) {
      return styleSet.badge;
    }

    return styleSet.method;
  }
}

type StaticFileTree = {
  projectId: string;
  branch: string;
};

type DynamicFileTree = StaticFileTree & {
  slug?: string;
};

export const getFileTree = async ({ projectId, branch }: StaticFileTree) => {
  return {
    "./blob": {
      type: "folder",
      name: "Blob",
      children: [
        "./blob/delete_blob.bru",
        "./blob/get_blob.bru",
        "./blob/patch_blob_pin.bru",
        "./blob/put_file_blob.bru",
        "./blob/put_image_blob.bru",
        "./blob/put_text_blob.bru",
      ],
      path: "./blob",
    },
    "./blob/delete_blob.bru": {
      slug: "delete_blob",
      type: "file",
      name: "Delete Blob",
      path: "./blob/delete_blob.bru",
      method: "DELETE",
    },
    "./blob/get_blob.bru": {
      slug: "get_blob",
      type: "file",
      name: "Get Blob",
      path: "./blob/get_blob.bru",
      method: "GET",
    },
    "./blob/patch_blob_pin.bru": {
      slug: "patch_blob_pin",
      type: "file",
      name: "Patch Blob Pin",
      path: "./blob/patch_blob_pin.bru",
      method: "PATCH",
    },
    "./blob/put_file_blob.bru": {
      slug: "put_file_blob",
      type: "file",
      name: "Put File Blob",
      path: "./blob/put_file_blob.bru",
      method: "PUT",
    },
    "./blob/put_image_blob.bru": {
      slug: "put_image_blob",
      type: "file",
      name: "Put Image Blob",
      path: "./blob/put_image_blob.bru",
      method: "PUT",
    },
    "./blob/put_text_blob.bru": {
      slug: "put_text_blob",
      type: "file",
      name: "Put Text Blob",
      path: "./blob/put_text_blob.bru",
      method: "PUT",
    },
    "./healthz.bru": {
      slug: "healthz",
      type: "file",
      name: "Healthz",
      path: "./healthz.bru",
      method: "GET",
    },
    "./metadata": {
      type: "folder",
      name: "Metadata",
      children: ["./metadata/get_metadata.bru", "./metadata/get_metadatas.bru"],
      path: "./metadata",
    },
    "./metadata/get_metadata.bru": {
      slug: "get_metadata",
      type: "file",
      name: "Get Metadata",
      path: "./metadata/get_metadata.bru",
      method: "GET",
    },
    "./metadata/get_metadatas.bru": {
      slug: "get_metadatas",
      type: "file",
      name: "Get Metadatas",
      path: "./metadata/get_metadatas.bru",
      method: "GET",
    },
    "./token.bru": {
      slug: "token",
      type: "file",
      name: "Token",
      path: "./token.bru",
      method: "GET",
    },
    "./user": {
      type: "folder",
      name: "User",
      children: [
        "./user/delete_user.bru",
        "./user/get_user.bru",
        "./user/get_users.bru",
        "./user/patch_user_admin.bru",
        "./user/patch_user_password.bru",
        "./user/put_user.bru",
      ],
      path: "./user",
    },
    "./user/delete_user.bru": {
      slug: "delete_user",
      type: "file",
      name: "Delete User",
      path: "./user/delete_user.bru",
      method: "DELETE",
    },
    "./user/get_user.bru": {
      slug: "get_user",
      type: "file",
      name: "Get User",
      path: "./user/get_user.bru",
      method: "GET",
    },
    "./user/get_users.bru": {
      slug: "get_users",
      type: "file",
      name: "Get Users",
      path: "./user/get_users.bru",
      method: "GET",
    },
    "./user/patch_user_admin.bru": {
      slug: "patch_user_admin",
      type: "file",
      name: "Patch User Admin",
      path: "./user/patch_user_admin.bru",
      method: "PATCH",
    },
    "./user/patch_user_password.bru": {
      slug: "patch_user_password",
      type: "file",
      name: "Patch User Password",
      path: "./user/patch_user_password.bru",
      method: "PATCH",
    },
    "./user/put_user.bru": {
      slug: "put_user",
      type: "file",
      name: "Put User",
      path: "./user/put_user.bru",
      method: "PUT",
    },
  } as Filetree;
};

export const request = {
  folder: "access-groups",
  name: "Reads an access group",
  description: "Allows to read an access group",
  method: "PUT",
  url: "/v1/access-groups/{idOrName}",
};

export const request_snippets = {
  Javascript: `
const url = 'https://api.vercel.com/v1/access-groups/{idOrName}';
const options = {
method: 'GET',
headers: {
  Authorization: 'Bearer <token>'
},
body: undefined
};

try {
const response = await fetch(url, options);
const data = await response.json();
console.log(data);
} catch (error) {
console.error(error);
}
  `,
  cURL: `
curl --request GET \\
--url https://api.vercel.com/v1/access-groups/{idOrName} \\
--header 'Authorization: Bearer <token>'
  `,
};

export const response_snippets = [
  {
    id: "200",
    code: `
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
    `,
  },
  {
    id: "400",
    code: `
{
"error": {
  "code": "<string>",
  "message": "<string>"
}
}
    `,
  },
  {
    id: "500",
    code: `
curl --request GET \\
--url https://api.vercel.com/v1/access-groups/{idOrName} \\
--header 'Authorization: Bearer <token>'
    `,
  },
];

export const auth = {
  type: "bearer token",
};

export const footer = {
  socialLinks: [
    {
      href: "https://x.com/vercel",
      label: "x",
      iconUrl:
        "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/x-twitter.svg",
    },
    {
      href: "https://github.com/vercel",
      label: "github",
      iconUrl: "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/github.svg",
    },
    {
      href: "https://linkedin.com/company/vercel",
      label: "linkedin",
      iconUrl:
        "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/linkedin.svg",
    },
  ],
};

const pagination = "scope_pagination_at_runtime";

export const getSource = async ({
  projectId,
  branch,
  slug = "",
}: DynamicFileTree) => {
  const request: ApiReferenceRequest = {
    folder: "access-groups",
    name: "Reads an access group",
    description: "Allows to read an access group",
    method: "PUT",
    url: "/v1/access-groups/{idOrName}",
  };

  const request_snippets = {
    Javascript: `
  const url = 'https://api.vercel.com/v1/access-groups/{idOrName}';
  const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer <token>'
  },
  body: undefined
  };
  
  try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  } catch (error) {
  console.error(error);
  }
    `,
    cURL: `
  curl --request GET \\
  --url https://api.vercel.com/v1/access-groups/{idOrName} \\
  --header 'Authorization: Bearer <token>'
    `,
  };

  const response_snippets = [
    {
      id: "200",
      code: `
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
      `,
    },
    {
      id: "400",
      code: `
  {
  "error": {
    "code": "<string>",
    "message": "<string>"
  }
  }
      `,
    },
    {
      id: "500",
      code: `
  curl --request GET \\
  --url https://api.vercel.com/v1/access-groups/{idOrName} \\
  --header 'Authorization: Bearer <token>'
      `,
    },
  ];

  const auth = {
    type: "bearer token",
  };

  const footer: DocFooter = {
    socialLinks: [
      {
        href: "https://x.com/vercel",
        label: "x",
        iconUrl:
          "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/x-twitter.svg",
      },
      {
        href: "https://github.com/vercel",
        label: "github",
        iconUrl:
          "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/github.svg",
      },
      {
        href: "https://linkedin.com/company/vercel",
        label: "linkedin",
        iconUrl:
          "https://d3gk2c5xim1je2.cloudfront.net/v6.6.0/brands/linkedin.svg",
      },
    ],
  };

  const pagination = "scope_pagination_at_runtime";

  //   const source = `---
  // title: Framework Theme
  // date: some date
  // ---

  // <fs_api_page
  //   request={${JSON.stringify(request, null, 2)}}
  //   request_snippets={${JSON.stringify(request_snippets, null, 2)}}
  //   response_snippets={${JSON.stringify(response_snippets, null, 2)}}
  //   footer={${JSON.stringify(footer, null, 2)}}
  //   pagination={${pagination}}
  // />`;
  const source = `---
title: Framework Theme
date: some date
---
`;

  return source;
};
