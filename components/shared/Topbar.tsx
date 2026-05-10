"use client";

import Link from "next/link";
import { Mail, Phone, Facebook, Instagram, Twitter, ShoppingCart } from "lucide-react";
import useAuth from "@/components/hooks/useAuth";
import useCart from "@/features/cart/useCart";
import RealtimeStatus from "../common/RealtimeDebugOverlay";



function getCartPath(role?: string) {
  if (role === "CUSTOMER") return "/dashboard/customer/cart";
  return "/shop";
}

export default function Topbar() {
  const { user } = useAuth();
  const cartHref = getCartPath(user?.role);
 const { count } = useCart();


  return (
    <div className="w-full border-b bg-sky-50/70 dark:bg-white/5 dark:border-white/10">
      <div className="flex items-center justify-between px-4 py-2 mx-auto text-xs max-w-7xl text-slate-600 dark:text-slate-300">
   
        {/* left */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-[#2EB0D9]" />
            support@medistore.com
          </span>

          <span className="items-center hidden gap-2 md:inline-flex">
            <Phone className="h-3.5 w-3.5 text-[#2EB0D9]" />
            +880 1234-567890
          </span>
        </div>

        {/* right - SOCIAL LINKS */}
        <div className="flex items-center gap-3">
             {/* Optional Cart */}
          <Link href={cartHref} className="relative ml-2 transition hover:text-[#2EB0D9]">
            <ShoppingCart className="w-4 h-4" />

            {count > 0 && (
              <span className="absolute -top-2 -right-2 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#2EB0D9] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          
          <Link
            href="https://facebook.com"
            target="_blank"
            className="transition hover:text-[#2EB0D9]"
          >
            <Facebook className="w-4 h-4" />
          </Link>

          <Link
            href="https://instagram.com"
            target="_blank"
            className="transition hover:text-[#2EB0D9]"
          >
            <Instagram className="w-4 h-4" />
          </Link>

          <Link
            href="https://twitter.com"
            target="_blank"
            className="transition hover:text-[#2EB0D9]"
          >
            <Twitter className="w-4 h-4" />
          </Link>

          

        </div>
      </div>
    </div>
  );
}
