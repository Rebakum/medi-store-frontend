import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#1f1f1f] text-white/80 overflow-hidden">

      {/* top glow */}
      <div className="h-1 bg-gradient-to-r from-[#2EB0D9] via-[#38CAE4] to-sky-500" />

      {/* background glow blur */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2EB0D9]/10 blur-[120px]" />

      <div className="relative grid gap-12 px-6 py-16 mx-auto max-w-7xl md:grid-cols-4">

        {/* BRAND */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-wide text-white">
            Medi<span className="text-[#38CAE4]">Store</span>
          </h3>

          <p className="text-sm leading-relaxed text-white/60">
            Your trusted medical shop for medicines, devices, and healthcare essentials.
          </p>

          <div className="pt-2 space-y-3 text-sm">

            <div className="flex items-center gap-3 group">
              <Mail className="h-4 w-4 text-[#38CAE4] group-hover:scale-110 transition" />
              <span className="transition group-hover:text-white">
                support@medistore.com
              </span>
            </div>

            <div className="flex items-center gap-3 group">
              <Phone className="h-4 w-4 text-[#38CAE4] group-hover:scale-110 transition" />
              <span className="transition group-hover:text-white">
                +880 1234-567890
              </span>
            </div>

            <div className="flex items-center gap-3 group">
              <MapPin className="h-4 w-4 text-[#38CAE4] group-hover:scale-110 transition" />
              <span className="transition group-hover:text-white">
                Dhaka, Bangladesh
              </span>
            </div>

          </div>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><FooterLink href="/">Home</FooterLink></li>
            <li><FooterLink href="/shop">Shop</FooterLink></li>
            <li><FooterLink href="/categories">Categories</FooterLink></li>
            <li><FooterLink href="/contact">Contact</FooterLink></li>
          </ul>
        </div>

        {/* CUSTOMER */}
        <div>
          <h4 className="mb-4 font-semibold text-white">Customer</h4>
          <ul className="space-y-3 text-sm">
            <li><FooterLink href="/dashboard/customer">Dashboard</FooterLink></li>
            <li><FooterLink href="/dashboard/customer/orders">Orders</FooterLink></li>
            <li><FooterLink href="/dashboard/customer/cart">Cart</FooterLink></li>
            <li><FooterLink href="/faq">FAQ</FooterLink></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Newsletter</h4>

          <p className="text-sm text-white/60">
            Get updates, offers & health tips.
          </p>

          <form className="flex flex-col gap-2 sm:flex-row">
            <input
              placeholder="Your email"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#2EB0D9]/40 transition"
            />

            <button
              type="button"
              className="rounded-xl bg-[#2EB0D9] px-5 py-2 text-sm font-semibold text-white
                         hover:bg-[#38CAE4] hover:scale-105 transition"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="flex flex-col gap-2 px-6 py-6 mx-auto text-xs max-w-7xl text-white/50 sm:flex-row sm:items-center sm:justify-between">

          <p className="transition hover:text-white">
            © {new Date().getFullYear()} MediStore. All rights reserved.
          </p>

          <div className="flex gap-5">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </div>

        </div>
      </div>
    </footer>
  );
}

/* LINK COMPONENT */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative text-white/60 hover:text-[#38CAE4] transition group"
    >
      <span>{children}</span>

      {/* underline animation */}
      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#38CAE4] group-hover:w-full transition-all duration-300" />
    </Link>
  );
}