import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { generatePagination } from "@/lib/utils";
import { useMDXComponents } from "@/mdx-components";
import { compileSource, DocCache, DocLoader } from "@trythis/nextjs";
import { join } from "path";
import { AppSidebar } from "./app-sidebar";
import { DocSearch, ThemeSelector } from "./client-side";

type PageSearchParams = {
  /** Optional search query string */
  s?: string;
};

type PageParams = { slug: string[] };

type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

const cwd = process.cwd();
const SOURCE_DIR = join(cwd, "source");

export default async function Page(props: PageProps) {
  const params = await props.params;
  const docLoader = new DocLoader(SOURCE_DIR, DocCache.getInstance());

  const { filetree, source, requestSlug } = await docLoader.pageDocs(params);
  const pagination = generatePagination(requestSlug, filetree);

  const { content } = await compileSource({
    source: source.content,
    components: useMDXComponents(),
    scope: { scope_pagination_at_runtime: pagination },
  });

  return (
    <SidebarProvider>
      <AppSidebar filetree={filetree} />

      <SidebarInset>
        <div className="flex items-center h-16 gap-2 px-4 border-b lg:hidden shrink-0">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>

          <div className="flex items-center ml-auto">
            <DocSearch />
            <ThemeSelector />
          </div>
        </div>

        <div className="items-center hidden h-16 grid-cols-4 gap-2 px-4 border-b lg:grid place-items-center shrink-0">
          <div className="col-span-2">
            <DocSearch />
          </div>

          <div className="flex items-center w-full col-span-2">
            <ThemeSelector className="ml-auto" />
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 pt-24 sm:px-10 md:px-20 lg:px-28 group is-api-page">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export async function generateStaticParams() {
  const docLoader = new DocLoader(SOURCE_DIR, DocCache.getInstance());
  return await docLoader.preloadDocs();
}

export async function generateMetadata(props: PageProps) {
  const docLoader = new DocLoader(SOURCE_DIR, DocCache.getInstance());
  const params = await props.params;
  const { frontmatter } = await docLoader.getMetaData(params);
  return frontmatter;
}
