"use client";

import { MarkdownIcon } from "@/components/icons/markdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/cn";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Hash,
  Link2,
  MoonIcon,
  Search,
  SquareTerminal,
  SunIcon,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ShikiHighlighter, Language as ShikiLanguage } from "react-shiki";
import {
  type DocFooter,
  type DocPagination,
  type RequestSnippet,
  type ResponseSnippet,
} from "./api-page";

const supportedKeys = {
  Typescript: "typescript",
  Javascript: "javascript",
  Json: "json",
  cURL: "bash",
  axios: "typescript",
  fetch: "typescript",
};

type Language = keyof typeof supportedKeys;

const CodeBlock = (props: {
  code: string;
  language?: ShikiLanguage;
  className?: string;
}) => {
  const language = props.language as Language;

  return (
    <ShikiHighlighter
      // Default to bash if undefined
      language={language ? supportedKeys[language] : supportedKeys["cURL"]}
      theme="github-light-default"
      showLanguage={false}
      className={cn(props.className, "h-full text-xs leading-[1.35rem]")}
    >
      {props.code.trim()}
    </ShikiHighlighter>
  );
};

export function ResponseStatus(props: { responseTable: { status: string }[] }) {
  const [status, setStatus] = useState(props.responseTable.at(0)?.status);

  return (
    <div>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 ">
          {props.responseTable.map(({ status }, idx) => (
            <SelectItem key={String(status)} value={status} className="text-xs">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const options = [
  {
    label: "View as Markdown",
    description: "View page as plain text",
  },
  {
    label: "Open in ChatGPT",
    description: "Ask questions about this page",
  },
  {
    label: "Open in Claude",
    description: "Ask questions about this page",
  },
];

export function CopyPageButton() {
  const [selectedIndex, setSelectedIndex] = useState("0");

  return (
    <div className="inline-flex -space-x-px text-sm font-medium shadow-xs h-9 rounded-xl rtl:space-x-reverse">
      <Button
        className="rounded-none shadow-none first:rounded-s-xl last:rounded-e-xl focus-visible:z-10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/[0.07] bg-background-light dark:bg-background-dark hover:bg-gray-600/5 dark:hover:bg-gray-200/5"
        variant="outline"
      >
        <Copy className="mr-1 size-4" /> Copy page
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-none shadow-none first:rounded-s-xl last:rounded-e-xl focus-visible:z-10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/[0.07] bg-background-light dark:bg-background-dark hover:bg-gray-600/5 dark:hover:bg-gray-200/5"
            size="icon"
            aria-label="Options"
          >
            <ChevronDown size={14} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-w-64 md:max-w-xs"
          side="bottom"
          sideOffset={4}
          align="end"
        >
          <DropdownMenuRadioGroup
            value={selectedIndex}
            onValueChange={setSelectedIndex}
          >
            {options.map((option, index) => (
              <DropdownMenuItem
                key={option.label}
                className="flex items-center"
              >
                <div className="border border-gray-200 dark:border-white/[0.07] rounded-lg p-1.5">
                  <MarkdownIcon />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ThemeSelector(props: { className?: string }) {
  const [theme, setTheme] = useState<string>("light");

  return (
    <div className={cn(props.className)}>
      <Toggle
        variant="default"
        className="group text-sm data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent"
        pressed={theme === "dark"}
        onPressedChange={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <MoonIcon
          size={16}
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}

export function RequestSnippets(props: { snippets: RequestSnippet }) {
  const keys = Object.keys(props.snippets);
  const [snippetId, setSnippetId] = useState(keys.at(0) || "");
  const value = props.snippets?.[snippetId as keyof RequestSnippet] as string;

  return (
    <>
      <div className="flex items-center justify-between px-1.5 h-10 ">
        <div className="flex items-center gap-1.5 text-xs font-medium min-w-0">
          <span className="truncate text-gray-950 dark:text-gray-50">
            {snippetId}
          </span>
        </div>
        <div className="flex font-sans text-sm items-center gap-x-1.5">
          <Select value={snippetId} onValueChange={setSnippetId}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {keys.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="font-sans text-xs"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center ml-auto text-muted-foreground">
            <Copy className="size-4" />
          </div>
        </div>
      </div>
      <div className="relative w-full overflow-scroll text-sm border h-fit max-h-48 border-input rounded-xl scrollbar-hide">
        <div>
          <CodeBlock code={value} language={snippetId} />
        </div>
      </div>
    </>
  );
}

export function ResponseSnippets(props: { snippets: ResponseSnippet[] }) {
  const { snippets } = props;
  const hasSnippets = snippets.length > 0;

  // Default selected tab is the first snippet, or empty if none
  const [selectedId, setSelectedId] = useState<string>(
    hasSnippets ? snippets[0].id : ""
  );

  if (!hasSnippets) {
    return (
      <div className="flex items-center justify-center text-sm h-9 rounded-xl text-muted-foreground">
        No defined response.
      </div>
    );
  }

  const selectedSnippet = snippets.find((s) => s.id === selectedId);

  return (
    <div className="w-full">
      <Tabs value={selectedId} onValueChange={setSelectedId} className="gap-0">
        {/* Header */}
        <TabsList className="text-foreground w-full rounded-none bg-transparent px-1.5 h-10 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-x-1.5">
            {snippets.map((snippet) => (
              <TabsTrigger
                key={snippet.id}
                value={snippet.id}
                className="hover:bg-muted-foreground/15 px-1.5 py-1 text-xs hover:text-foreground data-[state=active]:after:bg-muted-foreground data-[state=active]:hover:bg-muted-foreground/15 relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {snippet.id}
              </TabsTrigger>
            ))}
          </div>

          <button
            className="flex items-center ml-auto transition-colors text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (selectedSnippet) {
                navigator.clipboard.writeText(selectedSnippet.code);
              }
            }}
            title="Copy snippet"
          >
            <Copy className="size-4" />
          </button>
        </TabsList>

        {/* Snippet contents */}
        {snippets.map((snippet) => (
          <TabsContent
            key={snippet.id}
            value={snippet.id}
            className="relative w-full overflow-scroll border h-44 max-h-48 scrollbar-hide border-input rounded-xl"
          >
            <div className="text-sm">
              <CodeBlock code={snippet.code} language="json" />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export const DocsPagination = ({ previous, next }: DocPagination) => {
  const previousItem = (previous: DocPagination["previous"]) => (
    <Link href={previous.slug} className="flex items-center space-x-3 group">
      <ChevronLeft className="h-4 overflow-visible stroke-gray-400 group-hover:stroke-gray-600 dark:group-hover:stroke-gray-300" />
      <span className="group-hover:text-gray-900 dark:group-hover:text-white">
        {previous.label}
      </span>
    </Link>
  );

  const nextItem = (next: DocPagination["next"]) => (
    <Link
      href={next.slug}
      className="flex items-center ml-auto space-x-3 group"
    >
      <span className="group-hover:text-gray-900 dark:group-hover:text-white">
        {next.label}
      </span>
      <ChevronRight className="h-4 overflow-visible stroke-gray-400 group-hover:stroke-gray-600 dark:group-hover:stroke-gray-300" />
    </Link>
  );

  return (
    <div className="leading-6 mt-14 mb-12 px-0.5 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
      {previous && previousItem(previous)}
      {next && nextItem(next)}
    </div>
  );
};

export const DocsFooter = ({ socialLinks }: DocFooter) => {
  return (
    <footer className="flex justify-between gap-12 pt-10 leading-6 border-t border-gray-100 sm:flex dark:border-gray-800/50 pb-28">
      <div className="flex flex-wrap gap-6">
        {socialLinks.map((social) => (
          <Link
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="h-fit"
          >
            <span className="sr-only">{social.label}</span>
            <svg
              className="w-5 h-5 bg-gray-400 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-400"
              style={{
                maskImage: `url("${social.iconUrl}")`,
                WebkitMaskImage: `url("${social.iconUrl}")`,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
                maskSize: "contain",
                WebkitMaskSize: "contain",
              }}
            />
          </Link>
        ))}
      </div>

      {/* Powered by */}
      <div className="flex items-center justify-between">
        <div className="sm:flex">
          <a
            href="https://www.usebruno.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-nowrap"
          >
            Powered by Bruno
          </a>
        </div>
      </div>
    </footer>
  );
};

export const DocSearch = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const BreadCrumbs = (props: { filePath: string }) => {
    // Breaks a URI into individual parts separated by a forward slash
    const tokens = props.filePath.match(/\/|{[^}]+}|[^/]+/g) ?? [];

    return (
      <div className="flex items-center flex-1 min-w-0">
        {tokens.map((item, index) => {
          const key = `${item}-${index}`;

          if (item === "/") {
            const stripped = item.replace("/", "");
            return (
              <div key={key} className="flex items-center flex-shrink min-w-0">
                <ChevronRight className="mx-0.5 flex-shrink-0 size-3 text-gray-500 dark:text-gray-400" />
                <div className="[&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light text-xs text-gray-500 dark:text-gray-400 truncate">
                  {stripped}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="flex items-center flex-shrink-0">
              <div className="truncate [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light text-xs text-gray-500 dark:text-gray-400 w-fit">
                {item}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {isMobile === false && (
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex border font-geist-sans cursor-pointer text-muted-foreground hover:text-gray-800/90 justify-between w-64 h-9 ring-gray-400/20 text-sm ring-1 pl-3.5 pr-3 hover:ring-gray-600/25 border-input rounded-xl p-2 items-center gap-x-1.5"
        >
          <div className="flex items-center gap-x-2.5">
            <Search className="size-4" />
            <p className="tracking-tight">Search...</p>
          </div>
          <p>Ctrl K</p>
        </div>
      )}

      {isMobile === true && (
        <Button
          onClick={() => setSearchOpen(!searchOpen)}
          size="icon"
          variant="ghost"
        >
          <Search className="size-4" />
        </Button>
      )}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          className="max-w-[22rem] md:max-w-2xl translate-y-1 top-10 p-1.5 gap-0 bg-accent border-none rounded-2xl sm:rounded-2xl"
          hiddenCloseButton
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Document search</DialogTitle>
            <DialogDescription>
              Search for relevant documents.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center px-3 py-1 border border-black gap-x-2 rounded-xl">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              value={query}
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              className="p-0 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {query && (
              <kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border rounded">
                ESC
              </kbd>
            )}
          </div>
          <div className="mt-3 overflow-y-auto max-h-96">
            <div className="last:mb-2 group" role="option" tabIndex={-1}>
              <div className="cursor-pointer relative rounded-xl flex gap-3 px-2.5 py-2 items-center">
                <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex items-center gap-1">
                    <BreadCrumbs filePath="Using the REST API/Pagination" />
                  </div>
                  <div className="flex items-center gap-1 text-gray-800 dark:text-gray-200">
                    <div className="truncate text-sm leading-[18px] text-gray-800 dark:text-gray-200 [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light font-medium">
                      Pagination
                    </div>
                  </div>
                  <p className="text-xs truncate w-full text-gray-500 [&_mark]:text-gray-500 [&_mark]:bg-transparent [&_mark_b]:font-normal [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_b_mark]:font-normal [&amp;_b_mark]:text-primary dark:[&amp;_b_mark]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light">
                    Pagination When the API res
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-transparent group-hover:text-primary" />
              </div>
            </div>

            {/* Methods */}
            <div className="last:mb-2 group" role="option" tabIndex={-1}>
              <div className="cursor-pointer relative rounded-xl flex gap-3 px-2.5 py-2 items-center">
                <SquareTerminal className="w-4 h-4 shrink-0 text-primary dark:text-primary-light" />
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex items-center gap-1">
                    <BreadCrumbs filePath="Endpoints/Endpoints/teams/Invite a user" />
                  </div>
                  <div className="flex items-center gap-1 text-gray-800 dark:text-gray-200">
                    <div className="px-1 py-0 font-mono text-xs font-bold text-blue-700 rounded method-pill bg-blue-400/20 dark:bg-blue-400/20 dark:text-blue-400">
                      POST
                    </div>
                    <div className="truncate text-sm leading-[18px] text-gray-800 dark:text-gray-200 [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light font-medium">
                      Invite a user
                    </div>
                  </div>
                  <p className="text-xs truncate w-full text-gray-500 [&_mark]:text-gray-500 [&_mark]:bg-transparent [&_mark_b]:font-normal [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_b_mark]:font-normal [&amp;_b_mark]:text-primary dark:[&amp;_b_mark]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light">
                    to join the team specified in the URL. The{" "}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-transparent group-hover:text-primary" />
              </div>
            </div>

            {/* Ask AI */}
            <div className="px-2.5 py-2 text-gray-500 text-sm truncate w-full">
              Ask AI assistant
            </div>
            <div className="last:mb-2" role="option" tabIndex={-1}>
              <div className="flex items-center gap-2 px-2.5 py-2 w-full cursor-pointer rounded-xl bg-[#F7F7F8] dark:bg-white/5">
                <WandSparkles className="w-4 h-4 text-primary dark:text-primary-dark shrink-0" />
                <span className="text-sm font-medium text-gray-800 truncate dark:text-gray-200">
                  Can you tell me about "{query}"?
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Sections

export const AuthorizationSection = () => {
  return (
    <>
      <div className="flex flex-col w-full gap-y-4">
        <div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
          <h4 className="flex-1 mb-0 ">Authorizations</h4>
          <div className="flex items-center"></div>
        </div>
      </div>
      <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <div className="py-6">
          <div className="relative flex text-sm break-all group/param-head param-head">
            <div className="flex-1 flex content-start py-0.5 mr-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="absolute -top-1.5">
                  <Link
                    href="#authorization-authorization"
                    className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 py-2 [.expandable-content_&amp;]:-ml-[2.1rem]"
                    aria-label="Navigate to header"
                  >
                    ​
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
                      <Link2 className="h-4" color="gray" />
                    </div>
                  </Link>
                </div>
                <div className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
                  Authorization
                </div>
                <div className="flex items-center gap-2 text-xs font-medium [&amp;_div]:inline [&amp;_div]:mr-2 [&amp;_div]:leading-5">
                  <div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
                    <span>string</span>
                  </div>
                  <div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
                    <span>header</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-red-100/50 dark:bg-red-400/10 text-red-600 dark:text-red-300 font-medium whitespace-nowrap">
                    required
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="prose-sm prose prose-gray dark:prose-invert">
              <p className="whitespace-pre-line">
                Default authentication mechanism
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const QueryParamsSection = () => {
  return (
    <>
      <div className="flex flex-col w-full gap-y-4">
        <div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
          <h4 className="flex-1 mb-0">Query Parameters</h4>
          <div className="flex items-center"></div>
        </div>
      </div>
      <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <div className="py-6">
          <div className="relative flex font-mono text-sm break-all group/param-head param-head">
            <div className="flex-1 flex content-start py-0.5 mr-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="absolute -top-1.5">
                  <Link
                    href="#parameter-team-id"
                    className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 py-2 [.expandable-content_&amp;]:-ml-[2.1rem]"
                    aria-label="Navigate to header"
                  >
                    ​
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
                      <Link2 className="h-4" color="gray" />
                    </div>
                  </Link>
                </div>
                <div className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
                  teamId
                </div>
                <div className="inline items-center gap-2 text-xs font-medium [&amp;_div]:inline [&amp;_div]:mr-2 [&amp;_div]:leading-5">
                  <div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
                    <span>string</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="prose-sm prose prose-gray dark:prose-invert">
              <p className="whitespace-pre-line">
                The Team identifier to perform the request on behalf of.
              </p>
            </div>
            <div className="flex prose prose-sm prose-gray dark:prose-invert mt-6 gap-1.5">
              <span>Example</span>
              <div className="prose prose-sm prose-gray dark:prose-invert overflow-wrap-anywhere text-[13px] [&amp;_*]:text-[13px]">
                <p className="whitespace-pre-line">
                  <code>
                    <span>"team_1a2b3c4d5e6f7g8h9i0j1k2l"</span>
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const PathParamsSection = () => {
  return (
    <>
      <div className="flex flex-col w-full gap-y-4">
        <div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
          <h4 className="flex-1 mb-0">Path Parameters</h4>
          <div className="flex items-center"></div>
        </div>
      </div>
      <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <div className="py-6">
          <div className="relative flex font-mono text-sm break-all group/param-head param-head">
            <div className="flex-1 flex content-start py-0.5 mr-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="absolute -top-1.5">
                  <Link
                    href="#parameter-team-id"
                    className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 py-2 [.expandable-content_&amp;]:-ml-[2.1rem]"
                    aria-label="Navigate to header"
                  >
                    ​
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
                      <Link2 className="h-4" color="gray" />
                    </div>
                  </Link>
                </div>
                <div className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
                  teamId
                </div>
                <div className="inline items-center gap-2 text-xs font-medium [&amp;_div]:inline [&amp;_div]:mr-2 [&amp;_div]:leading-5">
                  <div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
                    <span>string</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="prose-sm prose prose-gray dark:prose-invert">
              <p className="whitespace-pre-line">
                The Team identifier to perform the request on behalf of.
              </p>
            </div>
            <div className="flex prose prose-sm prose-gray dark:prose-invert mt-6 gap-1.5">
              <span>Example</span>
              <div className="prose prose-sm prose-gray dark:prose-invert overflow-wrap-anywhere text-[13px] [&amp;_*]:text-[13px]">
                <p className="whitespace-pre-line">
                  <code>
                    <span>"team_1a2b3c4d5e6f7g8h9i0j1k2l"</span>
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ResponseBodySection = () => {
  return (
    <>
      <div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
        <h4 className="flex-1 mb-0">Body</h4>
        <span className="px-2 py-0.5 font-mono text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white">
          application/json
        </span>
      </div>

      <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <div className="py-6">
          <div className="relative flex font-mono text-sm break-all group/param-head param-head">
            <div className="flex-1 flex content-start py-0.5 mr-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="absolute -top-1.5">
                  <Link
                    href="#parameter-team-id"
                    className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 py-2 [.expandable-content_&amp;]:-ml-[2.1rem]"
                    aria-label="Navigate to header"
                  >
                    ​
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
                      <Link2 className="h-4" color="gray" />
                    </div>
                  </Link>
                </div>
                <div className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
                  teamId
                </div>
                <div className="inline items-center gap-2 text-xs font-medium [&amp;_div]:inline [&amp;_div]:mr-2 [&amp;_div]:leading-5">
                  <div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
                    <span>string</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="prose-sm prose prose-gray dark:prose-invert">
              <p className="whitespace-pre-line">
                The Team identifier to perform the request on behalf of.
              </p>
            </div>
            <div className="flex prose prose-sm prose-gray dark:prose-invert mt-6 gap-1.5">
              <span>Example</span>
              <div className="prose prose-sm prose-gray dark:prose-invert overflow-wrap-anywhere text-[13px] [&amp;_*]:text-[13px]">
                <p className="whitespace-pre-line">
                  <code>
                    <span>"team_1a2b3c4d5e6f7g8h9i0j1k2l"</span>
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ResponseTypes = (props: { responseTable: any }) => {
  return (
    <>
      <div className="flex items-baseline border-b pb-2.5 border-gray-100 dark:border-gray-800 w-full">
        <h4 className="flex-1 mb-0">Response</h4>
        <div className="flex items-center font-mono text-xs gap-x-3">
          <span className="px-2 py-0.5 font-medium text-gray-600 dark:text-gray-300 hover:text-zinc-950 dark:hover:text-white transition-all">
            <ResponseStatus responseTable={props.responseTable} />
          </span>
          <span className="px-2 py-0.5 font-medium text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white">
            application/json
          </span>
        </div>
      </div>

      <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <div className="py-6">
          <div className="relative flex font-mono text-sm break-all group/param-head param-head">
            <div className="flex-1 flex content-start py-0.5 mr-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="absolute -top-1.5">
                  <Link
                    href="#parameter-team-id"
                    className="-ml-10 flex items-center opacity-0 border-0 group-hover/param-head:opacity-100 py-2 [.expandable-content_&amp;]:-ml-[2.1rem]"
                    aria-label="Navigate to header"
                  >
                    ​
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
                      <Link2 className="h-4" color="gray" />
                    </div>
                  </Link>
                </div>
                <div className="font-semibold cursor-pointer text-primary dark:text-primary-light overflow-wrap-anywhere">
                  teamId
                </div>
                <div className="inline items-center gap-2 text-xs font-medium [&amp;_div]:inline [&amp;_div]:mr-2 [&amp;_div]:leading-5">
                  <div className="flex items-center px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-200 font-medium break-all">
                    <span>string</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="prose-sm prose prose-gray dark:prose-invert">
              <p className="whitespace-pre-line">
                The Team identifier to perform the request on behalf of.
              </p>
            </div>
            <div className="flex prose prose-sm prose-gray dark:prose-invert mt-6 gap-1.5">
              <span>Example</span>
              <div className="prose prose-sm prose-gray dark:prose-invert overflow-wrap-anywhere text-[13px] [&amp;_*]:text-[13px]">
                <p className="whitespace-pre-line">
                  <code>
                    <span>"team_1a2b3c4d5e6f7g8h9i0j1k2l"</span>
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
