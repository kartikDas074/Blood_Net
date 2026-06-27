import { userInfo } from '@/lib/core/session';
import React from 'react';
import Myprofile from '../../Common/Myprofile';

const ProfilePage =async () => {
    const session=await userInfo();
    return (
        <div>
            <Myprofile user={session?.user}></Myprofile>
        </div>
    );
};

export default ProfilePage;