import { userInfo } from '@/lib/core/session';
import React from 'react';
import Myprofile from '../../Common/Myprofile';
import { getFunding } from '@/lib/api/FindData';

const ProfilePage =async () => {
    const session=await userInfo();
    const result=await getFunding(1);
    console.log(result);
    return (
        <div>
            <Myprofile user={session?.user} totalAmount={result?.totalAmount}></Myprofile>
        </div>
    );
};

export default ProfilePage;