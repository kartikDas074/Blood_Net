import { userInfo } from '@/lib/core/session';
import React from 'react';
import CreateRequest from '../../Common/CreateRequest';

const CreateDonation = async () => {
    const session=await userInfo();
    return (
        <div>
            <CreateRequest user={session?.user}></CreateRequest>
        </div>
    );
};

export default CreateDonation;