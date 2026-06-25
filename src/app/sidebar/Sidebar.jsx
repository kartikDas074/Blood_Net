import { handleLogout, userInfo } from '@/lib/core/session';
import React from 'react';
import SidebarComponent from './SidebarComponent';

const Sidebar = async () => {
    const session=await userInfo();
    const user=session?.user;
    console.log(user);
    return (
        <div>
            <SidebarComponent user={user} ></SidebarComponent>
        </div>
    );
};

export default Sidebar;