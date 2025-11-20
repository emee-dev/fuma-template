import {
  AuthorizationSection,
  CopyPageButton,
  DocsFooter,
  DocsPagination,
  PathParamsSection,
  QueryParamsSection,
  RequestSnippets,
  ResponseBodySection,
  ResponseSnippets,
  ResponseTypes,
} from "./client-side";
import { DocsUrl } from "./components/docs-url";

export type DocPagination = Record<
  "previous" | "next",
  { slug: string; label: string }
>;

type SocialLink = {
  href: string;
  label: string;
  iconUrl: string;
};

export type DocFooter = {
  socialLinks: SocialLink[];
};

export interface RequestSnippet {
  Javascript: string;
  cURL: string;
}

export interface ResponseSnippet {
  id: string;
  code: string;
}

export interface AuthConfig {
  type: string;
  payload?: any;
}

export interface ApiReferenceRequest {
  folder: string;
  name: string;
  description: string;
  method: string;
  url: string;
}

export type ApiPageProps = {
  request: ApiReferenceRequest;
  pagination?: DocPagination | null;
  footer: DocFooter;
  request_snippets: RequestSnippet;
  response_snippets: ResponseSnippet[];
  auth: AuthConfig;
};

export const ApiPage = ({
  request,
  footer,
  pagination = null,
  request_snippets,
  response_snippets,
}: ApiPageProps) => {
  if (!request) {
    return null;
  }

  if (!footer) {
    return null;
  }

  return (
    <div className="w-full h-full ">
      <header className="relative font-sans">
        <div className="mt-0.5 space-y-2.5">
          <div className="h-5 text-sm font-semibold text-primary dark:text-primary-light">
            {request.folder}
          </div>
          <div className="relative flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <h1 className="inline-block text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-200">
              {request.name}
            </h1>
            <div className="items-center shrink-0 min-w-[156px] justify-end ml-auto sm:flex hidden">
              <CopyPageButton />
            </div>
          </div>
        </div>
        <div className="mt-2 text-lg prose prose-gray dark:prose-invert">
          <p>{request.description}</p>
        </div>
      </header>

      <DocsUrl url={request.url} method={request.method} />

      {/* <div className="flex flex-col bg-accent border-input border gap-0 mt-6 px-1.5 pb-1.5 rounded-xl api-page:lg:w-[800px]"> */}
      <div className="flex flex-col bg-accent border-input border gap-0 mt-6 px-1.5 pb-1.5 rounded-xl ">
        <RequestSnippets snippets={request_snippets} />
      </div>

      {/* Responses */}
      <div className="flex flex-col bg-accent border-input border gap-0 mt-6 px-1.5 pb-1.5 rounded-xl">
        <ResponseSnippets snippets={response_snippets} />
      </div>

      <div className="mt-6 font-sans">
        <AuthorizationSection />
      </div>

      <div className="mt-6 font-sans">
        <QueryParamsSection />
      </div>

      <div className="mt-6 font-sans">
        <PathParamsSection />
      </div>

      <div className="mt-6 font-sans">
        <ResponseBodySection />
      </div>

      {/* Response types section */}
      <div className="mt-6 font-sans">
        <ResponseTypes responseTable={[{ status: "200" }, { status: "400" }]} />
      </div>

      {pagination && (
        <DocsPagination previous={pagination.previous} next={pagination.next} />
      )}

      {<DocsFooter socialLinks={footer.socialLinks} />}
    </div>
  );
};
