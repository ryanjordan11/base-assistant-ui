"use client";

import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { DotMatrix } from "@/components/assistant-ui/dot-matrix";
import { MessageTiming } from "@/components/assistant-ui/message-timing";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import {
  ToolGroupContent,
  ToolGroupRoot,
  ToolGroupTrigger,
} from "@/components/assistant-ui/tool-group";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  Reasoning,
  ReasoningContent,
  ReasoningRoot,
  ReasoningText,
  ReasoningTrigger,
} from "@/components/assistant-ui/reasoning";
import { Button } from "@/components/ui/button";
import { useBaseConfig } from "@/lib/base/config-provider";
import type { BaseSuggestionIconId } from "@/lib/base/preview-schema";
import { cn } from "@/lib/utils";
import {
  ComposerQuotePreview,
  QuoteBlock,
  SelectionToolbar,
} from "@/components/assistant-ui/quote";
import { ComposerTriggerPopover } from "@/components/assistant-ui/composer-trigger-popover";
import { DirectiveText } from "@/components/assistant-ui/directive-text";
import {
  ActionBarMorePrimitive,
  ActionBarPrimitive,
  AuiIf,
  type AssistantState,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  groupPartByType,
  MessagePrimitive,
  ThreadListPrimitive,
  ThreadPrimitive,
  unstable_useMentionAdapter,
  unstable_useSlashCommandAdapter,
  useAui,
  useAuiState,
  type Unstable_SlashCommand,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChartColumnIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudSunIcon,
  CodeXmlIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  GlobeIcon,
  HelpCircleIcon,
  HomeIcon,
  InfoIcon,
  ShieldCheckIcon,
  LanguagesIcon,
  LightbulbIcon,
  MenuIcon,
  MicIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  PencilIcon,
  PencilLineIcon,
  PlusIcon,
  RefreshCwIcon,
  ShareIcon,
  SlashIcon,
  SquareIcon,
  WrenchIcon,
  BriefcaseIcon,
  MailIcon,
} from "lucide-react";
import {
  LexicalComposerInput,
  type DirectiveChipProps,
} from "@assistant-ui/react-lexical";
import Image from "next/image";
import { useState, useEffect, type FC } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

const Sidebar: FC<{
  collapsed?: boolean;
  onHome: () => void;
  onAbout: () => void;
  onChat: () => void;
  onProjects: () => void;
  onResume: () => void;
  onProof: () => void;
  onContact: () => void;
  aboutActive: boolean;
  activeView: "chat" | "home" | "about" | "projects" | "resume" | "proof" | "contact";
}> = ({ collapsed, onHome, onAbout, onChat, onProjects, onResume, onProof, onContact, aboutActive, activeView }) => {
  const { assistant } = useBaseConfig();

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden bg-black duration-200 relative",
        collapsed ? "w-12" : "w-65",
      )}
    >
      <div
        className={cn(
          "mt-2 flex h-12 shrink-0 items-center transition-[padding] duration-200",
          collapsed ? "px-3.5" : "px-5",
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
          <TooltipIconButton
            tooltip="Home"
            side="right"
            variant="ghost"
            size="icon"
            className="mx-2 mt-2 size-8"
            onClick={onHome}
          >
            <HomeIcon className="size-4" />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip="Projects"
            side="right"
            variant="ghost"
            size="icon"
            className="mx-2 mt-2 size-8"
            onClick={onProjects}
          >
            <BriefcaseIcon className="size-4" />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip="Resume"
            side="right"
            variant="ghost"
            size="icon"
            className="mx-2 mt-2 size-8"
            onClick={onResume}
          >
            <FileTextIcon className="size-4" />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip="Proof"
            side="right"
            variant="ghost"
            size="icon"
            className="mx-2 mt-2 size-8"
            onClick={onProof}
          >
            <ShieldCheckIcon className="size-4" />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip="About"
            side="right"
            variant="ghost"
            size="icon"
            className="mx-2 mt-2 size-8"
            onClick={onAbout}
          >
            <InfoIcon className="size-4" />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip="Contact"
            side="right"
            variant="ghost"
            size="icon"
            className="mx-2 mt-2 size-8"
            onClick={onContact}
          >
            <MailIcon className="size-4" />
          </TooltipIconButton>
          <ThreadListPrimitive.New asChild>
            <span onClick={onChat}>
              <TooltipIconButton
                tooltip="New thread"
                side="right"
                variant="ghost"
                size="icon"
                className="mt-1 ml-[0.625rem] size-8"
              >
                <PlusIcon className="size-4" />
              </TooltipIconButton>
            </span>
          </ThreadListPrimitive.New>
        </>
       ) : (
         <div
          className="relative w-65 flex-1 overflow-y-auto p-3"
        >
          <div className="flex flex-col gap-2.5 mb-3">
            <Button
              variant="ghost"
              className={cn(
                "aui-thread-list-new border-primary/20 h-8 justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                activeView === "home"
                  ? "bg-gradient-to-b from-primary/18 to-primary/10"
                  : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
              )}
              onClick={(e) => { e.stopPropagation(); onHome(); }}
            >
              <HomeIcon className="size-3.5" />
              Home
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "aui-thread-list-new border-primary/20 h-8 justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                activeView === "projects"
                  ? "bg-gradient-to-b from-primary/18 to-primary/10"
                  : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
              )}
              onClick={(e) => { e.stopPropagation(); onProjects(); }}
            >
              <BriefcaseIcon className="size-3.5" />
              Projects
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "aui-thread-list-new border-primary/20 h-8 justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                activeView === "resume"
                  ? "bg-gradient-to-b from-primary/18 to-primary/10"
                  : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
              )}
              onClick={(e) => { e.stopPropagation(); onResume(); }}
            >
              <FileTextIcon className="size-3.5" />
              Resume
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "aui-thread-list-new border-primary/20 h-8 justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                activeView === "proof"
                  ? "bg-gradient-to-b from-primary/18 to-primary/10"
                  : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
              )}
              onClick={(e) => { e.stopPropagation(); onProof(); }}
            >
              <ShieldCheckIcon className="size-3.5" />
              Proof
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "aui-thread-list-new border-primary/20 h-8 justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                activeView === "about"
                  ? "bg-gradient-to-b from-primary/18 to-primary/10"
                  : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
              )}
              onClick={(e) => { e.stopPropagation(); onAbout(); }}
            >
              <InfoIcon className="size-3.5" />
              About
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "aui-thread-list-new border-primary/20 h-8 justify-start gap-2 rounded-md border px-2.5 text-sm font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]",
                activeView === "contact"
                  ? "bg-gradient-to-b from-primary/18 to-primary/10"
                  : "bg-gradient-to-b from-primary/12 to-primary/6 hover:from-primary/18 hover:to-primary/10",
              )}
              onClick={(e) => { e.stopPropagation(); onContact(); }}
            >
              <MailIcon className="size-3.5" />
              Contact
            </Button>
          </div>
          <div onClick={onChat}>
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
  const { assistant } = useBaseConfig();
  const title = useAuiState(
    (s) =>
      s.threads.threadItems.find((t) => t.id === s.threads.mainThreadId)?.title,
  );

  return (
    <span className="min-w-0 truncate text-sm font-medium">
      {title ?? assistant.labels.newChat}
    </span>
  );
};

const Header: FC<{
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  activeView: "chat" | "home" | "about" | "projects" | "resume" | "proof" | "contact";
}> = ({ sidebarCollapsed, onToggleSidebar, activeView }) => {
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
       {activeView === "about" ? <span className="text-sm font-medium">About</span> : activeView === "projects" ? <span className="text-sm font-medium">Projects</span> : activeView === "resume" ? <span className="text-sm font-medium">Resume</span> : activeView === "proof" ? <span className="text-sm font-medium">Proof</span> : activeView === "contact" ? <span className="text-sm font-medium">Contact</span> : activeView === "home" ? <span className="text-sm font-medium">Home</span> : <ThreadTitle />}
      <TooltipIconButton
        variant="ghost"
        size="icon"
        tooltip="Share"
        side="bottom"
        disabled
        className="ml-auto size-8"
      >
        <ShareIcon className="size-4" />
      </TooltipIconButton>
    </header>
  );
};

// Startup exposes a loading placeholder thread; treat it as a new chat so
// the composer mounts centered. Loads after startup keep the docked layout.
const isNewChatView = (s: AssistantState) =>
  s.thread.messages.length === 0 &&
  (!s.thread.isLoading || s.threads.isLoading);

const Thread: FC = () => {
  const isEmpty = useAuiState(isNewChatView);

  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root bg-[#1c1c1c] @container flex h-full flex-col"
      style={{
        ["--thread-max-width" as string]: "44rem",
        ["--composer-bg" as string]:
          "color-mix(in oklab, var(--color-muted) 30%, var(--color-background))",
        ["--composer-radius" as string]: "1.5rem",
        ["--composer-padding" as string]: "8px",
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        data-slot="aui_thread-viewport"
        className={cn(
          "relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4",
          isEmpty && "justify-center",
        )}
      >
        <AuiIf condition={isNewChatView}>
          <ThreadWelcome />
        </AuiIf>

        <div
          data-slot="aui_message-group"
          className="mb-14 flex flex-col gap-y-6 empty:hidden"
        >
          <ThreadPrimitive.Messages>
            {({ message }) => {
              if (message.composer.isEditing) return <EditComposer />;
              if (message.role === "user") return <UserMessage />;
              return <AssistantMessage />;
            }}
          </ThreadPrimitive.Messages>
        </div>

        <ThreadPrimitive.ViewportFooter
          className={cn(
            "aui-thread-viewport-footer bg-[#1c1c1c] mx-auto flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible pb-4 md:pb-6",
            !isEmpty && "sticky bottom-0 mt-auto rounded-t-(--composer-radius)",
          )}
        >
          <ThreadScrollToBottom />
          <Composer />
          <AuiIf condition={isNewChatView}>
            <div className="aui-thread-welcome-suggestions-shell min-h-19">
              <AuiIf condition={(s) => s.composer.isEmpty}>
                <ThreadSuggestions />
              </AuiIf>
            </div>
          </AuiIf>
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>

      <SelectionToolbar />
    </ThreadPrimitive.Root>
  );
};

const AboutView: FC = () => {
  return <div className="flex h-full items-center justify-center bg-[#1c1c1c]">About</div>;
};

const ProjectsView: FC = () => {
  return <div className="flex h-full items-center justify-center bg-[#1c1c1c]">Projects</div>;
};

const ContactView: FC = () => {
  return <div className="flex h-full items-center justify-center bg-[#1c1c1c]">Contact</div>;
};

const HomeView: FC = () => {
  useEffect(() => {
    const canvas = document.getElementById("neural-bg") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number, height: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const resize = () => {
      width = canvas.parentElement!.clientWidth;
      height = canvas.parentElement!.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: 1 + Math.random() * 2,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        // Draw particle
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);

          if (ddist < 150) {
            ctx.globalAlpha = (1 - ddist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    init();
    requestAnimationFrame(animate);

    window.addEventListener("resize", resize);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-center relative rounded-2xl overflow-hidden" style={{ backgroundImage: "url('/background-home.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/40" />
      <canvas id="neural-bg" className="absolute inset-0 w-full h-full z-0" />
      <div className="relative z-10 absolute left-10 bottom-10 text-white max-w-2/3 flex flex-col gap-4">
        <p className="text-xs text-gray-400 tracking-widest uppercase animate-fade-in-up">
Ryan Jordan | AI Engineer & Architect
        </p>
        <h1 className="text-5xl font-bold tracking-tight leading-tight animate-fade-in-up">
          I solved AI hallucinations.
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed animate-fade-in-up">
          Not with a longer prompt. Not by adding another AI judge. I changed the architecture, moving memory, authority, evidence, and control outside the model.
        </p>
        <p className="text-gray-400 mt-2 leading-relaxed animate-fade-in-up">
          I&rsquo;m Ryan Jordan, an AI engineer and founder building reliable AI systems, production applications, and technology designed to hold up beyond the demo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up">
          <Button size="sm">Explore my work</Button>
          <Button size="sm" variant="outline">Test the system</Button>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-20 flex gap-3">
        <a
          href="https://github.com/ryanjordan11"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-white transition-colors hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/ryan-jordan-258a191b5"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-white transition-colors hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.369 4.266 5.455v6.287zM3.56 20.452h3.558V8.999H3.56v11.453zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124z" />
          </svg>
        </a>
      </div>
      <Image
        src="/ryan_jordan_EXACT_cutout.png"
        alt="Ryan Jordan"
        width={800}
        height={1000}
        className="relative z-10 absolute right-[-5%] bottom-[-15%] max-w-3/4 object-contain"
      />
    </div>
  );
};

const ResumeView: FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#1c1c1c] text-foreground p-6 md:p-10">
      <div className="w-full max-w-3xl flex-1 overflow-y-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Ryan Jordan</h1>
          <p className="text-primary text-lg font-medium mt-1">
            AI Engineer and Architect | AI Evaluation, Safety, and Hallucination Testing
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            10,000 Verbatim Exact Matches &nbsp;|&nbsp; Punta Cana, Dominican Republic &nbsp;|&nbsp; Canadian citizen
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 border-b border-primary/30 pb-1">Highlights</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
            <li>10,000 verbatim recalls, every one an exact match, SHA-256 verified, no AI judges</li>
            <li>2.4 billion Facebook views in one month, 5 billion+ in a year, across groups with 20 million members</li>
            <li>7.7 billion tokens processed this year for under $100</li>
            <li>2,000 builds in 2026, including 170+ apps</li>
            <li>1,000+ clients in MetaMasters with a 1-million-views-in-24-hours guarantee and zero refunds</li>
            <li>180 of 180 on a live access-control test; ranked number two in the world among AI innovators on Facebook</li>
            <li>18 months of hands-on testing of the major AI models, 350 repos built, and 7.7 billion tokens used this year</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 border-b border-primary/30 pb-1">Summary</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI engineer and founder who built and is running a world-record attempt in verbatim AI recall: 10,000 rows tested, every one an exact match. Created The Rock, a deterministic benchmark using exact-byte comparison and SHA-256 hashing with no AI judges, and Ubiquitous, a multi-model AI workspace taken from idea to live users as the only builder. Shipped 170+ apps and 1,500+ prototypes in 2026, processing 7.7 billion tokens this year for under $100. Built a deterministic benchmark that catches what AI judges miss, with exact-match results across the model catalogs of Z.AI, Anthropic, Qwen, OpenAI, and Google. Seeking an AI engineer, architect, or evaluation and safety role where proving AI reliability is the job.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 border-b border-primary/30 pb-1">Core Skills</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
            <li>Solution and systems architecture for AI-powered products</li>
            <li>Multi-model orchestration across every major provider (OpenAI, Anthropic, Google, Qwen, Z.AI and more)</li>
            <li>Deterministic validation and benchmarking (SHA-256 verbatim verification, adversarial access-control testing)</li>
            <li>Cloud deployment on Azure; sandboxed execution with Daytona</li>
            <li>Integration platforms: Composio (1,600+ connectable apps), OpenAlex, Context7</li>
            <li>Cost and performance optimization (high cache-hit architectures, sub-cent per-call cost)</li>
            <li>Technical leadership, product strategy, and rapid prototyping</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 border-b border-primary/30 pb-1">Experience</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Founder and Lead Architect, Ubiquitous</h3>
            <p className="text-sm text-muted-foreground">2025 to present</p>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-chat AI workspace with full user control over prompt, payload, and message history.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed mt-2">
              <li>Designed, built, and shipped the full platform solo: architecture, backend, front end, testing, pricing, and launch</li>
              <li>Built dual-chat and parallel-chat workflows where one chat drives a live artifact while another works a separate task, with every model provider swappable mid-conversation</li>
              <li>Gave users complete control of prompt, payload, and message history, with rules enforced in code outside the model so results stay predictable and auditable</li>
              <li>Connected 1,600+ third-party apps through Composio, plus research and documentation knowledge bases, voice-to-voice, automations, and sandboxed code execution</li>
              <li>Proved access control holds under attack: 180 of 180 on a live adversarial test across fictional patient and doctor records, and 9 of 9 on a separate adversarial report</li>
              <li>Ran 12.2K live requests (357.4M tokens) for $45.88 at a 94.1% cache hit rate; median response of about one second at roughly $0.000132 per call</li>
              <li>Won real users, with recorded demos of their reactions, and set pricing and launch strategy for the product</li>
              <li>Ran a recorded, unedited side-by-side test of Ubiquitous against Claude and Gemini, with a fresh chat for every question and identical wording: Ubiquitous kept the record across chats while Claude and Gemini started blank (full video on YouTube)</li>
              <li>Designed and ran 12 recorded tests on Claude, which failed all twelve</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Creator, The Rock Benchmark</h3>
            <p className="text-sm text-muted-foreground">2026</p>
            <p className="text-sm text-muted-foreground mt-1">
              Built and is running a world-record attempt in deterministic AI verification: exact-byte comparison and SHA-256 hashing, no AI in the loop.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed mt-2">
              <li>Ran 10,000 verbatim rows with every result an exact match and matching hashes</li>
              <li>Verified recall across five provider model catalogs (Z.AI, Anthropic, Qwen, OpenAI, Google), 440 rows, zero diffs</li>
              <li>Open-sourced the tool, tests, and methodology, recruited independent testers to run it, and published a video and public call to help set the record</li>
              <li>Cut token cost 99.49% by replacing AI judging with deterministic checks</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Creator, Continuum (formerly OneHub Panels)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Designed and built an agentic workspace where every app and AI runs live side by side as full browser panes on an infinite canvas, with a context-aware, screen-aware AI agent that sees what is open across the panes and can control the browsers. Free-form tiling in any number and shape, an infinite horizontal slider view, numbered panes, and tabs that drag and drop anywhere. Bundles all 170+ of my apps and ships with free AI. Launched with an early-adopter offer of unlimited free AI for life for the first 10 users.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Creator, Command OS (onecommand.dev)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-model architecture targeting context drift, hallucination, and memory decay. Benchmarked against a structured-decision model on 10 questions: 8 wins, 2 ties, 0 losses.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Creator, OneHub.Design</h3>
            <p className="text-sm text-muted-foreground mt-1">
              All-in-one AI platform, including product marketing and content.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Founder, 000 Labs</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Launched my own AI provider (000labs.xyz) to serve models directly instead of depending on the big labs.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Builder, Echo, Buyer Radar, and Screen-Aware Voice Assistant</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed mt-2">
              <li>Echo and Buyer Radar (a Facebook-focused app), part of a portfolio of 170+ apps, with one now built into Ubiquitous</li>
              <li>Multi-screen sharing app that lets you watch all of your screens at once</li>
              <li>Voice-to-voice assistant that watches your computer screen, always knows what is going on, and talks to you in real time</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Creator, Facebook Content Systems</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed mt-2">
              <li>Built content systems that generated 2.4 billion views on Facebook in a single month and over 5 billion in a year, across Facebook groups with 20 million members</li>
              <li>Ranked number two in the world among AI innovators on Facebook by Austin Armstrong</li>
              <li>Featured by Facebook as a global game changer for turning vision into a vibe</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Founder, MetaMasters: Zero to Everywhere</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed mt-2">
              <li>Ran a growth program for 1,000+ clients with a guarantee of 1 million views in 24 hours or your money back</li>
              <li>Honored the guarantee with zero refunds issued</li>
              <li>Every Student reached 1 Million views in 24 hours or less</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Creator, Multi-Agent Orchestration Platform</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed mt-2">
              <li>Built a visual front end for agent orchestration: one click spawns hundreds of agents at once that communicate with each other</li>
              <li>Supports deterministic agents, multiple servers, and Daytona sandboxes</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">White-Label Offers</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed mt-2">
              <li>App pack: about 50 of my apps, built and delivered white-label for the buyer, at $149</li>
              <li>000 Labs white label: a clone of my AI provider platform, built and branded for the client</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 border-b border-primary/30 pb-1">Work History</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
            <li>
              <strong>Software Engineer and Web Developer</strong><br />
              20 years of software engineering and web development, including 500+ custom builds over the years and 2,000 builds in 2026 alone.
            </li>
            <li>
              <strong>Cannabuds Thailand</strong><br />
              Set up automated ordering AI systems, 2022 to 2024.
            </li>
            <li>
              <strong>Family Contracting Business</strong><br />
              Managed the family contracting business.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 border-b border-primary/30 pb-1">Tools</h2>
          <p className="text-sm text-muted-foreground">
            JetBrains IDEs, Pycharm, Webstorm, Intelijideaopencode CLI, Azure, Daytona SDK, Composio, Mac and Windows environments
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-primary/30 pb-1">Links</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
            <li>GitHub: <a href="https://github.com/ryanjordan11/the-rock-benchmark" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">github.com/ryanjordan11/the-rock-benchmark</a></li>
            <li>YouTube: Ryan Jordan | Viral Engineer</li>
            <li>Multi-agent orchestration platform (live): <a href="https://dashboard-app-kappa-brown.vercel.app" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">dashboard-app-kappa-brown.vercel.app</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

const ProofView: FC = () => {
  return <div className="flex h-full items-center justify-center bg-[#1c1c1c]">Proof</div>;
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="aui-thread-scroll-to-bottom dark:border-border dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  const { assistant } = useBaseConfig();

  return (
    <div className="aui-thread-welcome-root mx-auto mb-6 flex w-full max-w-(--thread-max-width) flex-col items-center px-4 text-center">
      <h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-primary text-2xl font-semibold duration-200">
        {assistant.welcome.headline}
      </h1>
      {assistant.welcome.body && (
        <p className="text-muted-foreground mt-2 max-w-lg text-sm">
          {assistant.welcome.body}
        </p>
      )}
    </div>
  );
};

const suggestionIconMap: Record<
  BaseSuggestionIconId,
  FC<{ className?: string }>
> = {
  weather: CloudSunIcon,
  code: CodeXmlIcon,
  write: PencilLineIcon,
  analyze: ChartColumnIcon,
  brainstorm: LightbulbIcon,
  search: GlobeIcon,
  document: FileTextIcon,
  help: HelpCircleIcon,
};

const suggestionChipClass =
  "aui-thread-welcome-suggestion border-primary/35 bg-primary/5 text-foreground hover:bg-primary/15 hover:border-primary/60 h-auto gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-normal whitespace-nowrap transition-colors [&_svg]:size-4 [&_svg]:text-primary";

const ThreadSuggestions: FC = () => {
  const { assistant } = useBaseConfig();
  const aui = useAui();
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);
  const expandedGroup = assistant.suggestionGroups.find(
    (group) => group.label === expandedLabel,
  );

  const sendPrompt = (prompt: string) => {
    if (aui.thread().getState().isRunning) return;
    aui.thread().append({
      content: [{ type: "text", text: prompt }],
      runConfig: aui.composer().getState().runConfig,
    });
  };

  return (
    <div className="aui-thread-welcome-suggestions flex w-full flex-col gap-2 px-4">
      <div className="w-full scrollbar-none overflow-x-auto">
        <div className="mx-auto flex w-max items-center gap-2">
          {assistant.suggestionGroups.map((group) => {
            const Icon = suggestionIconMap[group.icon] ?? LightbulbIcon;
            return (
              <Button
                key={group.label}
                variant="ghost"
                className={cn(
                  suggestionChipClass,
                  group.label === expandedLabel &&
                    "border-primary/70 bg-primary/20",
                )}
                onClick={() =>
                  setExpandedLabel(
                    group.label === expandedLabel ? null : group.label,
                  )
                }
              >
                <Icon />
                {group.label}
              </Button>
            );
          })}
        </div>
      </div>
      {expandedGroup && (
        <div
          key={expandedGroup.label}
          className="fade-in slide-in-from-top-1 animate-in w-full scrollbar-none overflow-x-auto duration-200"
        >
          <div className="mx-auto flex w-max items-center gap-2">
            {expandedGroup.options.map((option) => (
              <Button
                key={option.label}
                variant="ghost"
                className={suggestionChipClass}
                onClick={() => sendPrompt(option.prompt)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const slashIconMap: Record<string, FC<{ className?: string }>> = {
  FileText: FileTextIcon,
  Languages: LanguagesIcon,
  Globe: GlobeIcon,
  HelpCircle: HelpCircleIcon,
};

function DirectiveChip(props: DirectiveChipProps) {
  const { directiveId, directiveType, label } = props;
  const showWrench = directiveType !== "command";
  return (
    <span
      className="aui-directive-chip"
      data-directive-type={directiveType}
      data-directive-id={directiveId}
    >
      {showWrench && (
        <span className="aui-directive-chip-icon">
          <WrenchIcon className="size-3" />
        </span>
      )}
      <span className="aui-directive-chip-label">{label}</span>
    </span>
  );
}

const Composer: FC = () => {
  const { assistant } = useBaseConfig();
  const mention = unstable_useMentionAdapter({ fallbackIcon: WrenchIcon });
  const slash = unstable_useSlashCommandAdapter({
    commands: assistant.slashCommands.map<Unstable_SlashCommand>((command) => ({
      id: command.id,
      description: command.description,
      icon: command.icon,
      execute: () => console.log(`[base example] /${command.id} invoked`),
    })),
    iconMap: slashIconMap,
    fallbackIcon: SlashIcon,
  });

  return (
    <ComposerPrimitive.Unstable_TriggerPopoverRoot>
      <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
        <ComposerPrimitive.AttachmentDropzone asChild>
          <div
            data-slot="aui_composer-shell"
            className="border-primary/25 data-[dragging=true]:border-ring focus-within:border-primary/60 dark:border-primary/25 dark:focus-within:border-primary/70 flex w-full flex-col gap-2 rounded-(--composer-radius) border bg-(--composer-bg) p-(--composer-padding) shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-within:shadow-[0_0_0_1px_var(--color-primary),0_8px_28px_-12px_var(--color-primary)] data-[dragging=true]:border-dashed data-[dragging=true]:bg-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-background))] dark:shadow-none"
          >
            <ComposerQuotePreview />
            <ComposerAttachments />
            <LexicalComposerInput
              directiveChip={DirectiveChip}
              placeholder={assistant.labels.composerPlaceholder}
              className="aui-composer-input [&_.aui-lexical-placeholder]:text-muted-foreground/80 relative max-h-32 min-h-10 w-full resize-none bg-transparent px-2.5 py-1 text-base outline-none [&_.aui-directive-chip]:inline-flex [&_.aui-directive-chip]:items-baseline [&_.aui-directive-chip]:gap-1 [&_.aui-directive-chip]:rounded-md [&_.aui-directive-chip]:bg-blue-100 [&_.aui-directive-chip]:px-1.5 [&_.aui-directive-chip]:py-0.5 [&_.aui-directive-chip]:text-[13px] [&_.aui-directive-chip]:leading-none [&_.aui-directive-chip]:font-medium [&_.aui-directive-chip]:text-blue-700 dark:[&_.aui-directive-chip]:bg-blue-900/50 dark:[&_.aui-directive-chip]:text-blue-300 [&_.aui-directive-chip-icon]:self-center [&_.aui-lexical-input]:min-h-lh [&_.aui-lexical-input]:outline-none [&_.aui-lexical-placeholder]:pointer-events-none [&_.aui-lexical-placeholder]:absolute [&_.aui-lexical-placeholder]:top-0 [&_.aui-lexical-placeholder]:right-0 [&_.aui-lexical-placeholder]:left-0 [&_.aui-lexical-placeholder]:truncate [&_.aui-lexical-placeholder]:px-2.5 [&_.aui-lexical-placeholder]:py-1"
            />
            <ComposerAction />
          </div>
        </ComposerPrimitive.AttachmentDropzone>

        <ComposerTriggerPopover char="@" {...mention} />

        <ComposerTriggerPopover
          char="/"
          {...slash}
          emptyItemsLabel="No matching commands"
        />
      </ComposerPrimitive.Root>
    </ComposerPrimitive.Unstable_TriggerPopoverRoot>
  );
};

const ComposerAction: FC = () => {
  return (
    <div className="aui-composer-action-wrapper relative flex items-center justify-between">
      <div className="flex items-center gap-1">
        <ComposerAddAttachment />
        <ModelPicker />
      </div>
      <div className="flex items-center gap-1.5">
        <AuiIf condition={(s) => s.thread.capabilities.dictation}>
          <AuiIf condition={(s) => s.composer.dictation == null}>
            <ComposerPrimitive.Dictate asChild>
              <TooltipIconButton
                tooltip="Voice input"
                side="bottom"
                type="button"
                variant="ghost"
                size="icon"
                className="aui-composer-dictate size-7 rounded-full"
                aria-label="Start voice input"
              >
                <MicIcon className="aui-composer-dictate-icon size-4" />
              </TooltipIconButton>
            </ComposerPrimitive.Dictate>
          </AuiIf>
          <AuiIf condition={(s) => s.composer.dictation != null}>
            <ComposerPrimitive.StopDictation asChild>
              <TooltipIconButton
                tooltip="Stop dictation"
                side="bottom"
                type="button"
                variant="ghost"
                size="icon"
                className="aui-composer-stop-dictation text-destructive size-7 rounded-full"
                aria-label="Stop voice input"
              >
                <SquareIcon className="aui-composer-stop-dictation-icon size-3.5 animate-pulse fill-current" />
              </TooltipIconButton>
            </ComposerPrimitive.StopDictation>
          </AuiIf>
        </AuiIf>
        <AuiIf condition={(s) => !s.thread.isRunning}>
          <ComposerPrimitive.Send asChild>
            <TooltipIconButton
              tooltip="Send message"
              side="bottom"
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-send size-7 rounded-full"
              aria-label="Send message"
            >
              <ArrowUpIcon className="aui-composer-send-icon size-4.5" />
            </TooltipIconButton>
          </ComposerPrimitive.Send>
        </AuiIf>
        <AuiIf condition={(s) => s.thread.isRunning}>
          <ComposerPrimitive.Cancel asChild>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-cancel size-7 rounded-full"
              aria-label="Stop generating"
            >
              <SquareIcon className="aui-composer-cancel-icon size-3.5 fill-current" />
            </Button>
          </ComposerPrimitive.Cancel>
        </AuiIf>
      </div>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root border-destructive bg-destructive/10 text-destructive dark:bg-destructive/5 mt-2 rounded-md border p-3 text-sm dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantWorkingIndicator: FC = () => {
  const isEmpty = useAuiState((s) => s.message.content.length === 0);
  if (isEmpty) {
    return (
      <span
        data-slot="aui_assistant-message-indicator"
        className="text-muted-foreground inline-flex items-center gap-2 align-middle"
      >
        <DotMatrix state="connecting" aria-hidden />
        <span className="text-sm">Connecting</span>
      </span>
    );
  }
  return (
    <span
      data-slot="aui_assistant-message-indicator"
      className="animate-pulse font-sans"
      aria-label="Assistant is working"
    >
      {"●"}
    </span>
  );
};

const AssistantMessage: FC = () => {
  // reserves space for action bar and compensates with `-mb` for consistent msg spacing
  // keeps hovered action bar from shifting layout (autohide doesn't support absolute positioning well)
  // for pt-[n] use -mb-[n + 6] & min-h-[n + 6] to preserve compensation
  const ACTION_BAR_PT = "pt-1.5";
  const ACTION_BAR_HEIGHT = `-mb-7.5 min-h-7.5 ${ACTION_BAR_PT}`;

  return (
    <MessagePrimitive.Root
      data-slot="aui_assistant-message-root"
      data-role="assistant"
      className="fade-in slide-in-from-bottom-1 animate-in relative mx-auto w-full max-w-(--thread-max-width) duration-150"
    >
      <div
        data-slot="aui_assistant-message-content"
        className="text-foreground px-2 leading-relaxed wrap-break-word"
      >
        <MessagePrimitive.GroupedParts
          groupBy={groupPartByType({
            reasoning: ["group-chainOfThought", "group-reasoning"],
            "tool-call": ["group-chainOfThought", "group-tool"],
            "standalone-tool-call": [],
          })}
        >
          {({ part, children }) => {
            switch (part.type) {
              case "group-chainOfThought":
                return <div data-slot="aui_chain-of-thought">{children}</div>;
              case "group-tool":
                return (
                  <ToolGroupRoot variant="ghost">
                    <ToolGroupTrigger
                      count={part.indices.length}
                      active={part.status.type === "running"}
                    />
                    <ToolGroupContent>{children}</ToolGroupContent>
                  </ToolGroupRoot>
                );
              case "group-reasoning": {
                const running = part.status.type === "running";
                return (
                  <ReasoningRoot streaming={running}>
                    <ReasoningTrigger active={running} />
                    <ReasoningContent aria-busy={running}>
                      <ReasoningText>{children}</ReasoningText>
                    </ReasoningContent>
                  </ReasoningRoot>
                );
              }
              case "text":
                return <MarkdownText />;
              case "reasoning":
                return <Reasoning {...part} />;
              case "tool-call":
                return part.toolUI ?? <ToolFallback {...part} />;
              case "indicator":
                return <AssistantWorkingIndicator />;
              case "data":
                return part.dataRendererUI;
              default:
                return null;
            }
          }}
        </MessagePrimitive.GroupedParts>
        <MessageError />
      </div>

      <div
        data-slot="aui_assistant-message-footer"
        className={cn("ml-2 flex items-center", ACTION_BAR_HEIGHT)}
      >
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-assistant-action-bar-root text-muted-foreground animate-in fade-in col-start-3 row-start-2 -ml-1 flex gap-1 duration-200"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <AuiIf condition={(s) => s.message.isCopied}>
            <CheckIcon className="animate-in zoom-in-50 fade-in duration-200 ease-out" />
          </AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}>
            <CopyIcon className="animate-in zoom-in-75 fade-in duration-150" />
          </AuiIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
      <ActionBarMorePrimitive.Root>
        <ActionBarMorePrimitive.Trigger asChild>
          <TooltipIconButton
            tooltip="More"
            className="data-[state=open]:bg-accent"
          >
            <MoreHorizontalIcon />
          </TooltipIconButton>
        </ActionBarMorePrimitive.Trigger>
        <ActionBarMorePrimitive.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="aui-action-bar-more-content bg-popover/95 text-popover-foreground data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-xl border p-1.5 shadow-lg backdrop-blur-sm"
        >
          <ActionBarPrimitive.ExportMarkdown asChild>
            <ActionBarMorePrimitive.Item className="aui-action-bar-more-item hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none">
              <DownloadIcon className="size-4" />
              Export as Markdown
            </ActionBarMorePrimitive.Item>
          </ActionBarPrimitive.ExportMarkdown>
        </ActionBarMorePrimitive.Content>
      </ActionBarMorePrimitive.Root>
      <MessageTiming />
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_user-message-root"
      data-role="user"
      className="fade-in slide-in-from-bottom-1 animate-in mx-auto grid w-full max-w-(--thread-max-width) auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&:where(>*)]:col-start-2"
    >
      <UserMessageAttachments />

      <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
        <div className="aui-user-message-content peer bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word empty:hidden">
          <MessagePrimitive.Quote>
            {(quote) => <QuoteBlock {...quote} />}
          </MessagePrimitive.Quote>
          <MessagePrimitive.Parts components={{ Text: DirectiveText }} />
        </div>
        <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2 peer-empty:hidden">
          <UserActionBar />
        </div>
      </div>

      <BranchPicker
        data-slot="aui_user-branch-picker"
        className="col-span-full col-start-1 row-start-3 -mr-1 justify-end"
      />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit" className="aui-user-action-edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_edit-composer-wrapper"
      className="mx-auto flex w-full max-w-(--thread-max-width) flex-col px-2"
    >
      <ComposerPrimitive.Unstable_TriggerPopoverRoot>
        <ComposerPrimitive.Root className="aui-edit-composer-root border-border/60 dark:border-muted-foreground/15 ml-auto flex w-full max-w-[85%] flex-col rounded-(--composer-radius) border bg-(--composer-bg) shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none">
          <LexicalComposerInput
            directiveChip={DirectiveChip}
            autoFocus
            className="aui-edit-composer-input text-foreground min-h-14 w-full resize-none bg-transparent px-4 pt-3 pb-1 text-base outline-none [&_.aui-directive-chip]:inline-flex [&_.aui-directive-chip]:items-baseline [&_.aui-directive-chip]:gap-1 [&_.aui-directive-chip]:rounded-md [&_.aui-directive-chip]:bg-blue-100 [&_.aui-directive-chip]:px-1.5 [&_.aui-directive-chip]:py-0.5 [&_.aui-directive-chip]:text-[13px] [&_.aui-directive-chip]:leading-none [&_.aui-directive-chip]:font-medium [&_.aui-directive-chip]:text-blue-700 dark:[&_.aui-directive-chip]:bg-blue-900/50 dark:[&_.aui-directive-chip]:text-blue-300 [&_.aui-directive-chip-icon]:self-center [&_.aui-lexical-input]:min-h-lh [&_.aui-lexical-input]:outline-none"
          />
          <div className="aui-edit-composer-footer mx-2.5 mb-2.5 flex items-center gap-1.5 self-end">
            <ComposerPrimitive.Cancel asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3.5"
              >
                Cancel
              </Button>
            </ComposerPrimitive.Cancel>
            <ComposerPrimitive.Send asChild>
              <Button size="sm" className="h-8 rounded-full px-3.5">
                Update
              </Button>
            </ComposerPrimitive.Send>
          </div>
        </ComposerPrimitive.Root>
      </ComposerPrimitive.Unstable_TriggerPopoverRoot>
    </MessagePrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root text-muted-foreground mr-2 -ml-2 inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

export const Base: FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState<"chat" | "home" | "about" | "projects" | "resume" | "proof" | "contact">("home");

  return (
    <div className="flex h-full w-full bg-black">
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onHome={() => setActiveView("home")}
          onAbout={() => setActiveView("about")}
          onChat={() => setActiveView("chat")}
          onProjects={() => setActiveView("projects")}
          onResume={() => setActiveView("resume")}
          onProof={() => setActiveView("proof")}
          onContact={() => setActiveView("contact")}
          aboutActive={activeView === "about"}
          activeView={activeView}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="bg-background flex flex-1 flex-col overflow-hidden rounded-lg border border-primary/20 shadow-lg shadow-white/20">
          <Header
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeView={activeView}
          />
          <main className="flex-1 overflow-hidden">
            {activeView === "about" ? <AboutView /> : activeView === "projects" ? <ProjectsView /> : activeView === "resume" ? <ResumeView /> : activeView === "proof" ? <ProofView /> : activeView === "contact" ? <ContactView /> : activeView === "home" ? <HomeView /> : <Thread />}
          </main>
        </div>
      </div>
    </div>
  );
};
