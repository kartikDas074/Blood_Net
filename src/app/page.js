import { allInfo } from '@/lib/api/FindData';
import React from 'react';
import HeroSection from './HomeComponent/HeroSection';
import FeatureSection from './HomeComponent/FeatureSection';
import SupportSection from './HomeComponent/ContactUs';

const page = async () => {
    const allData=await allInfo();
    const statisTics=allData.statistics;
    return (
        <div>
           <HeroSection stat={statisTics}></HeroSection>
           <FeatureSection></FeatureSection>
           <SupportSection></SupportSection>
        </div>
    );
};

export default page;