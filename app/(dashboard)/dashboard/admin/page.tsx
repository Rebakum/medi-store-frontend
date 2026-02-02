import RoleGuard from "@/components/common/role-guard";

export default function AdminDashboard() {
  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white shadow rounded-xl">Users</div>
          <div className="p-4 bg-white shadow rounded-xl">Orders</div>
          <div className="p-4 bg-white shadow rounded-xl">Products</div>
          <div className="p-4 bg-white shadow rounded-xl">Revenue</div>
        </div>
      </div>
    </RoleGuard>
  );
}
