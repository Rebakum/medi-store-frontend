"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../common/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/components/hooks/useAuth";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "MediStore";
  const brandTagline =
    process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? "Medical & Healthcare";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b shadow-sm bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">

      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">

        {/* BRAND */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-[#2EB0D9]/10 flex items-center justify-center font-bold text-[#2EB0D9] group-hover:scale-105 transition">
            M
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {brandName}
            </p>
            <p className="text-[11px] text-slate-500">
              {brandTagline}
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="items-center hidden gap-6 md:flex">

          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">

              {navLinks.map((l) => {
                const active = isActive(l.href);

                return (
                  <NavigationMenuItem key={l.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={l.href}
                        className={cn(
                          "relative px-3 py-2 text-sm font-medium rounded-lg transition",
                          "hover:text-[#2EB0D9]",
                          active && "text-[#2EB0D9]"
                        )}
                      >
                        {l.label}

                        {/* underline animation */}
                        <span
                          className={cn(
                            "absolute left-2 right-2 -bottom-1 h-[2px] bg-[#2EB0D9] rounded-full scale-x-0 transition",
                            active && "scale-x-100"
                          )}
                        />
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeToggle />

          {/* AUTH */}
          {!user ? (
            <Button asChild className="bg-[#2EB0D9] hover:bg-[#38CAE4] text-white rounded-xl">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center transition rounded-full h-9 w-9  bg-white/70 dark:bg-white/10 hover:scale-105">
                  {user.name?.[0] ?? "U"}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 bg-[#2EB0D9] hover:bg-[#38CAE4] text-white rounded-xl">

                <DropdownMenuLabel>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => logout?.()}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent className="w-80">

              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2 mt-6">

                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm transition",
                      "hover:bg-sky-50 hover:text-[#2EB0D9]",
                      isActive(l.href) && "bg-sky-50 text-[#2EB0D9]"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}

                <div className="h-px my-2 bg-gray-200" />

                {!user ? (
                  <Button asChild className="bg-[#2EB0D9] text-white">
                    <Link href="/login">Login</Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => logout?.()}
                    className="text-red-600"
                  >
                    Logout
                  </Button>
                )}

              </div>

            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}