"use client";

import RoleGuard from "@/components/common/role-guard";
import SellerMedicinesPage from "../../seller/medicines/page"; // reuse if path works

export default function AdminMedicinesPage() {
  return (
    <RoleGuard allow={["ADMIN"]}>
      <SellerMedicinesPage />
    </RoleGuard>
  );
}
