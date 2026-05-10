"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/components/hooks/useAuth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, User, Users, ClipboardList, Package, Layers, MessageSquareText, ShoppingCart, Menu, BadgeCheck, LayoutDashboard, LogOut } from "lucide-react";

type Role = "ADMIN" | "SELLER" | "CUSTOMER";
type Item = { label: string; href: string; icon: React.ReactNode };

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function buildAssetUrl(raw?: string | null) {
  if (!raw) return "";
  const v = raw.trim();
  if (!v) return "";
  if (v.startsWith("http")) return v;
  if (v.startsWith("/")) return v;
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "";
  const b = base.replace(/\/+$/, "");
  const p = v.replace(/^\/+/, "");
  return b ? `${b}/${p}` : `/${p}`;
}

function SidebarLink({ item, onClick }: { item: Item; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname?.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50"
      )}
    >
      <span className={cn(
        "grid h-10 w-10 rounded-xl place-items-center transition-all",
        active ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"
      )}>
        {item.icon}
      </span>
      <span>{item.label}</span>
      {active && (
        <span className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse" />
      )}
    </Link>
  );
}

function build(role?: Role) {
  const base: Item[] = [
    { label: "My Profile", href: "/dashboard/profile", icon: <User className="w-5 h-5" /> },
  ];

  if (role === "ADMIN") {
    return {
      top: base,
      main: [
        { label: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Users", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5" /> },
        { label: "Orders", href: "/dashboard/admin/orders", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Medicines", href: "/dashboard/admin/medicines", icon: <Package className="w-5 h-5" /> },
        { label: "Categories", href: "/dashboard/admin/categories", icon: <Layers className="w-5 h-5" /> },
        { label: "Reviews", href: "/dashboard/admin/reviews", icon: <MessageSquareText className="w-5 h-5" /> },
        { label: "Brand Logo", href: "/dashboard/admin/logo_brand", icon: <BadgeCheck className="w-5 h-5" /> },
      ],
    };
  }

  if (role === "SELLER") {
    return {
      top: base,
      main: [
        { label: "Overview", href: "/dashboard/seller", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Medicines", href: "/dashboard/seller/medicines", icon: <Package className="w-5 h-5" /> },
        { label: "Orders", href: "/dashboard/seller/orders", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Reviews", href: "/dashboard/seller/reviews", icon: <MessageSquareText className="w-5 h-5" /> },
        { label: "Brand Logo", href: "/dashboard/seller/brandLogo", icon: <BadgeCheck className="w-5 h-5" /> },
      ],
    };
  }

  if (role === "CUSTOMER") {
    return {
      top: base,
      main: [
        { label: "Cart", href: "/dashboard/customer/cart", icon: <ShoppingCart className="w-5 h-5" /> },
        { label: "Orders", href: "/dashboard/customer/orders", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "My Reviews", href: "/dashboard/customer/reviews", icon: <MessageSquareText className="w-5 h-5" /> },
      ],
    };
  }

  return {
    top: [{ label: "Home", href: "/", icon: <Home className="w-5 h-5" /> }],
    main: [],
  };
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "MediStore";
  const brandTagline = process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? "Medical & Healthcare";
  const logoUrl = buildAssetUrl(process.env.NEXT_PUBLIC_BRAND_LOGO ?? "/logo.png");
  const menu = build(user?.role as Role | undefined);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 p-[2px] shadow-lg shadow-cyan-500/30">
            <div className="h-full w-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={logoUrl}
                alt={brandName}
                className="object-contain w-full h-full p-2"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/logo.png"; }}
              />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              {brandName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{brandTagline}</div>
          </div>
        </Link>
      </div>

      <div className="px-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-slate-800/50 dark:to-slate-800/50 border border-cyan-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "User"}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
          </div>
          {user?.role && (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
              {user.role}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pt-6">
        <Separator className="bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Account</div>
          <div className="space-y-1">
            {menu.top.map((it) => (
              <SidebarLink key={it.href} item={it} onClick={onNavigate} />
            ))}
          </div>
        </div>

        {menu.main.length > 0 && (
          <div>
            <div className="px-3 mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Menu</div>
            <div className="space-y-1">
              {menu.main.map((it) => (
                <SidebarLink key={it.href} item={it} onClick={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-100 dark:border-red-900/30">
          <button
            onClick={() => logout?.()}
            className="flex items-center gap-3 w-full text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <span className="grid h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 place-items-center">
              <LogOut className="w-5 h-5" />
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <aside className="hidden h-screen bg-white border-r border-slate-200 dark:border-slate-800 lg:block w-72 dark:bg-slate-950">
        <SidebarBody />
      </aside>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[320px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
