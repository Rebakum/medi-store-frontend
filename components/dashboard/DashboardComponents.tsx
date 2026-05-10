import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "cyan" | "emerald" | "purple" | "amber" | "rose";
}

const colorMap = {
  cyan: "from-cyan-500 to-teal-500",
  emerald: "from-emerald-500 to-green-500",
  purple: "from-purple-500 to-indigo-500",
  amber: "from-amber-500 to-orange-500",
  rose: "from-rose-500 to-pink-500",
};

export function StatCard({ title, value, icon: Icon, trend, color = "cyan" }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute -top-4 -right-4 w-28 h-28 bg-gradient-to-br ${colorMap[color]} opacity-10 rounded-full blur-3xl`} />
      
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`text-sm font-semibold ${trend.value >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-slate-500">{trend.label}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, action, className = "" }: DashboardCardProps) {
  return (
    <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

interface TableHeader {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps {
  headers: TableHeader[];
  data: Record<string, any>[];
  renderRow?: (item: Record<string, any>, index: number) => ReactNode;
}

export function DataTable({ headers, data, renderRow }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {headers.map((header) => (
              <th
                key={header.key}
                className={`px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase ${header.className || ""}`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center text-slate-500">
                No data available
              </td>
            </tr>
          ) : renderRow ? (
            data.map(renderRow)
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {headers.map((header) => (
                  <td key={header.key} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                    {item[header.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    info: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
