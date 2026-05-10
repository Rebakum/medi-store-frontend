"use client";

import dynamic from "next/dynamic";

const SupportWidget = dynamic(
  () => import("@/components/faqSupportWidget"),
  { ssr: false }
);

const faqData = [
  {
    question: "Do I need a prescription to order medicines?",
    answer:
      "Yes, prescription medicines require a valid doctor’s prescription.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery usually takes 1–3 days.",
  },
  {
    question: "Are your medicines authentic?",
    answer: "Yes, 100% authentic medicines.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards, mobile payments, and cash on delivery.",
  },
  {
    question: "Can I return or exchange medicines?",
    answer:
      "Due to safety reasons, we do not accept returns or exchanges on medicines.",
  },   
  {
    question: "How can I track my order?",
    answer: "You can track your order through the link provided in your order confirmation email.",
  },
   {
    question: "Do you offer customer support?",
    answer: "Yes, our support team is available 24/7 to assist you.",
  },
   {
    question: "Can I order over the phone?",
    answer: "Currently, we only accept orders through our website and mobile app.",
  },
   {
    question: "Is my personal information secure?",
    answer: "Yes, we use industry-standard security measures to protect your data.",  
  } ,
{
    question: "Do you offer discounts or promotions?",
    answer: "Yes, we regularly offer discounts and promotions. Sign up for our newsletter to stay updated.",  
},
{
    question: "Can I change or cancel my order?",
    answer: "You can change or cancel your order within 1 hour of placing it by contacting our support team.",  
},
{
    question: "Do you deliver to my area?",
    answer: "We deliver to most areas. Please enter your zip code at checkout to see if we deliver to your location.",
}
  
];

export default function Faq() {
  return (
    <section className="px-4 py-10 mx-auto max-w-7xl">
      <div className="flex flex-col items-center gap-4 mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
    <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
              TRENDING NOW
            </div>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
               FAQ  <span className="text-[#2EB0D9]">Section</span>
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
     

      {/* ✅ CLIENT ONLY COMPONENT */}
      <SupportWidget faqs={faqData} />
    </section>
  );
}