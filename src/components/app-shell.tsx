import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Route as RouteIcon, BookA, PenLine, BarChart3, Settings, LifeBuoy,
  PanelLeftClose, Blocks, PanelLeftOpen, Menu, ChevronDown, UserRound, Hand, Globe, Copy, Type, Ban, HelpCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAIN = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/path", label: "Learning Path", icon: RouteIcon },
  { to: "/verbs", label: "Verbs", icon: BookA },
  { to: "/sentences", label: "Sentences", icon: Blocks },
  { to: "/greetings", label: "Greetings", icon: Hand },
  { to: "/nationalities", label: "Nationalities", icon: Globe },
  { to: "/plurals", label: "Plurals", icon: Copy },
  { to: "/articles", label: "Articles", icon: Type },
  { to: "/negatives", label: "Negatives", icon: Ban },
  { to: "/questions", label: "Questions", icon: HelpCircle },
  { to: "/practice", label: "Practice", icon: PenLine },
  { to: "/progress", label: "Progress", icon: BarChart3 },
] as const;
const LOWER = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: LifeBuoy },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg" aria-label="Parlami home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-cta text-sm font-bold text-primary-foreground">P</span>
      {!compact && <span className="text-lg font-bold tracking-tight text-foreground">Parlami</span>}
    </Link>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const item = (n: (typeof MAIN)[number] | (typeof LOWER)[number]) => {
    const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
    const Icon = n.icon;
    return (
      <li key={n.to}>
        <Link
          to={n.to}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          title={collapsed ? n.label : undefined}
          className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors ${
            active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Icon className="h-5 w-5 shrink-0" aria-hidden />
          {collapsed ? <span className="sr-only">{n.label}</span> : n.label}
        </Link>
      </li>
    );
  };
  return (
    <nav aria-label="Main" className="flex h-full flex-col">
      <ul className="space-y-1">{MAIN.map(item)}</ul>
      <ul className="mt-auto space-y-1 border-t pt-4">{LOWER.map(item)}</ul>
    </nav>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex min-h-10 items-center gap-2 rounded-xl border bg-card px-2 py-1.5 text-sm font-medium hover:bg-muted">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-tile-lavender text-tile-lavender-ink"><UserRound className="h-4 w-4" aria-hidden /></span>
        <span className="hidden sm:inline">Guest learner</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="font-semibold text-foreground">Guest learner</div>
          <div className="text-xs text-muted-foreground">No account yet — progress is saved in this browser only.</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/progress">My progress</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/help">Help</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { setCollapsed(localStorage.getItem("parlami.sidebar") === "1"); }, []);
  const toggle = () => setCollapsed((c) => { localStorage.setItem("parlami.sidebar", c ? "0" : "1"); return !c; });

  return (
    <div className="min-h-screen bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2">Skip to content</a>
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r bg-card px-3 py-4 transition-[width] lg:flex ${collapsed ? "w-[76px]" : "w-64"}`}>
        <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
          {!collapsed && <Logo />}
          <button onClick={toggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>
        <NavList collapsed={collapsed} />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex w-72 flex-col bg-card p-4">
          <SheetHeader className="mb-4 p-0 text-left"><SheetTitle className="sr-only">Navigation</SheetTitle><Logo /></SheetHeader>
          <NavList collapsed={false} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className={`transition-[padding] ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setOpen(true)} aria-label="Open navigation" className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted lg:hidden"><Menu className="h-5 w-5" /></button>
          <div className="lg:hidden max-sm:[header:has(#header-slot:not(:empty))_&]:hidden"><Logo /></div>
          <div id="header-slot" className="flex min-w-0 flex-1 justify-center" />
          <div className="shrink-0"><ProfileMenu /></div>
        </header>
        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

/** Shared page heading */
export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

const TILE = {
  blue: "bg-tile-blue text-tile-blue-ink",
  pink: "bg-tile-pink text-tile-pink-ink",
  lavender: "bg-tile-lavender text-tile-lavender-ink",
  green: "bg-tile-green text-tile-green-ink",
  amber: "bg-tile-amber text-tile-amber-ink",
} as const;
export type TileColor = keyof typeof TILE;
export function IconTile({ icon: Icon, color = "blue", size = "md" }: { icon: React.ComponentType<{ className?: string }>; color?: TileColor; size?: "sm" | "md" }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-xl ${TILE[color]} ${size === "sm" ? "h-9 w-9" : "h-11 w-11"}`} aria-hidden>
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </span>
  );
}

export function Panel({ className = "", children }: { className?: string; children: ReactNode }) {
  return <section className={`rounded-[20px] border bg-card p-5 shadow-card sm:p-6 ${className}`}>{children}</section>;
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export const btn = {
  primary: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
  cta: "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-cta px-6 text-[15px] font-semibold text-primary-foreground shadow-cta hover:opacity-95",
  outline: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-card px-5 text-[15px] font-semibold text-foreground hover:bg-muted",
  ghost: "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
};

export function Chip({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} aria-label={label}
      className={`min-h-9 rounded-lg border px-3 text-sm font-semibold transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
      {children}
    </button>
  );
}
