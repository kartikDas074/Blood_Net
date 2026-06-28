import { getFunding, getTotalFunding } from '@/lib/api/FindData';
import React from 'react';
import FundingPage from './FundingDonation';


const page = async () => {
  const result=await getFunding();
  const totalfunding=await getTotalFunding();
  let total=0;
  if(totalfunding.success){
          total=totalfunding.totalAmount;
  }
  return (
    <div>
      <FundingPage data={result} total={total}></FundingPage>
    </div>
  );
};

export default page;