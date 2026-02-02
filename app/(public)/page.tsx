"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/categories")
      .then(res => setData(res.data))
      .catch(err => setData(err.message));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>API CONNECT TEST</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
