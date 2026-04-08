"use client";


import RealtimeDebugOverlay from "@/components/common/RealtimeDebugOverlay";
import SocketBridge from "@/components/common/SocketBridge";
import NavbarClient from "@/components/shared/NavbarClient";
import Topbar from "@/components/shared/Topbar";
import Footer from "@/components/shared/footer";


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar/>
      <NavbarClient />
        <RealtimeDebugOverlay />
   
          {children}
    
      <Footer />
    </>
  );
}
