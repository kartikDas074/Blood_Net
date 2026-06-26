import { getDonateDetail } from '@/lib/api/FindData';
import { userInfo } from '@/lib/core/session';
import React from 'react';
import DonationDetail from './DonationDetail';

const DonationDetailPage = async ({params}) => {
    const {id}=await params;
    const result=await getDonateDetail(id);
    const data=result?.data;
    const userinfo=await userInfo();
    return (
        <div>
            <DonationDetail request={data} user={userinfo?.user}></DonationDetail>
        </div>
    );
};

export default DonationDetailPage;