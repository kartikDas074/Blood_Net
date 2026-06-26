import { checkAccess, userInfo } from '@/lib/core/session';
import React from 'react';


const VolunteerLayout =async ({children}) => {
    const session=await userInfo();
    checkAccess(session,'volunteer');
    return (
        <div>
            {children}
        </div>
    );
};

export default VolunteerLayout;