"use server";

import { SidebarProvider } from "@/components/ui/sidebar";
import { MdxEditorPage } from "./mdx-editor";
import { getSource } from "@/lib/utils";
import { cookies, headers } from "next/headers";

export default async function Page() {
  const requestCookies = await cookies();
  const tenantSession = requestCookies.get("tenant_session");

  // const x = await fetch(
  //   "https://adventurous-porcupine-420.convex.site/get-user-session",
  //   {
  //     method: "POST",
  //     headers: await headers(),
  //   }
  // );

  // const s = await x.json();

  console.log("session", tenantSession);

  const source = await getSource({ branch: "", projectId: "" });

  const user = {};

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <MdxEditorPage user={user} source={source} />
    </SidebarProvider>
  );
}
