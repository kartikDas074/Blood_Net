import { checkAccess, userInfo } from '@/lib/core/session';
import React from 'react';


const AdminLayout =async ({children}) => {
    const session=await userInfo();
    await checkAccess(session,'admin');
    return (
        <div>
            {children}
        </div>
    );
};

export default AdminLayout;