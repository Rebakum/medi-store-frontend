import ContactPage from "@/components/home/contact";
import HeroSlider from "@/components/home/HeroSlider";

import HomeMedicines from "@/components/home/HomeMedicines";
import HomeCategories from "@/components/home/HomeCategories";


import ReviewsHero from "@/components/home/ReviewsHero";
import WhyChooseUs from "@/components/home/WhyChoose";
import FeaturedBrands from "@/components/home/FeatcherBrands";
import HowItWorks from "@/components/home/HowItWorks";


export default function Home() {
  return (
    <>
    <HeroSlider /> 
    <HomeCategories/>    
    <HomeMedicines />   
    <WhyChooseUs/>
    <FeaturedBrands/>
    <HowItWorks/>  
    <ReviewsHero />
    

      {/* rest of home */}
    </>
  );
}
