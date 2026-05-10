"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AdminStats } from "@/lib/admin-dashboard";

const money = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function PiChatCard({ stats, loading }: { stats: AdminStats | null; loading: boolean }) {
  const pct = stats?.revenue.changePct ?? 0;
  const trend = pct > 0 ? `+${pct}%` : pct < 0 ? `${pct}%` : "0%";

  const messages = !stats
    ? []
    : [
        {
          side: "left" as const,
          title: "PI",
          lines: [
            `Today orders: ${stats.orders.today}. Pending: ${stats.orders.pending}, Processing: ${stats.orders.processing}.`,
            stats.orders.pending > 0 ? "Suggestion: Process pending orders first." : "No pending bottleneck today.",
          ],
          href: "/dashboard/admin/orders",
        },
        {
          side: "right" as const,
          title: "PI",
          lines: [
            `Low stock medicines: ${stats.medicines.lowStock} (≤${stats.medicines.lowStockThreshold}).`,
            stats.medicines.lowStock > 0 ? "Suggestion: Restock low items." : "Stock looks healthy.",
          ],
          href: "/dashboard/admin/medicines",
        },
        {
          side: "left" as const,
          title: "PI",
          lines: [`Revenue today: ${money(stats.revenue.today)}.`, `This month: ${money(stats.revenue.thisMonth)} (${trend}).`],
        },
      ];

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">PI Chat</CardTitle>
          <Badge variant="outline" className="rounded-xl">
            {loading ? "Loading…" : "Online"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-w-3xl mx-auto">
          <div className="p-4 space-y-3 border rounded-2xl bg-muted/30">
            {loading ? (
              <ChatSkeleton />
            ) : !stats ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">No data found.</div>
            ) : (
              <>
                <TypingLine />
                <Separator />
                {messages.map((m, i) => (
                  <ChatBubble key={i} {...m} />
                ))}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TypingLine() {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
      <span className="relative inline-flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full animate-ping bg-slate-400 opacity-60" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-slate-500" />
      </span>
      <span>PI is generating insights…</span>
    </div>
  );
}

function ChatBubble({
  side,
  title,
  lines,
  href,
}: {
  side: "left" | "right";
  title: string;
  lines: string[];
  href?: string;
}) {
  const isRight = side === "right";
  const bubble = (
    <div
      className={[
        "max-w-[560px] w-full sm:w-auto",
        "rounded-2xl border px-4 py-3",
        "transition hover:shadow-sm",
        isRight ? "border-transparent text-white" : "bg-background border-border",
      ].join(" ")}
      style={
        isRight
          ? { background: "linear-gradient(90deg,#ff8a05 0%, #ff5478 45%, #ff00c6 100%)" }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`text-xs font-semibold ${isRight ? "text-white/95" : ""}`}>{title}</div>
        <div className={`text-[10px] ${isRight ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
          Just now
        </div>
      </div>

      <div className={`mt-2 space-y-1 text-sm ${isRight ? "text-white" : ""}`}>
        {lines.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>

      <div className={`mt-2 text-[11px] ${isRight ? "text-white/85" : "text-slate-500 dark:text-slate-400"}`}>
        {href ? "Open →" : "—"}
      </div>
    </div>
  );

  return (
    <div className={`flex items-end gap-2 ${isRight ? "justify-end" : "justify-start"}`}>
      {!isRight && <AvatarChip label="PI" />}
      {href ? <Link href={href}>{bubble}</Link> : bubble}
      {isRight && <AvatarChip label="ADM" />}
    </div>
  );
}

function AvatarChip({ label }: { label: string }) {
  return (
    <div className="h-9 w-9 rounded-full border bg-background flex items-center justify-center text-[11px] font-semibold shadow-sm">
      {label}
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-start gap-2">
        <div className="rounded-full w-9 h-9 bg-muted animate-pulse" />
        <div className="h-16 w-[72%] rounded-2xl bg-muted animate-pulse" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="h-16 w-[74%] rounded-2xl bg-muted animate-pulse" />
        <div className="rounded-full w-9 h-9 bg-muted animate-pulse" />
      </div>
      <div className="flex items-center justify-start gap-2">
        <div className="rounded-full w-9 h-9 bg-muted animate-pulse" />
        <div className="h-16 w-[70%] rounded-2xl bg-muted animate-pulse" />
      </div>
    </div>
  );
}
