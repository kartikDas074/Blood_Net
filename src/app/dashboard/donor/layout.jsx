import { checkAccess, userInfo } from '@/lib/core/session';
import React from 'react';


const DonorLayout =async ({children}) => {
    const session=await userInfo();
    await checkAccess(session,'donor');
    return (
        <div>
            {children}
        </div>
    );
};

export default DonorLayout;