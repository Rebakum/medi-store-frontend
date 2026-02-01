import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          MediStore
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((l) => (
                <NavigationMenuItem key={l.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={l.href}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      {l.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                {/* simple hamburger icon (no extra lib) */}
                <span className="text-xl leading-none">≡</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {l.label}
                  </Link>
                ))}

                <Button className="mt-3" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
