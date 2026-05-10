"use client";

type Variant = "badge" | "text" | "dot";

type Props = {
  variant?: Variant;
  isOnline?: boolean;
};

export default function RealtimeStatus({
  variant = "text",
  isOnline = true,
}: Props) {
  // ===== BADGE STYLE =====
  if (variant === "badge") {
    return (
      <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-full">
        {isOnline ? "● Live" : "● Offline"}
      </span>
    );
  }

  // ===== DOT STYLE =====
  if (variant === "dot") {
    return (
      <span
        className={`h-3 w-3 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
      />
    );
  }

  // ===== DEFAULT TEXT =====
  return (
    <p className="text-sm text-green-600">
      {isOnline ? "● Live" : "● Offline"}
    </p>
  );
}