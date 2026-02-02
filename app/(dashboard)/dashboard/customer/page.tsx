import RoleGuard from "@/components/common/role-guard";

export default function CustomerDashboard() {
  return (
    <RoleGuard allow={["CUSTOMER"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Customer Dashboard</h1>
      </div>
    </RoleGuard>
  );
}
