import { getFunding, getTotalFunding } from '@/lib/api/FindData';
import React from 'react';
import FundingPage from './FundingDonation';
import { userInfo } from '@/lib/core/session';
import { redirect } from 'next/navigation';



const page = async () => {
  const user=await userInfo();
  if(!user){
    redirect('/signin');
  }
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