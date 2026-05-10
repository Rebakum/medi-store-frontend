"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/navbar"), {
  ssr: false,
  loading: () => <div className="h-16 border-b" />, 
});

export default function NavbarClient() {
  return <Navbar />;
}
