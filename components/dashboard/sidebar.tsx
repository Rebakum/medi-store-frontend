"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

// shadcn
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// icons
import {
  Home,
  User,
  Users,
  ClipboardList,
  Package,
  Layers,
  MessageSquareText,
  ShoppingCart,
  Menu,
  BadgeCheck, 
} from "lucide-react";

type Role = "ADMIN" | "SELLER" | "CUSTOMER";
type Item = { label: string; href: string; icon: React.ReactNode };

const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

function buildAssetUrl(raw?: string | null) {
  if (!raw) return "";
  const v = raw.trim();
  if (!v) return "";
  if (v.startsWith("http")) return v;

  // public file হলে (/logo.png) 그대로 use হবে
  if (v.startsWith("/")) return v;

  // fallback for server assets
  const base =
    process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "";

  const b = base.replace(/\/+$/, "");
  const p = v.replace(/^\/+/, "");
  return b ? `${b}/${p}` : `/${p}`;
}

function SidebarLink({
  item,
  onClick,
}: {
  item: Item;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname?.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
       active &&
  "bg-[#2EB0D9]/10 dark:bg-[#2EB0D9]/20 text-[#2EB0D9] border border-[#2EB0D9]/20"

      )}
    >
      {/* active bar */}
      <span
        className={cn(
          "absolute left-0 top-2 bottom-2 w-[3px] rounded-full opacity-0 transition",
          active && "opacity-100"
        )}
        style={{
         background:
  "linear-gradient(180deg,#2EB0D9 0%, #38CAE4 100%)",

        }}
      />

      <span className="grid bg-white border rounded-lg place-items-center h-9 w-9 dark:bg-white/5 dark:border-white/10">
        {item.icon}
      </span>

      <span className="font-medium">{item.label}</span>
    </Link>
  );
}

function build(role?: Role) {
  const base: Item[] = [
    
    {
      label: "My Profile",
      href: "/dashboard/profile",
      icon: <User className="w-4 h-4" />,
    },
  ];

  if (role === "ADMIN") {
    return {
      top: base,
      main: [
        { label: "Admin Home", href: "/dashboard/admin", icon: <Home className="w-4 h-4" /> },
        { label: "Users", href: "/dashboard/admin/users", icon: <Users className="w-4 h-4" /> },
        { label: "Orders", href: "/dashboard/admin/orders", icon: <ClipboardList className="w-4 h-4" /> },
        { label: "Medicines", href: "/dashboard/admin/medicines", icon: <Package className="w-4 h-4" /> },
        { label: "Categories", href: "/dashboard/admin/categories", icon: <Layers className="w-4 h-4" /> },
        { label: "Reviews", href: "/dashboard/admin/reviews", icon: <MessageSquareText className="w-4 h-4" /> },

        //  FIX: icon added
        { label: "Brand Logo", href: "/dashboard/admin/logo_brand", icon: <BadgeCheck className="w-4 h-4" /> },
      ],
    };
  }

  if (role === "SELLER") {
    return {
      top: base,
      main: [
        { label: "Seller Home", href: "/dashboard/seller", icon: <Home className="w-4 h-4" /> },
        { label: "Medicines", href: "/dashboard/seller/medicines", icon: <Package className="w-4 h-4" /> },
        { label: "Orders", href: "/dashboard/seller/orders", icon: <ClipboardList className="w-4 h-4" /> },
        { label: "Reviews", href: "/dashboard/seller/reviews", icon: <MessageSquareText className="w-4 h-4" /> },
        { label: "Brand Logo", href: "/dashboard/seller/brandLogo", icon: <BadgeCheck className="w-4 h-4" /> },

      ],
    };
  }

  if (role === "CUSTOMER") {
    return {
      top: base,
      main: [
       
        { label: "Cart", href: "/dashboard/customer/cart", icon: <ShoppingCart className="w-4 h-4" /> },
        { label: "Orders", href: "/dashboard/customer/orders", icon: <ClipboardList className="w-4 h-4" /> },
        { label: "My Reviews", href: "/dashboard/customer/reviews", icon: <MessageSquareText className="w-4 h-4" /> },
      ],
    };
  }

  return {
    top: [{ label: "Home", href: "/", icon: <Home className="w-4 h-4" /> }],
    main: [],
  };
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();

  //  dynamic logo from env or fallback
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "MediStore";
  const brandTagline = process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? "Medical & Healthcare";
  const logoUrl = buildAssetUrl(process.env.NEXT_PUBLIC_BRAND_LOGO ?? "/logo.png");

  const menu = build(user?.role as Role | undefined);

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="px-4 pt-4 pb-3">
        {/*  LOGO row */}
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-[#2EB0D9]/10 ring-1 ring-sky-100 dark:ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={brandName}
              className="object-contain w-full h-full p-1"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/logo.png";
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {brandName}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {brandTagline}
            </div>
          </div>
        </Link>

        <div className="flex items-start justify-between gap-3 mt-4">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              Dashboard
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
              {user?.email ?? "Signed in"}
            </div>
          </div>

          {user?.role ? (
            <span className="text-[11px] px-2 py-1 rounded-full border bg-white dark:bg-white/5 dark:border-white/10">
              {user.role}
            </span>
          ) : null}
        </div>
      </div>

      <div className="px-4">
        <Separator />
      </div>

      {/* links */}
      <div className="px-3 py-3 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {menu.top.map((it) => (
            <SidebarLink key={it.href} item={it} onClick={onNavigate} />
          ))}
        </div>

        {menu.main.length ? (
          <>
            <div className="px-2 pt-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Menu
            </div>
            <div className="space-y-1">
              {menu.main.map((it) => (
                <SidebarLink key={it.href} item={it} onClick={onNavigate} />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* footer */}
      <div className="px-4 pb-4 mt-auto">
        <div className="p-3 text-xs border rounded-2xl bg-white/70 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-300">
          Tip: Active item highlight shows where you are.
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen bg-white border-r lg:block w-72 dark:bg-slate-950 dark:border-white/10">
        <SidebarBody />
      </aside>

      {/* Mobile: floating menu button + sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              className="fixed z-40 rounded-full shadow-lg bottom-4 right-4"
              style={{
                background:
                  "linear-gradient(90deg,#ff8a05 0%, #ff5478 45%, #ff00c6 100%)",
              }}
            >
              <Menu className="w-4 h-4 mr-2" />
              Menu
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-0 w-[300px]">
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
