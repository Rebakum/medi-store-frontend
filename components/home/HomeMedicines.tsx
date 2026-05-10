// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { api } from "@/lib/api";
// import type { Medicine } from "@/lib/types";
// import MedicineCard from "../common/MedicineCard";

// export default function HomeMedicines() {
//   const [items, setItems] = useState<Medicine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         //  Home page: 12 items
//         const res = await api<{ data: Medicine[] }>("/medicines?status=ACTIVE&limit=12&sortBy=createdAt&sortOrder=desc");
//         setItems(res.data ?? []);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <section className="py-10">
//       <div className="px-4 mx-auto space-y-5 max-w-7xl">
//         {/* header */}
      
//           {/* header */}
//           <div className="flex flex-col items-center gap-4 mb-10 text-center">
//             <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
//     <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
//               TRENDING NOW
//             </div>

//             <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
//               Popular <span className="text-[#2EB0D9]">Medicines</span>
//             </h2>

//             <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
//               Explore the latest additions and customer favorites — verified products,
//               clear details, and great pricing for everyday health needs.
//             </p>
//              {/* accent line + glow */}
//               <div className="relative w-24 h-1 mx-auto mt-5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
//                 <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4]" />
//                 <div className="absolute inset-0 blur-md opacity-40 bg-[#2EB0D9]" />
//               </div>

           
//           </div>


//         {/* grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
//             {Array.from({ length: 12 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-[260px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 animate-pulse"
//               />
//             ))}
//           </div>
//         ) : items.length === 0 ? (
//           <div className="p-8 text-center border rounded-2xl border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5">
//             <p className="text-sm text-slate-600 dark:text-slate-300">
//               No medicines found.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {items.slice(0, 8).map((m) => (
//               <MedicineCard key={m.id} m={m} />
//             ))}
//           </div>
//         )}
//          <div className="flex items-center justify-center mt-10 ">
//           <Link
//               href="/shop?sort=latest"
//              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
//                        bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
//           >
//               Shop Now
//             </Link>
//          </div>
       
//       </div>
//     </section>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Medicine } from "@/lib/types";
import MedicineCard from "@/components/common/MedicineCard";
import HeroSkeleton from "@/components/HeroSkeleton";

export default function HomeMedicines() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api<{ data: Medicine[] }>(
          "/medicines?status=ACTIVE&limit=12&sortBy=createdAt&sortOrder=desc"
        );

        setItems(res.data ?? []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-10">
        <div className="px-4 mx-auto space-y-6 max-w-7xl">
          <HeroSkeleton />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="px-4 mx-auto space-y-6 max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
    <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
              TRENDING NOW
            </div>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Popular <span className="text-[#2EB0D9]">Medicines</span>
            </h2>

            <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Explore the latest additions and customer favorites — verified products,
              clear details, and great pricing for everyday health needs.
            </p>
             {/* accent line + glow */}
              <div className="relative w-24 h-1 mx-auto mt-5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4]" />
                <div className="absolute inset-0 blur-md opacity-40 bg-[#2EB0D9]" />
              </div>

           
          </div>

        {/* GRID */}
        {items.length === 0 ? (
          <p className="text-center">No medicines found</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.slice(0, 8).map((m) => (
              <MedicineCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
