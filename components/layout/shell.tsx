"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useBaseConfig } from "@/lib/base/config-provider";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  BriefcaseIcon,
  FileTextIcon,
  ShieldCheckIcon,
  InfoIcon,
  MailIcon,
  PlusIcon,
  PanelLeftIcon,
  MenuIcon,
} from "lucide-react";
import {
  ThreadListPrimitive,
  useAui,
  useAuiState,
  type AssistantState,
} from "@assistant-ui/react";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { ModelSelector } from "@/components/assistant-ui/model-selector";
import { docsModelOptions } from "@/components/docs/assistant/docs-model-options";
import { DEFAULT_MODEL_ID } from "@/constants/model";

const Logo: FC = () => {
  const { assistant } = useBaseConfig();

  return (
    <div className="flex items-center gap-2 px-2 text-sm font-medium">
      <RyanAvatar />
      <span className="flex flex-col leading-tight">
        <span className="text-primary">{assistant.appName}</span>
        <span className="text-muted-foreground text-[10px] font-normal">
          AI Engineer
        </span>
      </span>
    </div>
  );
};

const RyanAvatar: FC = () => (
  <span className="relative -translate-x-0.5 size-8 shrink-0 overflow-hidden rounded-full border border-white/25 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.35),transparent_38%),linear-gradient(145deg,#6b7280,#111827)] shadow-[inset_-2px_-2px_3px_rgba(0,0,0,0.45),inset_1px_1px_2px_rgba(255,255,255,0.35)]">
    <Image
      src="/ryan-avatar.jpeg"
      alt="Ryan Jordan"
      fill
      sizes="32px"
      className="object-cover"
    />
  </span>
);

const Sidebar: FC<{ collapsed: boolean; pathname: string }> = ({
  collapsed,
  pathname,
}) => {
  const { assistant } = useBaseConfig();
  const collapsedIconClass = "mt-2 ml-4 mr-1 size-8";
  const isActive = (route: string) => pathname === route;

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden bg-black duration-200 relative",
        collapsed ? "w-12" : "w-52",
      )}
    >
      <div
        className={cn(
          "mt-2 flex h-12 shrink-0 items-center transition-[padding] duration-200",
          collapsed ? "px-4.5" : "px-5",
        )}
      >
        <RyanAvatar />
        <span
          className={cn(
            "text-primary ml-2 flex flex-col text-sm font-medium leading-tight whitespace-nowrap transition-opacity duration-200",
            collapsed && "opacity-0",
          )}
        >
          <span>{assistant.appName}</span>
          <span className="text-muted-foreground text-[10px] font-normal">
            AI Engineer
          </span>
        </span>
      </div>
      {collapsed ? (
        <>
          <Link href="/">
            <TooltipIconButton
              tooltip="Home"
              side="right"
              variant="ghost"
              size="icon"
              className={cn(collapsedIconClass, isActive("/") && "bg-primary/10")}
            >
              <HomeIcon className={cn("size-4", isActive("/") && "text-primary")} />
            </TooltipIconButton>
          </Link>
          <Link href="/projects">
            <TooltipIconButton
              tooltip="Projects"
              side="right"
              variant="ghost"
              size="icon"
              className={cn(collapsedIconClass, isActive("/projects") && "bg-primary/10")}
            >
              <BriefcaseIcon className={cn("size-4", isActive("/projects") && "text-primary")} />
            </TooltipIconButton>
          </Link>
          <Link href="/resume">
            <TooltipIconButton
              tooltip="Resume"
              side="right"
              variant="ghost"
              size="icon"
              className={cn(collapsedIconClass, isActive("/resume") && "bg-primary/10")}
            >
              <FileTextIcon className={cn("size-4", isActive("/resume") && "text-primary")} />
            </TooltipIconButton>
          </Link>
          <Link href="/proof">
            <TooltipIconButton
              tooltip="Proof"
              side="right"
              variant="ghost"
              size="icon"
              className={cn(collapsedIconClass, isActive("/proof") && "bg-primary/10")}
            >
              <ShieldCheckIcon className={cn("size-4", isActive("/proof") && "text-primary")} />
            </TooltipIconButton>
          </Link>
          <Link href="/about">
            <TooltipIconButton
              tooltip="About"
              side="right"
              variant="ghost"
              size="icon"
              className={cn(collapsedIconClass, isActive("/about") && "bg-primary/10")}
            >
              <InfoIcon className={cn("size-4", isActive("/about") && "text-primary")} />
            </TooltipIconButton>
          </Link>
          <Link href="/contact">
            <TooltipIconButton
              tooltip="Contact"
              side="right"
              variant="ghost"
              size="icon"
              className={cn(collapsedIconClass, isActive("/contact") && "bg-primary/10")}
            >
              <MailIcon className={cn("size-4", isActive("/contact") && "text-primary")} />
            </TooltipIconButton>
          </Link>
          <Link href="/chat">
            <span onClick={(e) => e.stopPropagation()}>
              <TooltipIconButton
                tooltip="New thread"
                side="right"
                variant="ghost"
                size="icon"
                className="mt-0 ml-4 mr-1 size-8"
              >
                <PlusIcon className="size-4" />
              </TooltipIconButton>
            </span>
          </Link>
        </>
      ) : (
        <div className="relative w-52 flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-2.5 mb-2">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "aui-thread-list-new border-primary/20 h-8 w-full justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                  isActive("/")
                    ? "bg-gradient-to-b from-primary/18 to-primary/10"
                    : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
                )}
              >
                <HomeIcon className="size-3.5" />
                Home
              </Button>
            </Link>
            <Link href="/projects">
              <Button
                variant="ghost"
                className={cn(
                  "aui-thread-list-new border-primary/20 h-8 w-full justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                  isActive("/projects")
                    ? "bg-gradient-to-b from-primary/18 to-primary/10"
                    : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
                )}
              >
                <BriefcaseIcon className="size-3.5" />
                Projects
              </Button>
            </Link>
            <Link href="/resume">
              <Button
                variant="ghost"
                className={cn(
                  "aui-thread-list-new border-primary/20 h-8 w-full justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                  isActive("/resume")
                    ? "bg-gradient-to-b from-primary/18 to-primary/10"
                    : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
                )}
              >
                <FileTextIcon className="size-3.5" />
                Resume
              </Button>
            </Link>
            <Link href="/proof">
              <Button
                variant="ghost"
                className={cn(
                  "aui-thread-list-new border-primary/20 h-8 w-full justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                  isActive("/proof")
                    ? "bg-gradient-to-b from-primary/18 to-primary/10"
                    : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
                )}
              >
                <ShieldCheckIcon className="size-3.5" />
                Proof
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                className={cn(
                  "aui-thread-list-new border-primary/20 h-8 w-full justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                  isActive("/about")
                    ? "bg-gradient-to-b from-primary/18 to-primary/10"
                    : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
                )}
              >
                <InfoIcon className="size-3.5" />
                About
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                className={cn(
                  "aui-thread-list-new border-primary/20 h-8 w-full justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                  isActive("/contact")
                    ? "bg-gradient-to-b from-primary/18 to-primary/10"
                    : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
                )}
              >
                <MailIcon className="size-3.5" />
                Contact
              </Button>
            </Link>
          </div>
          <div className="mt-2">
            <ThreadList />
          </div>
        </div>
      )}
    </aside>
  );
};

const MobileSidebar: FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 md:hidden"
        >
          <MenuIcon className="size-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-70 flex-col p-0">
        <div className="flex h-12 shrink-0 items-center px-4">
          <Logo />
        </div>
        <div className="relative flex-1 overflow-y-auto p-3">
          <ThreadList />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const models = docsModelOptions();

const ModelPicker: FC = () => {
  return (
    <ModelSelector
      models={models}
      defaultValue={DEFAULT_MODEL_ID}
      variant="ghost"
      size="sm"
      className="h-7 rounded-full"
    />
  );
};

const ThreadTitle: FC = () => {
  const title = useAuiState(
    (s) =>
      s.threads.threadItems.find((t) => t.id === s.threads.mainThreadId)?.title,
  );

  return (
    <span className="min-w-0 truncate text-sm font-medium">
      {title ?? "New chat"}
    </span>
  );
};

const Header: FC<{
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  pathname: string;
}> = ({ sidebarCollapsed, onToggleSidebar, pathname }) => {
  const isActive = (route: string) => pathname === route;
  const getTitle = () => {
    if (isActive("/about")) return "About";
    if (isActive("/projects")) return "Projects";
    if (isActive("/resume")) return "Resume";
    if (isActive("/proof")) return "Proof";
    if (isActive("/contact")) return "Contact";
    if (isActive("/")) return "Home";
    return <ThreadTitle />;
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 bg-[#1c1c1c] px-4">
      <MobileSidebar />
      <TooltipIconButton
        variant="ghost"
        size="icon"
        tooltip={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        side="bottom"
        onClick={onToggleSidebar}
        className="hidden size-8 md:flex"
      >
        <PanelLeftIcon className="size-4" />
      </TooltipIconButton>
      {getTitle()}
      <div className="ml-auto flex items-center gap-2">
        <a
          href="https://github.com/ryanjordan11"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-white/70 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/ryan-jordan-258a191b5"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-white/70 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.369 4.266 5.455v6.287zM3.56 20.452h3.558V8.999H3.56v11.453zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124z" />
          </svg>
        </a>
      </div>
    </header>
  );
};

const SidebarCollapsedContext = createContext<{
  collapsed: boolean;
  toggle: () => void;
}>({ collapsed: true, toggle: () => {} });

export function SidebarStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <SidebarCollapsedContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarCollapsedContext.Provider>
  );
}

function useSidebarState() {
  return useContext(SidebarCollapsedContext);
}

function PageShell({
  children,
  sidebarCollapsed,
  onToggleSidebar,
}: {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const state = useSidebarState();
  const collapsed = sidebarCollapsed ?? state.collapsed;
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full bg-black">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} pathname={pathname} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="bg-background flex flex-1 flex-col overflow-hidden rounded-lg border border-primary/20 shadow-lg shadow-white/20">
          <Header
            sidebarCollapsed={collapsed}
            onToggleSidebar={
              onToggleSidebar ?? state.toggle
            }
            pathname={pathname}
          />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export { PageShell };
export default PageShell;
