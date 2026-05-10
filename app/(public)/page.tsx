import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import HomeMedicines from "@/components/home/HomeMedicines";
import HomeCategories from "@/components/home/HomeCategories";
import ReviewsHero from "@/components/home/ReviewsHero";
import WhyChooseUs from "@/components/home/WhyChoose";
import FeaturedBrands from "@/components/home/FeatcherBrands";
import HowItWorks from "@/components/home/HowItWorks";
import Faq from "@/components/home/faq";
import HomeMedicinesSkeleton from "@/components/skeletons/HomeMedicinesSkeleton";
import HomeCategoriesSkeleton from "@/components/skeletons/HomeCategoriesSkeleton";
import HeroSkeleton from "@/components/HeroSkeleton";

export default function Home() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider />
      </Suspense>

      <Suspense fallback={<HomeCategoriesSkeleton />}>
        <HomeCategories />
      </Suspense>
      <Suspense fallback={<HomeMedicinesSkeleton />}>
        <HomeMedicines />
      </Suspense>

      <WhyChooseUs />
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <FeaturedBrands />
      </Suspense>

      <HowItWorks />
      <Faq />
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-[3px] border-[#2EB0D9]/30 border-t-[#2EB0D9] rounded-full animate-spin" />
        </div>
      }>
        <ReviewsHero />
      </Suspense>
    </>
  );
}
