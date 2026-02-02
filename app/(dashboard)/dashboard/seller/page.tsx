import RoleGuard from "@/components/common/role-guard";

export default function SellerDashboard() {
  return (
    <RoleGuard allow={["SELLER"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
      </div>
    </RoleGuard>
  );
}
