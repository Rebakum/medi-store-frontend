// "use client";

// import useCart from "@/features/cart/useCart";
// import Link from "next/link";

// export type Medicine = {
//   id: string;
//   name: string;
//   brand?: string | null;
//   manufacturer?: string | null;
//   price: number;
//   stock?: number | null;
//   images?: string[] | null;
// };

// export default function ProductCard({ p }: { p: Medicine }) {
//      const { add } = useCart();
//   const img = p.images?.[0]; // optional
//   return (
//     <div className="p-3 transition border rounded-xl hover:shadow-sm">
//       <Link href={`/product/${p.id}`} className="block">
//         <div className="aspect-[4/3] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
//           {img ? (
            
//             <img src={img} alt={p.name} className="object-cover w-full h-full" />
//           ) : (
//             <span className="text-xs text-gray-400">No image</span>
//           )}
//         </div>

//         <div className="mt-3 space-y-1">
//           <p className="font-medium line-clamp-1">{p.name}</p>
//           <p className="text-sm text-gray-500 line-clamp-1">
//             {p.brand || p.manufacturer || "—"}
//           </p>
//           <p className="mt-1 font-semibold">৳ {p.price}</p>
//         </div>
//       </Link>
//       <button
//         className="w-full py-2 mt-3 border rounded-lg"
//         onClick={() =>
//           add({
//             id: p.id,
//             name: p.name,
//             price: p.price,
//             image: p.images?.[0] || undefined,
//           })
//         }
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// }
