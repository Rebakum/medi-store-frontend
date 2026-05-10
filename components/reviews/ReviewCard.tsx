// "use client";

// import { useEffect, useMemo, useState } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";

// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// export default function ReviewsGrid({ reviews }: { reviews: any[] }) {
//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   const items = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);
//   const [index, setIndex] = useState(0);

//   // যদি data কমে যায় (filter/pagination) index out of range না হয়
//   useEffect(() => {
//     if (index >= items.length) setIndex(0);
//   }, [items.length, index]);

//   const prev = () => {
//     if (!items.length) return;
//     setIndex((i) => (i - 1 + items.length) % items.length);
//   };

//   const next = () => {
//     if (!items.length) return;
//     setIndex((i) => (i + 1) % items.length);
//   };

//   if (!items.length) {
//     return (
//       <section className="px-4 py-16">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-xl font-semibold text-slate-900">What customers say</h2>
//           <p className="mt-1 text-sm text-slate-500">No reviews yet.</p>
//         </div>
//       </section>
//     );
//   }

//   const active = items[index];

//   // avatar fallback (তোমার data অনুযায়ী field adjust করে নিও)
//   const avatar =
//     active?.user?.avatar ||
//     active?.customer?.avatar ||
//     active?.userImage ||
//     active?.avatar ||
//     "/avatar-placeholder.png";

//   const name =
//     active?.user?.name ||
//     active?.customer?.name ||
//     active?.name ||
//     "Anonymous";

//   const title =
//     active?.medicine?.name ||
//     active?.product?.name ||
//     active?.title ||
//     "Verified Customer";

//   const message =
//     active?.comment ||
//     active?.review ||
//     active?.message ||
//     active?.text ||
//     "";

//   return (
//     <section className="bg-[#032433] text-white py-20 px-4">
//       <div
//         data-aos="fade-right"
//         data-aos-delay="200"
//         className="max-w-4xl mx-auto text-center"
//       >
//         <p className="mb-2 font-semibold text-red-400">Testimonials</p>
//         <h2 className="mb-12 text-3xl font-bold md:text-5xl">
//           Customer Success Stories <br /> and Reviews
//         </h2>

//         <div
//           data-aos="fade-right"
//           data-aos-delay="400"
//           className="relative px-6 py-10 text-gray-800 bg-white shadow-md rounded-xl sm:px-8 sm:py-12"
//         >
//           {/* Avatar dots */}
//           <div className="flex flex-wrap justify-center gap-2 mb-6">
//             {items.map((t, i) => {
//               const a =
//                 t?.user?.avatar ||
//                 t?.customer?.avatar ||
//                 t?.userImage ||
//                 t?.avatar ||
//                 "/avatar-placeholder.png";

//               const n = t?.user?.name || t?.customer?.name || t?.name || "User";

//               return (
//                 <button
//                   key={t?.id ?? i}
//                   onClick={() => setIndex(i)}
//                   className="focus:outline-none"
//                   aria-label={`Go to review ${i + 1}`}
//                   type="button"
//                 >
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img
//                     src={a}
//                     alt={n}
//                     className={`w-10 h-10 rounded-full border-2 ${
//                       i === index
//                         ? "border-pink-500 scale-110 opacity-100"
//                         : "border-transparent opacity-50"
//                     } transition-all duration-300`}
//                   />
//                 </button>
//               );
//             })}
//           </div>

//           {/* Message */}
//           <p className="mb-6 text-lg italic leading-relaxed">
//             “{message || "Great service and fast delivery!"}”
//           </p>

//           {/* Name + Title */}
//           <div>
//             <p className="font-bold">{name}</p>
//             <p className="text-sm text-gray-600">{title}</p>
//           </div>

//           {/* Optional: subtle quote mark */}
//           <div className="absolute grid w-10 h-10 text-white bg-pink-500 rounded-full shadow -top-5 left-6 place-items-center">
//             <span className="text-xl leading-none">“</span>
//           </div>
//         </div>

//         {/* Navigation Arrows */}
//         <div className="flex justify-center mt-8 space-x-6">
//           <button
//             onClick={prev}
//             className="p-3 text-gray-800 transition bg-white rounded-full hover:bg-gray-200"
//             type="button"
//             aria-label="Previous review"
//           >
//             <FaArrowLeft />
//           </button>

//           <button
//             onClick={next}
//             className="p-3 text-gray-800 transition bg-white rounded-full hover:bg-gray-200"
//             type="button"
//             aria-label="Next review"
//           >
//             <FaArrowRight />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
